import axios from 'axios';
import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { authAPI, profileAPI } from '../dal/api';
import { handleAppError, handleNetworkError } from '../helpers/error-util';
import { login } from './login-reducer';
import { setProfile, setStatus } from './profile-reducer';

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
    setAppStatus(state, action: PayloadAction<{ isLoading: boolean }>) {
      state.isLoading = action.payload.isLoading;
    },
    setAppError(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error;
    },
    setAppInitialized(state, action: PayloadAction<{ isInitialized: boolean }>) {
      state.isInitialized = action.payload.isInitialized;
    },
  },
});

export const appReducer = slice.reducer;
export const { setAppInitialized, setAppError, setAppStatus } = slice.actions;

export const setAppInitializedTC = () => (
  async(dispatch: Dispatch) => {
    dispatch(setAppInitialized({ isInitialized: false }));
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
    dispatch(setAppInitialized({ isInitialized: true }));
  }
);

