import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authAPI, profileAPI } from '../../dal/api';
import { getStatus, setProfile } from '../profile/profile-reducer';
import { loginLogoutReducer } from '../login/login-reducer';
import { handleAppError, handleNetworkError } from '../../helpers/error-util';
import axios from 'axios';

export const setAppInitialized = createAsyncThunk('app/set-initialized',
  async(params, { dispatch }) => {
    try {
      const res = await authAPI.me();
      if (res.data.resultCode == 0) {
        const profileData = await profileAPI.getProfile(res.data.data.id);
        dispatch(setProfile(profileData.data));
        dispatch(getStatus({ userId: res.data.data.id }));
        dispatch(
          loginLogoutReducer({ userId: res.data.data.id, email: res.data.data.email, isAuth: true, captchaUrl: null }));
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

type InitialStateType = {
  isLoading: boolean
  error: string | null
  isInitialized: boolean
  me: {
    userId: number | null
    email: string | null
    login: string | null
  }
}

const slice = createSlice({
  name: 'app',
  initialState: {
    isLoading: false,
    error: null,
    isInitialized: false,
    me: {
      userId: null,
      email: null,
      login: null,
    },
  } as InitialStateType,
  reducers: {
    setAppStatusReducer(state, action: PayloadAction<{ isLoading: boolean }>) {
      state.isLoading = action.payload.isLoading;
    },
    setAppErrorReducer(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error;
    },
  },
  extraReducers: builder => {
    builder.addCase(setAppInitialized.fulfilled, (state, action) => {
      state.isInitialized = action.payload.isInitialized;
    });
  },
});

export const appReducer = slice.reducer;
export const { setAppStatusReducer, setAppErrorReducer } = slice.actions;


