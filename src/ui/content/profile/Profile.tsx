import React, { useEffect } from 'react';
import style from './profile.module.scss';
import { useAppDispatch, useAppSelector } from '../../../bll/store';
import { useParams } from 'react-router-dom';
import { ProfileInfo } from './profileData/ProfileInfo';
import { ProfileContacts } from './profileData/ProfileContacts';
import { getStatus, setProfile } from '../../../bll/profile-reducer';
import { Spin } from 'antd';
import { usersAsyncActions } from '../../../bll/users-reducer';

const { getIsFriend } = usersAsyncActions;

export const Profile = () => {

  const dispatch = useAppDispatch();
  const params = useParams();

  const { userId: myUserId } = useAppSelector(state => state.login);
  const { isLoading, profile } = useAppSelector(state => state.profile);

  let userId = params.userId ? +params.userId : myUserId as number;

  useEffect(() => {
    if (userId) {
      dispatch(setProfile({ userId }));
      dispatch(getStatus({ userId }));
    }
    if (userId !== myUserId) {
      userId && dispatch(getIsFriend({ userId }));
    }
  }, [userId]);

  if (isLoading) {
    return (
      <Spin tip="Loading...">
        <div className={style.container}>
          <ProfileInfo userId={userId} profile={profile} />
          <ProfileContacts userId={userId} profile={profile} />
        </div>
      </Spin>
    );
  }

  return (
    <div className={style.container}>
      <ProfileInfo userId={userId} profile={profile} />
      <ProfileContacts userId={userId} profile={profile} />
    </div>
  );
};







