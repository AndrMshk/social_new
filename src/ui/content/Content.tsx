import React from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Messages } from './messages/Messages';
import { Profile } from './profile/Profile';
import { Users } from './users/Users';
import { Login } from '../login/Login';
import { useAppSelector } from '../../bll/store';
import { Spin } from 'antd';
import style from './style.module.scss';

export const ContentComponent = () => {

  const isLoading = useAppSelector(state => state.app.isLoading);
  const isAuth = useAppSelector(state => state.login.isAuth);
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuth && location.pathname !== '/login') {
    navigate('/login');
  }

  if (isLoading) {
    return <div className={style.container}><Spin size="large" /></div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Profile />} />
      <Route path="/profile/:userId" element={<Profile />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/users" element={<Users />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};
