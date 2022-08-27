import React, { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Messages } from './messages/Messages';
import { Profile } from './profile/Profile';
import { Users } from './users/Users';
import { Login } from '../login/Login';
import { useAppSelector } from '../../bll/store';
import { Spin } from 'antd';
import style from './style.module.scss';

export const ContentComponent = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const isLoading = useAppSelector(state => state.app.isLoading);
  const isAuth = useAppSelector(state => state.login.isAuth);

  useEffect(() => {
    if (!isAuth || location.pathname !== '/login') {
      navigate('/login');
    }
  }, [isAuth]);

  if (isLoading) {
    return <div className={style.container}><Spin size="large" /></div>;
  }

  return (
    <Routes>
      <Route path={'/'} element={<Navigate to={'/profile'} />} />
      <Route path="/profile/:userId" element={<Profile />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/users" element={<Users />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};
