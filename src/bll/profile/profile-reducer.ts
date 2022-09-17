import { ProfileType } from '../../dal/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DispatchType, RootStateType } from '../store';
import { profileAPI } from '../../dal/api';
import axios from 'axios';
import { handleAppError, handleNetworkError } from '../../helpers/error-util';

export const setProfile = createAsyncThunk('profile/set-profile',
  async(params: { userId: number }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setIsLoading({ isLoading: true }));
      const res = await profileAPI.getProfile(params.userId);
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
    try {
      dispatch(setIsLoading({ isLoading: true }));
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
    try {
      dispatch(setIsLoading({ isLoading: true }));
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

export const updateProfileAbout = createAsyncThunk<{ contact: string, value: string | boolean },
  { contact: string, value: string | boolean },
  { dispatch: DispatchType, state: RootStateType, rejectWithValue: { errorMessage: string } }>(
  'profile/update-profile-about',
  async({ value, contact }, { dispatch, getState, rejectWithValue }) => {
    const currentProfile = getState().profile.profile;
    try {
      dispatch(setIsLoading({ isLoading: true }));
      const res = await profileAPI.updateProfile({ ...currentProfile, [contact]: value });
      if (res.data.resultCode == 0) {
        return { contact, value };
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

export const updateProfileContacts = createAsyncThunk<// Return type of the payload creator
  { contact: string, value: string },
  // First argument to the payload creator
  { contact: string; value: string },
  {
    // Optional fields for defining thunkApi field types
    dispatch: DispatchType
    state: RootStateType
    rejectWithValue: { errorMessage: string }
  }>('profile/update-profile-contacts',
  async({ contact, value }, { getState, dispatch, rejectWithValue }) => {
    const currentProfile = getState().profile.profile;
    try {
      dispatch(setIsLoading({ isLoading: true }));
      const res = await profileAPI.updateProfile(
        {
          ...currentProfile,
          contacts: { ...currentProfile?.contacts, [contact]: value },
        });
      if (res.data.resultCode === 0) {
        return { contact, value };
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

export const setPhoto = createAsyncThunk('profile/set-profile-photo',
  async(params: { file: File }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setIsLoading({ isLoading: true }));
      const res = await profileAPI.setPhoto(params.file);
      if (res.data.resultCode === 0) {
        return { file: res.data.data.photos };
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
      })
      .addCase(setPhoto.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.photos = action.payload.file;
        }
      });
  },
});

export const profileReducer = slice.reducer;
export const { setIsFollowedUserReducer, setIsLoading } = slice.actions;







