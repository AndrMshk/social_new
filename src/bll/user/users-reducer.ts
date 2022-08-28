import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserType } from '../../dal/types';
import { usersAPI } from '../../dal/api';
import axios from 'axios';
import { handleAppError, handleNetworkError } from '../../helpers/error-util';
import { RootStateType } from '../store';
import { setIsFollowedUserReducer } from '../profile/profile-reducer';

const setUsers = createAsyncThunk('users/set-users',
  async(
    params: { page: number, pageSize: number, name?: string | undefined },
    { dispatch, rejectWithValue }) => {
    try {
      dispatch(toggleLoadingReducer({ isLoading: true }));
      const res = await usersAPI.getUsers({ page: params.page, count: params.pageSize, term: params.name });
      return { users: res.data.items, totalUsersCount: res.data.totalCount };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        handleNetworkError(err.message, dispatch);
        return rejectWithValue(err.message);
      }
      return rejectWithValue('some error');
    } finally {
      dispatch(toggleLoadingReducer({ isLoading: false }));
    }
  });

const setFriends = createAsyncThunk('users/set-friends',
  async(params, { dispatch }) => {
    try {
      dispatch(toggleLoadingReducer({ isLoading: true }));
      const res = await usersAPI.getUsers({ page: 1, count: 100, friend: true });
      dispatch(setFriendsReducer({ users: res.data.items }));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        handleNetworkError(err.message, dispatch);
      }
    } finally {
      dispatch(toggleLoadingReducer({ isLoading: false }));
    }
  });

const follow = createAsyncThunk('users/follow-to-user',
  async(params: { userId: number }, { dispatch, getState, rejectWithValue }) => {
    const state = getState() as RootStateType;
    try {
      dispatch(toggleFollowingInProgressReducer({ id: params.userId, followingInProgress: true }));
      const res = await usersAPI.followPostRequest(params.userId);
      if (res.resultCode === 0) {
        dispatch(setIsFollowedUserReducer({ isFollowed: true }));
        const followedUser = state.users.users.filter(el => el.id === params.userId);
        const currentFollowedUsers = state.users.followedUsers.concat(followedUser);
        dispatch(setFriendsReducer({ users: currentFollowedUsers }));
        return { id: params.userId, isFollowed: true };
      } else {
        handleAppError(res.data, dispatch);
        return rejectWithValue('some error');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        handleNetworkError(err.message, dispatch);
        return rejectWithValue(err.message);
      }
    } finally {
      dispatch(toggleFollowingInProgressReducer({ id: params.userId, followingInProgress: false }));
    }
  });

const unFollow = createAsyncThunk('users/unFollow-to-user',
  async(params: { userId: number }, { dispatch, getState, rejectWithValue }) => {
    const state = getState() as RootStateType;
    try {
      dispatch(toggleFollowingInProgressReducer({ id: params.userId, followingInProgress: true }));
      const res = await usersAPI.unFollowDeleteRequest(params.userId);
      if (res.resultCode === 0) {
        dispatch(toggleFollowingInProgressReducer({ id: params.userId, followingInProgress: false }));
        dispatch(setIsFollowedUserReducer({ isFollowed: false }));
        const currentFollowedUsers = state.users.followedUsers.filter(el => el.id !== params.userId);
        dispatch(setFriendsReducer({ users: currentFollowedUsers }));
        return { id: params.userId, isFollowed: false };
      } else {
        handleAppError(res.data, dispatch);
        return rejectWithValue('some error');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        handleNetworkError(err.message, dispatch);
        return rejectWithValue(err.message);
      }
    } finally {
      dispatch(toggleFollowingInProgressReducer({ id: params.userId, followingInProgress: false }));
    }
  });

const getIsFriend = createAsyncThunk('users/get-is-friend',
  async(params: { userId: number }, { dispatch, rejectWithValue }) => {
    try {
      const res = await usersAPI.getIsFollowRequest(params.userId);
      dispatch(setIsFollowedUserReducer({ isFollowed: res }));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        handleNetworkError(err.message, dispatch);
        return rejectWithValue(err.message);
      }
    }
  });


export const usersAsyncActions = { setUsers, setFriends, follow, unFollow, getIsFriend };

const slice = createSlice({
  name: 'users',
  initialState: {
    users: [] as UserType[],
    followedUsers: [] as UserType[],
    pageSize: 8,
    totalUsersCount: 0,
    currentPage: 1,
    loading: false,
    followingInProgress: [] as number[],
    searchUserName: undefined as string | undefined,
  },
  reducers: {
    setFriendsReducer(state, action: PayloadAction<{ users: UserType[] }>) {
      state.followedUsers = action.payload.users.map(el => ({ ...el, key: el.id }));
    },
    toggleLoadingReducer(state, action: PayloadAction<{ isLoading: boolean }>) {
      state.loading = action.payload.isLoading;
    },
    toggleFollowingInProgressReducer(state, action: PayloadAction<{ id: number, followingInProgress: boolean }>) {
      if (action.payload.followingInProgress) {
        state.followingInProgress.push(action.payload.id);
      } else {
        state.followingInProgress = state.followingInProgress.filter(el => el !== action.payload.id);
      }
    },
    setSearchUserNameReducer(state, action: PayloadAction<{ name: string | undefined }>) {
      state.searchUserName = action.payload.name;
    },
  },
  extraReducers: builder => {
    builder.addCase(setUsers.fulfilled, (state, action) => {
        state.users = action.payload.users.map((el: UserType) => ({ ...el, key: el.id }));
        state.totalUsersCount = action.payload.totalUsersCount;
      })
      .addCase(follow.fulfilled, (state, action) => {
        state.users = state.users.map(el => (el.id === action.payload?.id
          ? { ...el, followed: action.payload.isFollowed }
          : el));
      })
      .addCase(unFollow.fulfilled, (state, action) => {
        state.users = state.users.map(el => (el.id === action.payload?.id
          ? { ...el, followed: action.payload.isFollowed }
          : el));
      });
  },
});

export const usersReducer = slice.reducer;
export const {
  setFriendsReducer,
  setSearchUserNameReducer,
  toggleFollowingInProgressReducer,

  toggleLoadingReducer,
} = slice.actions;


