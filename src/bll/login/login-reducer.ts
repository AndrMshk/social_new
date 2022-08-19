import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginAsyncActions } from './login-async-actions';

const { loginTC, logoutTC } = loginAsyncActions;

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
  extraReducers: builder => {
    builder.addCase(loginTC.fulfilled, (state, action) => ({ ...state, ...action.payload }))
      .addCase(logoutTC.fulfilled, (state, action) => ({ ...state, ...action.payload }));
  },

});

export const loginReducer = slice.reducer;
export const { login } = slice.actions;





