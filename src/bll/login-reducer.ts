import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { setAppStatus } from './app-reducer';
import { authAPI } from '../dal/api';
import { LoginParamsType } from '../dal/types';
import { handleAppError, handleNetworkError } from '../helpers/error-util';
import axios from 'axios';

type InitialStateType = {
  userId: number | null
  email: string | null
  isAuth: boolean
}

const slice = createSlice({
  name: 'login',
  initialState: {
    userId: null,
    email: '',
    isAuth: false,
  } as InitialStateType,
  reducers: {
    login(
      state,
      action: PayloadAction<InitialStateType>) {
      return { ...state, ...action.payload };
    },
  },
});

export const loginReducer = slice.reducer;
export const { login } = slice.actions;

export const loginTC = (data: LoginParamsType) => async(dispatch: Dispatch) => {
  dispatch(setAppStatus({ isLoading: true }));
  try {
    const res = await authAPI.loginRequest(data.email, data.password, data.rememberMe);
    if (res.data.resultCode === 0) {
      dispatch(login({ userId: res.data.data.userId, email: data.email, isAuth: true }));
    } else {
      handleAppError(res.data, dispatch);
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      handleNetworkError(err.message, dispatch);
    }
  }
  dispatch(setAppStatus({ isLoading: false }));
};

export const logoutTC = (isAuth: boolean) => async(dispatch: Dispatch) => {
  dispatch(setAppStatus({ isLoading: true }));
  try {
    await authAPI.logoutRequest();
    dispatch(login({ userId: null, email: null, isAuth }));
  } catch (err) {
    if (axios.isAxiosError(err)) {
      handleNetworkError(err.message, dispatch);
    }
  }
  dispatch(setAppStatus({ isLoading: false }));
};




