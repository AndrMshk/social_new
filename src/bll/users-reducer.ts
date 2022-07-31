import { Dispatch } from 'redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { usersAPI } from '../dal/api';
import axios from 'axios';
import { handleAppError, handleNetworkError } from '../helpers/error-util';
import { UserType } from '../dal/types';

type InitialStateType = {
  users: UserType[]
  followedUsers: UserType[],
  pageSize: number
  totalUsersCount: number
  currentPage: number
  loading: boolean
  followingInProgress: number[]
}

const slice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    followedUsers: [],
    pageSize: 8,
    totalUsersCount: 0,
    currentPage: 1,
    loading: false,
    followingInProgress: [],
  } as InitialStateType,
  reducers: {
    setUsers(state, action: PayloadAction<{ users: UserType[], totalUsersCount: number }>) {
      state.users = action.payload.users.map(el => ({ ...el, key: el.id }));
      state.totalUsersCount = action.payload.totalUsersCount;
    },
    setFollowedUsers(state, action: PayloadAction<{ users: UserType[] }>) {
      state.followedUsers = action.payload.users.map(el => ({ ...el, key: el.id }));
    },
    toggleLoading(state, action: PayloadAction<{ isLoading: boolean }>) {
      state.loading = action.payload.isLoading;
    },
    toggleFollow(state, action: PayloadAction<{ id: number, isFollowed: boolean }>) {
      state.users = state.users.map(el => (el.id === action.payload.id
        ? { ...el, followed: action.payload.isFollowed }
        : el));
    },
    toggleFollowingInProgress(state, action: PayloadAction<{ id: number, followingInProgress: boolean }>) {
      if (action.payload.followingInProgress) {
        state.followingInProgress.push(action.payload.id);
      } else {
        state.followingInProgress = state.followingInProgress.filter(el => el !== action.payload.id);
      }
    },
    setCurrentPage(state, action: PayloadAction<{ page: number }>) {
      state.currentPage = action.payload.page;
    },
  },
});

export const usersReducer = slice.reducer;
export const {
  setUsers, toggleLoading,
  toggleFollow, toggleFollowingInProgress, setCurrentPage,
  setFollowedUsers,
} = slice.actions;

export const setUsersTC = (currentPage: number, pageSize: number) => async(dispatch: Dispatch) => {
  dispatch(toggleLoading({ isLoading: true }));
  dispatch(setCurrentPage({ page: currentPage }));
  try {
    const res = await usersAPI.getUsers(currentPage, pageSize);
    dispatch(setUsers({ users: res.data.items, totalUsersCount: res.data.totalCount }));
  } catch (err) {
    if (axios.isAxiosError(err)) {
      handleNetworkError(err.message, dispatch);
    }
  }
  dispatch(toggleLoading({ isLoading: false }));
};

export const setFollowedUsersTC = () => async(dispatch: Dispatch) => {
  dispatch(toggleLoading({ isLoading: true }));
  try {
    const res = await usersAPI.getFollowedUsers(true);
    dispatch(setFollowedUsers({ users: res.data.items }));
  } catch (err) {
    if (axios.isAxiosError(err)) {
      handleNetworkError(err.message, dispatch);
    }
  }
  dispatch(toggleLoading({ isLoading: false }));
};

export const findUsersTC = (name: string) => async(dispatch: Dispatch) => {
  dispatch(toggleLoading({ isLoading: true }));
  try {
    const res = await usersAPI.findUsers(name);
    console.log(res);
    // dispatch(setUsers({ users: res.data.items, totalUsersCount: res.data.totalCount }));
  } catch (err) {
    if (axios.isAxiosError(err)) {
      handleNetworkError(err.message, dispatch);
    }
  }
  dispatch(toggleLoading({ isLoading: false }));
};

export const followTC = (userId: number) => async(dispatch: Dispatch) => {
  dispatch(toggleFollowingInProgress({ id: userId, followingInProgress: true }));
  try {
    const res = await usersAPI.followPostRequest(userId);
    if (res.resultCode === 0) {
      dispatch(toggleFollow({ id: userId, isFollowed: true }));
    } else {
      handleAppError(res.data, dispatch);
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      handleNetworkError(err.message, dispatch);
    }
  }
  dispatch(toggleFollowingInProgress({ id: userId, followingInProgress: false }));
};

export const unFollowTC = (userId: number) => async(dispatch: Dispatch) => {
  dispatch(toggleFollowingInProgress({ id: userId, followingInProgress: true }));
  try {
    const res = await usersAPI.unFollowDeleteRequest(userId);
    if (res.resultCode === 0) {
      dispatch(toggleFollow({ id: userId, isFollowed: false }));
      dispatch(toggleFollowingInProgress({ id: userId, followingInProgress: false }));
    } else {
      handleAppError(res.data, dispatch);
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      handleNetworkError(err.message, dispatch);
    }
  }
};