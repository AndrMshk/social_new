import { Button, Checkbox, Form, Input } from 'antd';
import React, { useEffect } from 'react';
import style from './style.module.scss';
import { useAppDispatch, useAppSelector } from '../../bll/store';
import { useNavigate } from 'react-router-dom';
import { loginAsyncActions } from '../../bll/login/login-reducer';

const { login } = loginAsyncActions;

export const Login: React.FC = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const isAuth = useAppSelector(state => state.login.isAuth);
  const isLoading = useAppSelector(state => state.app.isLoading);

  const onFinish = (values: any) => {
    dispatch(login(values));
    form.resetFields();
  };

  useEffect(() => {
    if (isAuth) {
      navigate('/profile');
    }
  }, [isAuth]);

  return (
    <div
      className={style.container}
    >
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: false }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Username"
          name="email"
          rules={[
            { required: true, message: 'Please input your username!' },
            { type: 'email', message: 'Incorrect email' },
          ]}
        >
          <Input disabled={isLoading} />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 3, message: 'Too short password' },
          ]}
        >
          <Input.Password disabled={isLoading} />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox disabled={isLoading}>Remember me</Checkbox>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" disabled={isLoading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
