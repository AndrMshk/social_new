import { Dispatch } from '@reduxjs/toolkit';
import { setAppErrorReducer, setAppStatusReducer } from '../bll/app/app-reducer';

import { ResponseTypeAPI } from '../dal/types';

export const handleAppError = <Data>(
  data: ResponseTypeAPI<Data>,
  dispatch: Dispatch) => {

  data.messages.length
    ? dispatch(setAppErrorReducer({ error: data.messages[0] }))
    : dispatch(setAppErrorReducer({ error: 'SOME ERROR' }));
  dispatch(setAppStatusReducer({ isLoading: false }));
};

export const handleNetworkError = (
  message: string,
  dispatch: Dispatch) => {
  dispatch(setAppStatusReducer({ isLoading: false }));
  dispatch(setAppErrorReducer({ error: message ? message : 'SOME ERROR' }));
};
