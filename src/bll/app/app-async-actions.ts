import { createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI, profileAPI } from '../../dal/api';
import { handleAppError, handleNetworkError } from '../../helpers/error-util';
import axios from 'axios';
import { loginLogoutReducer } from '../login/login-reducer';
import { getStatus, setProfile, setStatus } from '../profile/profile-reducer';

const setAppInitialized = createAsyncThunk('app/set-initialized',
  async(params, { dispatch }) => {
    try {
      const res = await authAPI.me();
      if (res.data.resultCode == 0) {
        const profileData = await profileAPI.getProfile(res.data.data.id);
        dispatch(setProfile(profileData.data));
        dispatch(getStatus({ userId: res.data.data.id}))
        dispatch(loginLogoutReducer({ userId: res.data.data.id, email: res.data.data.email, isAuth: true }));
      } else {
        handleAppError(res.data, dispatch);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        handleNetworkError(err.message, dispatch);
      }
    }
    return { isInitialized: true };
  });

export const appAsyncActions = { setAppInitialized };
