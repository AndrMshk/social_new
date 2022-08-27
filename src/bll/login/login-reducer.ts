import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginParamsType } from '../../dal/types';
import { setAppStatusReducer } from '../app/app-reducer';
import { authAPI } from '../../dal/api';
import { handleAppError, handleNetworkError } from '../../helpers/error-util';
import axios from 'axios';

const login = createAsyncThunk('login/login',
  async(params: LoginParamsType, { dispatch }) => {
    dispatch(setAppStatusReducer({ isLoading: true }));
    try {
      const res = await authAPI.loginRequest(params.email, params.password, params.rememberMe);
      if (res.data.resultCode === 0) {
        dispatch(setAppStatusReducer({ isLoading: false }));
        return { userId: res.data.data.userId, email: params.email, isAuth: true };
      } else {
        return handleAppError(res.data, dispatch);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return handleNetworkError(err.message, dispatch);
      }
    }
  });

const logout = createAsyncThunk('login/logout', async(params, { dispatch }) => {
  dispatch(setAppStatusReducer({ isLoading: true }));
  try {
    const res = await authAPI.logoutRequest();
    if (res.data.resultCode === 0) {
      dispatch(setAppStatusReducer({ isLoading: false }));
      return { userId: null, email: null, isAuth: false };
    } else {
      return handleAppError(res.data, dispatch);
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return handleNetworkError(err.message, dispatch);
    }
  }
});

export const loginAsyncActions = { login, logout };

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
    loginLogoutReducer(
      state,
      action: PayloadAction<InitialStateType>) {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: builder => {
    builder.addCase(login.fulfilled, (state, action) => ({ ...state, ...action.payload }))
      .addCase(logout.fulfilled, (state, action) => ({ ...state, ...action.payload }));
  },

});

export const loginReducer = slice.reducer;
export const { loginLogoutReducer } = slice.actions;





