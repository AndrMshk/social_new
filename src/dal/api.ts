import axios, { AxiosResponse } from 'axios';
import { LoginParamsType, ResponseTypeAPI } from '../bll/types';

const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.0/',
  withCredentials: true,
  headers: {
    'API-KEY': 'abb3a345-b7d8-4f0f-8c61-af2582f7869f',
  },
});

export const usersAPI = {
  getUsers(currentPage: number, pageSize: number) {
    return (
      instance
        .get(`users?page=${currentPage}&count=${pageSize}`));
  },
  followPostRequest(userId: number) {
    return (
      instance
        .post(`follow/${userId}`)
        .then((response) => response.data)
    );
  },
  unFollowDeleteRequest(userId: number) {
    return (
      instance
        .delete(`/follow/${userId}`)
        .then((response) => response.data)
    );
  },
};

export const authAPI = {
  me() {
    return (
      instance
        .get<{ email: string, password: string, rememberMe?: boolean, captcha?: string },
          AxiosResponse<ResponseTypeAPI<{ id: number, login: string, email: string }>>>(`auth/me`)
    );
  },
  loginRequest(email: string, password: string, rememberMe: boolean = false) {
    return (
      instance.post<LoginParamsType, AxiosResponse<ResponseTypeAPI<{ userId: number }>>>
      (`/auth/login`, { email, password, rememberMe })
    );
  },
  logoutRequest() {
    return instance.delete(`/auth/login`);
  },
};

export const profileAPI = {
  getProfile(userId: number) {
    return (
      instance.get(`/profile/${userId}`)
    );
  },
  getStatus(userId: number) {
    return (
      instance.get(`/profile/status/${userId}`)
    );
  },
  updateStatus(status: string) {
    return instance.put(`/profile/status`, { status });
  },
};

