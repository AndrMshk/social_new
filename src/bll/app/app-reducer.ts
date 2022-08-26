import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { appAsyncActions } from './app-async-actions';

const { setAppInitialized } = appAsyncActions;

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


