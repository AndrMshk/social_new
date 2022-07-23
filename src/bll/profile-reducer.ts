import { ProfileType } from '../dal/types';
import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { profileAPI } from '../dal/api';

type InitialStateType = {
  postsData: { id: number, message: string, likeCounts: number }[]
  profile: ProfileType | null
  status: string
}

const slice = createSlice({
  name: 'profile',
  initialState: {
    postsData: [
      { id: 1, message: 'hello', likeCounts: 0 },
      { id: 2, message: 'hello', likeCounts: 0 },
      { id: 3, message: 'hello', likeCounts: 0 },
    ],
    profile: null,
    status: '',
  } as InitialStateType,
  reducers: {
    setProfile(state, action: PayloadAction<ProfileType>) {
      state.profile = action.payload;
    },
    setStatus(state, action: PayloadAction<{ status: string }>) {
      state.status = action.payload.status;
    },
  },
});

export const profileReducer = slice.reducer;
export const { setProfile, setStatus } = slice.actions;

export const setStatusTC = (status: string) => async(dispatch: Dispatch) => {
  await profileAPI.updateStatus(status);
  dispatch(setStatus({ status }));
};

