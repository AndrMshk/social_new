import React from 'react';
import { Button, Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../bll/store';
import test from '../../img/test.jpg';
import { loginAsyncActions } from '../../bll/login/login-async-actions';

const { logout } = loginAsyncActions;

export const HeaderComponent = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuth = useAppSelector(state => state.login.isAuth);
  const email = useAppSelector(state => state.login.email);

  const logoutHandler = () => dispatch(logout());

  return (
    <>
      <div>
        <Row>
          <Col span={8}><img src={test} alt="logo" style={{ height: '30px' }} /></Col>
          <Col span={8}>{email ? email : null}</Col>
          <Col span={8}>
            {isAuth
              ? <Button onClick={logoutHandler}>Exit</Button>
              : <Button onClick={() => navigate('/login')}>Login</Button>}
          </Col>
        </Row>
      </div>
    </>
  );
};
