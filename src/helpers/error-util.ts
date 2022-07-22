import { Dispatch } from '@reduxjs/toolkit';
import { setAppError, setAppStatus } from '../bll/app-reducer';
import { ResponseTypeAPI } from '../bll/types';

export const handleAppError = <Data>(
  data: ResponseTypeAPI<Data>,
  dispatch: Dispatch) => {
  data.messages.length
    ? dispatch(setAppError({ error: data.messages[0] }))
    : dispatch(setAppError({ error: 'SOME ERROR' }));
  dispatch(setAppStatus({ isLoading: false }));
};

export const handleNetworkError = (
  message: string,
  dispatch: Dispatch) => {
  dispatch(setAppStatus({ isLoading: false }));
  dispatch(setAppError({ error: message ? message : 'SOME ERROR' }));
};