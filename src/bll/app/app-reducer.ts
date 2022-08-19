import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { appAsyncActions } from './app-async-actions';

const { setAppInitializedTC } = appAsyncActions;

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
  },
  extraReducers: builder => {
    builder.addCase(setAppInitializedTC.fulfilled, (state, action) => {
      state.isInitialized = action.payload.isInitialized;
    });
  },
});

export const appReducer = slice.reducer;
export const { setAppError, setAppStatus } = slice.actions;

