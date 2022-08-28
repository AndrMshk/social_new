import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginParamsType } from '../../dal/types';
import { setAppStatusReducer } from '../app/app-reducer';
import { authAPI, securityAPI } from '../../dal/api';
import { handleAppError, handleNetworkError } from '../../helpers/error-util';
import axios from 'axios';

const login = createAsyncThunk('login/login',
  async(params: LoginParamsType, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setAppStatusReducer({ isLoading: true }));
      const res = await authAPI.loginRequest(params.email, params.password, params.rememberMe, params.captcha);
      if (res.data.resultCode === 0) {
        return { userId: res.data.data.userId, email: params.email, isAuth: true };
      } else if (res.data.resultCode === 10) {
        dispatch(getCaptcha());
        return rejectWithValue(res.data);
      } else {
        handleAppError(res.data, dispatch);
        return rejectWithValue(res.data);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        handleNetworkError(err.message, dispatch);
        return rejectWithValue(err.message);
      }
    } finally {
      dispatch(setAppStatusReducer({ isLoading: false }));
    }
  });

const logout = createAsyncThunk('login/logout',
  async(params, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setAppStatusReducer({ isLoading: true }));
      const res = await authAPI.logoutRequest();
      if (res.data.resultCode === 0) {
        return { userId: null, email: null, isAuth: false };
      } else {
        handleAppError(res.data, dispatch);
        return rejectWithValue(res.data);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        handleNetworkError(err.message, dispatch);
        return rejectWithValue(err.message);
      }
    } finally {
      dispatch(setAppStatusReducer({ isLoading: false }));
    }
  });

const getCaptcha = createAsyncThunk('login/get-capcha',
  async(params, { dispatch, rejectWithValue }) => {
    try {
      const res = await securityAPI.getCaptcha();
      console.log(res);
      return { captchaUrl: res.data.url };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        handleNetworkError(err.message, dispatch);
        return rejectWithValue(err.message);
      }
    }
  });

export const loginAsyncActions = { login, logout, getCaptcha };

type InitialStateType = {
  userId: number | null
  email: string | null
  isAuth: boolean
  captchaUrl: string | null
}

const slice = createSlice({
  name: 'login',
  initialState: {
    userId: null,
    email: '',
    isAuth: false,
    captchaUrl: null,
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
      .addCase(logout.fulfilled, (state, action) => ({ ...state, ...action.payload }))
      .addCase(getCaptcha.fulfilled, (state, action) => {
        debugger
        state.captchaUrl = action.payload?.captchaUrl;
      });
  },

});

export const loginReducer = slice.reducer;
export const { loginLogoutReducer } = slice.actions;





