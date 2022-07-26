import { AnyAction, combineReducers } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { appReducer } from './app-reducer';
import { loginReducer } from './login-reducer';
import { usersReducer } from './users-reducer';
import { profileReducer } from './profile-reducer';

const rootReducer = combineReducers({
    app: appReducer,
    login: loginReducer,
    users: usersReducer,
    profile: profileReducer,
  },
);

export type DispatchType = ThunkDispatch<RootStateType, unknown, AnyAction>
export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector;
export type RootStateType = ReturnType<typeof rootReducer>

export const useAppDispatch = () => useDispatch<DispatchType>();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});
