import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserType } from '../../dal/types';

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
    setUsersReducer(state, action: PayloadAction<{ users: UserType[], totalUsersCount: number }>) {
      state.users = action.payload.users.map(el => ({ ...el, key: el.id }));
      state.totalUsersCount = action.payload.totalUsersCount;
    },
    setFollowedUsersReducer(state, action: PayloadAction<{ users: UserType[] }>) {
      state.followedUsers = action.payload.users.map(el => ({ ...el, key: el.id }));
    },
    toggleLoadingReducer(state, action: PayloadAction<{ isLoading: boolean }>) {
      state.loading = action.payload.isLoading;
    },
    toggleFollowReducer(state, action: PayloadAction<{ id: number, isFollowed: boolean }>) {
      state.users = state.users.map(el => (el.id === action.payload.id
        ? { ...el, followed: action.payload.isFollowed }
        : el));
    },
    toggleFollowingInProgressReducer(state, action: PayloadAction<{ id: number, followingInProgress: boolean }>) {
      if (action.payload.followingInProgress) {
        state.followingInProgress.push(action.payload.id);
      } else {
        state.followingInProgress = state.followingInProgress.filter(el => el !== action.payload.id);
      }
    },
    setCurrentPageReducer(state, action: PayloadAction<{ page: number }>) {
      state.currentPage = action.payload.page;
    },
    setSearchUserNameReducer(state, action: PayloadAction<{ name: string | undefined }>) {
      state.searchUserName = action.payload.name;
    },
  },
});

export const usersReducer = slice.reducer;
export const {
  setCurrentPageReducer,
  setFollowedUsersReducer,
  setSearchUserNameReducer,
  setUsersReducer,
  toggleFollowingInProgressReducer,
  toggleFollowReducer,
  toggleLoadingReducer,
} = slice.actions;


