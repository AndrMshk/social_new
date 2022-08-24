import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { profileAPI } from '../../dal/api';
import { handleNetworkError } from '../../helpers/error-util';
import { setProfile, setStatus } from './profile-reducer';

export const setProfileTC = createAsyncThunk('profile/set-profile',
  async(params: { userId: number }, { dispatch }) => {
    try {
      const res = await profileAPI.getProfile(params.userId);
      dispatch(setProfile(res.data));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        handleNetworkError(err.message, dispatch);
      }
    }
  });

export const getStatusTC = createAsyncThunk('profile/set-status',
  async(params: { userId: number }, { dispatch }) => {
    try {
      const status = await profileAPI.getStatus(params.userId);
      dispatch(setStatus({ status: status.data }));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        handleNetworkError(err.message, dispatch);
      }
    }
  });
