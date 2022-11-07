import axios, { AxiosResponse } from 'axios';
import { CONST } from './env';
import { GetUsersParamsType, LoginParamsType, ResponseTypeAPI, UpdateProfileModelType } from './types';

const instance = axios.create({
  baseURL: CONST.BASE_URL,
  withCredentials: true,
  headers: { 'API-KEY': CONST.API_KEY },
});

export const usersAPI = {
  getUsers(params: GetUsersParamsType) {
    return (instance.get(`users`, { params: { ...params } }));
  },
  followPostRequest(userId: number) {
    return (instance
        .post(`follow/${userId}`)
        .then((response) => response.data)
    );
  },
  unFollowDeleteRequest(userId: number) {
    return (instance
        .delete(`/follow/${userId}`)
        .then((response) => response.data)
    );
  },
  getIsFollowRequest(userId: number) {
    return (instance
        .get(`/follow/${userId}`)
        .then(response => response.data)
    );
  },
};

export const authAPI = {
  me() {
    return (instance.get<{ email: string, password: string, rememberMe?: boolean, captcha?: string },
        AxiosResponse<ResponseTypeAPI<{ id: number, login: string, email: string }>>>(`auth/me`)
    );
  },
  loginRequest(email: string, password: string, rememberMe: boolean = false, captcha: string | null = null) {
    return (instance.post<LoginParamsType, AxiosResponse<ResponseTypeAPI<{ userId: number }>>>
      (`/auth/login`, { email, password, rememberMe, captcha })
    );
  },
  logoutRequest() {
    return instance.delete(`/auth/login`);
  },
};

export const profileAPI = {
  getProfile(userId: number) {
    return (instance.get(`/profile/${userId}`)
    );
  },
  updateProfile(updatedProfile: UpdateProfileModelType) {
    Object.entries(updatedProfile)
      .forEach(([key, value]) => {
        if (!value) {
          if (typeof value === 'boolean') {
            // @ts-ignore
            updatedProfile[key] = false;
          } else {
            // @ts-ignore
            updatedProfile[key] = '_';
          }
        }
      });
    return instance.put(`/profile`, updatedProfile);
  },
  getStatus(userId: number) {
    return (
      instance.get(`/profile/status/${userId}`)
    );
  },
  updateStatus(status: string) {
    return instance.put(`/profile/status`, { status });
  },
  setPhoto(photoFile: any) {
    const formData = new FormData();
    formData.append('image', photoFile);
    return instance.put(`/profile/photo`, formData,
      { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

export const securityAPI = {
  getCaptcha() {
    return instance.get('/security/get-captcha-url');
  },
};




