import { ThunkType } from '../store';
import { usersAPI } from '../../dal/api';
import axios from 'axios';
import { handleAppError, handleNetworkError } from '../../helpers/error-util';
import { Dispatch } from 'redux';
import {
  setFollowedUsersReducer,
  setUsersReducer,
  toggleFollowingInProgressReducer,
  toggleFollowReducer,
  toggleLoadingReducer,
} from './users-reducer';
import { setIsFollowedUserReducer } from '../profile/profile-reducer';

const setUsers = (
  page: number, pageSize: number, name?: string | undefined): ThunkType => async(dispatch, getState) => {
  dispatch(toggleLoadingReducer({ isLoading: true }));
  try {
    const res = await usersAPI.getUsers({ page, count: pageSize, term: name });
    dispatch(setUsersReducer({ users: res.data.items, totalUsersCount: res.data.totalCount }));
  } catch (err) {
    if (axios.isAxiosError(err)) {
      handleNetworkError(err.message, dispatch);
    }
  }
  dispatch(toggleLoadingReducer({ isLoading: false }));
};

const setFriends = () => async(dispatch: Dispatch) => {
  dispatch(toggleLoadingReducer({ isLoading: true }));
  try {
    const res = await usersAPI.getUsers({ page: 1, count: 100, friend: true });
    dispatch(setFollowedUsersReducer({ users: res.data.items }));
  } catch (err) {
    if (axios.isAxiosError(err)) {
      handleNetworkError(err.message, dispatch);
    }
  }
  dispatch(toggleLoadingReducer({ isLoading: false }));
};

const follow = (userId: number): ThunkType => async(dispatch, getState) => {
  dispatch(toggleFollowingInProgressReducer({ id: userId, followingInProgress: true }));
  try {
    const res = await usersAPI.followPostRequest(userId);
    if (res.resultCode === 0) {
      dispatch(toggleFollowReducer({ id: userId, isFollowed: true }));
      dispatch(setIsFollowedUserReducer({ isFollowed: true }));
      const followedUser = getState().users.users.filter(el => el.id === userId);
      const currentFollowedUsers = getState().users.followedUsers.concat(followedUser);
      dispatch(setFollowedUsersReducer({ users: currentFollowedUsers }));
    } else {
      handleAppError(res.data, dispatch);
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      handleNetworkError(err.message, dispatch);
    }
  }
  dispatch(toggleFollowingInProgressReducer({ id: userId, followingInProgress: false }));
};

const unFollow = (userId: number): ThunkType => async(dispatch, getState) => {
  dispatch(toggleFollowingInProgressReducer({ id: userId, followingInProgress: true }));
  try {
    const res = await usersAPI.unFollowDeleteRequest(userId);
    if (res.resultCode === 0) {
      dispatch(toggleFollowReducer({ id: userId, isFollowed: false }));
      dispatch(toggleFollowingInProgressReducer({ id: userId, followingInProgress: false }));
      dispatch(setIsFollowedUserReducer({ isFollowed: false }));
      const currentFollowedUsers = getState().users.followedUsers.filter(el => el.id !== userId);
      dispatch(setFollowedUsersReducer({ users: currentFollowedUsers }));
    } else {
      handleAppError(res.data, dispatch);
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      handleNetworkError(err.message, dispatch);
    }
  }
};

export const usersAsyncActions = { setUsers, setFriends, follow, unFollow };
