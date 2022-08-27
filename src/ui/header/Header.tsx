import React from 'react';
import { Button, Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../bll/store';
import test from '../../img/test.jpg';
import { loginAsyncActions } from '../../bll/login/login-reducer';

const { logout } = loginAsyncActions;

export const HeaderComponent = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isAuth, email } = useAppSelector(state => state.login);

  return (
    <Row>
      <Col span={8}><img src={test} alt="logo" style={{ height: '30px' }} /></Col>
      <Col span={8}>{email || null}</Col>
      <Col span={8}>
        {isAuth
          ? <Button onClick={() => dispatch(logout())}>Exit</Button>
          : <Button onClick={() => navigate('/login')}>Login</Button>}
      </Col>
    </Row>
  );
};
