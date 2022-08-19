import { createAsyncThunk } from '@reduxjs/toolkit';
import { LoginParamsType } from '../../dal/types';
import { setAppStatus } from '../app/app-reducer';
import { authAPI } from '../../dal/api';
import { handleAppError, handleNetworkError } from '../../helpers/error-util';
import axios from 'axios';

const loginTC = createAsyncThunk('login/login',
  async(params: LoginParamsType, { dispatch }) => {
    dispatch(setAppStatus({ isLoading: true }));
    try {
      const res = await authAPI.loginRequest(params.email, params.password, params.rememberMe);
      if (res.data.resultCode === 0) {
        dispatch(setAppStatus({ isLoading: false }));
        return { userId: res.data.data.userId, email: params.email, isAuth: true };
      } else {
        handleAppError(res.data, dispatch);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        handleNetworkError(err.message, dispatch);
      }
    }
  });

const logoutTC = createAsyncThunk('login/logout', async(params, { dispatch }) => {
  dispatch(setAppStatus({ isLoading: true }));
  try {
    await authAPI.logoutRequest();
    dispatch(setAppStatus({ isLoading: false }));
    return { userId: null, email: null, isAuth: false };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      handleNetworkError(err.message, dispatch);
    }
  }
});

export const loginAsyncActions = { loginTC, logoutTC };