import React, { useState } from 'react';
import { Image, Typography } from 'antd';
import test from '../../../img/test.jpg';
import style from './style.module.scss';
import { useAppDispatch, useAppSelector } from '../../../bll/store';
import { setStatusTC } from '../../../bll/profile/profile-reducer';

export const Profile = () => {
  const dispatch = useAppDispatch();
  const me = useAppSelector(state => state.profile.profile);
  const status = useAppSelector(state => state.profile.status);
  const email = useAppSelector(state => state.login.email);
  const isAuth = useAppSelector(state => state.login.isAuth);
  const { Paragraph } = Typography;
  const [avatar, setAvatar] = useState(test);

  const changeStatusHandler = (newStatus: string) => {
    if (newStatus !== status) {
      dispatch(setStatusTC(newStatus));
    }
  };

  return (
    <div className={style.container}>
      <Image
        width={200}
        src={avatar}
      />
      <Typography.Title level={4} style={{ margin: 0 }}>
        {me?.fullName}
      </Typography.Title>
      <Typography.Title level={5} style={{ margin: 0 }}>
        {email}
      </Typography.Title>
      <Paragraph editable={{ tooltip: false, onChange: changeStatusHandler }}>
        {status}
      </Paragraph>
    </div>
  );
};






