import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginAsyncActions } from './login-async-actions';

const { login, logout } = loginAsyncActions;

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





