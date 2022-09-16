import React from 'react';
import { Button, Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../bll/store';
import test from '../../img/test.jpg';
import { loginAsyncActions } from '../../bll/login/login-reducer';
import style from './header.module.scss'

const { logout } = loginAsyncActions;

export const HeaderComponent = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isAuth, email } = useAppSelector(state => state.login);

  return (
      <div className={style.main}>
        <div><img src={test} alt="logo" style={{ height: '30px' }} /></div>
        <div>{email || null}</div>
        <div>
          {isAuth
            ? <Button onClick={() => dispatch(logout())}>Exit</Button>
            : <Button onClick={() => navigate('/login')}>Login</Button>}
        </div>
      </div>
  );
};
