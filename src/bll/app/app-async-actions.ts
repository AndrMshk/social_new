import { createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI, profileAPI } from '../../dal/api';
import { setProfile, setStatus } from '../profile/profile-reducer';
import { login } from '../login/login-reducer';
import { handleAppError, handleNetworkError } from '../../helpers/error-util';
import axios from 'axios';

const setAppInitializedTC = createAsyncThunk('app/set-initialized',
  async(params, { dispatch }) => {
    try {
      const res = await authAPI.me();
      if (res.data.resultCode == 0) {
        const profileData = await profileAPI.getProfile(res.data.data.id);
        dispatch(setProfile(profileData.data));
        const status = await profileAPI.getStatus(res.data.data.id);
        dispatch(setStatus({ status: status.data }));
        dispatch(login({ userId: res.data.data.id, email: res.data.data.email, isAuth: true }));
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

export const appAsyncActions = {
  setAppInitializedTC,
};