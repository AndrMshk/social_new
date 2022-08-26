import { ProfileType } from '../../dal/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootStateType } from '../store';
import { profileAPI } from '../../dal/api';
import axios from 'axios';
import { handleAppError, handleNetworkError } from '../../helpers/error-util';

export const setProfile = createAsyncThunk('profile/set-profile',
  async(params: { userId: number }, { dispatch, getState, rejectWithValue }) => {
    dispatch(setIsLoading({ isLoading: true }));
    const state = getState() as RootStateType;
    try {
      const res = await profileAPI.getProfile(params.userId);
      const isNotMyProfile = state.users.followedUsers.concat(state.users.users).find(el => el.id === res.data.userId);
      if (isNotMyProfile) {
        dispatch(setIsFollowedUserReducer({ isFollowed: isNotMyProfile.followed }));
      } else {
        dispatch(setIsFollowedUserReducer({ isFollowed: null }));
      }
      return { profile: res.data };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        handleNetworkError(err.message, dispatch);
        return rejectWithValue(err.message);
      }
      return rejectWithValue('some error');
    } finally {
      dispatch(setIsLoading({ isLoading: false }));
    }
  });

export const getStatus = createAsyncThunk('profile/get-status',
  async(params: { userId: number }, { dispatch, rejectWithValue }) => {
    dispatch(setIsLoading({ isLoading: true }));
    try {
      const status = await profileAPI.getStatus(params.userId);
      return { status: status.data };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        handleNetworkError(err.message, dispatch);
        return rejectWithValue(err.message);
      }
      return rejectWithValue('some error');
    } finally {
      dispatch(setIsLoading({ isLoading: false }));
    }
  });

export const setStatus = createAsyncThunk('profile/set-status',
  async(params: { status: string }, { dispatch, rejectWithValue }) => {
    dispatch(setIsLoading({ isLoading: true }));
    try {
      const res = await profileAPI.updateStatus(params.status);
      if (res.data.resultCode === 0) {
        return { status: params.status };
      } else {
        handleAppError(res.data, dispatch);
        return rejectWithValue('some error');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        handleNetworkError(err.message, dispatch);
        return rejectWithValue(err.message);
      }
      return rejectWithValue('some error');
    } finally {
      dispatch(setIsLoading({ isLoading: false }));
    }
  });

export const updateProfileAbout = createAsyncThunk('profile/update-profile-about',
  async(params: { contact: string, value: string | boolean }, { dispatch, getState, rejectWithValue }) => {
    dispatch(setIsLoading({ isLoading: true }));
    const state = getState() as RootStateType;
    const currentProfile = state.profile.profile;
    try {
      const res = await profileAPI.updateProfile({ ...currentProfile, [params.contact]: params.value });
      if (res.data.resultCode == 0) {
        return { contact: params.contact, value: params.value };
      } else {
        handleAppError(res.data, dispatch);
        return rejectWithValue('some error');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        handleNetworkError(err.message, dispatch);
        return rejectWithValue(err.message);
      }
      return rejectWithValue('some error');
    } finally {
      dispatch(setIsLoading({ isLoading: false }));
    }
  });

export const updateProfileContacts = createAsyncThunk('profile/update-profile-contacts',
  async(params: { contact: string, value: string }, { dispatch, getState, rejectWithValue }) => {
    dispatch(setIsLoading({ isLoading: true }));
    const state = getState() as RootStateType;
    const currentProfile = state.profile.profile;
    try {
      const res = await profileAPI.updateProfile(
        {
          ...currentProfile,
          contacts: { ...currentProfile?.contacts, [params.contact]: params.value },
        });
      if (res.data.resultCode === 0) {
        return { contact: params.contact, value: params.value };
      } else {
        handleAppError(res.data, dispatch);
        return rejectWithValue('some error');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        handleNetworkError(err.message, dispatch);
        return rejectWithValue(err.message);
      }
      return rejectWithValue('some error');
    } finally {
      dispatch(setIsLoading({ isLoading: false }));
    }
  });

type InitialStateType = {
  postsData: { id: number, message: string, likeCounts: number }[]
  profile: ProfileType | null
  isFollowedUser: null | boolean
  status: string
  isLoading: boolean
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
    isFollowedUser: null,
    status: '',
    isLoading: false,
  } as InitialStateType,
  reducers: {
    setIsFollowedUserReducer(state, action: PayloadAction<{ isFollowed: null | boolean }>) {
      state.isFollowedUser = action.payload.isFollowed;
    },
    setIsLoading(state, action: PayloadAction<{ isLoading: boolean }>) {
      state.isLoading = action.payload.isLoading;
    },
  },
  extraReducers: builder => {
    builder.addCase(setProfile.fulfilled, (state, action) => {
        state.profile = action.payload.profile;
      })
      .addCase(getStatus.fulfilled, (state, action) => {
        state.status = action.payload.status;
      })
      .addCase(setStatus.fulfilled, (state, action) => {
        state.status = action.payload.status;
      })
      .addCase(updateProfileAbout.fulfilled, (state, action) => {
        state.profile = { ...state.profile, [action.payload.contact]: action.payload.value };
      })
      .addCase(updateProfileContacts.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.contacts = { ...state.profile.contacts, [action.payload.contact]: action.payload.value };
        }
      });
  },
});

export const profileReducer = slice.reducer;
export const { setIsFollowedUserReducer, setIsLoading } = slice.actions;





