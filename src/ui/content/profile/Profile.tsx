import React, { useEffect, useState } from 'react';
import { Image, Typography } from 'antd';
import test from '../../../img/test.jpg';
import style from './style.module.scss';
import { useAppDispatch, useAppSelector } from '../../../bll/store';
import { setStatusTC } from '../../../bll/profile/profile-reducer';
import { useNavigate, useParams } from 'react-router-dom';
import { getStatusTC, setProfileTC } from '../../../bll/profile/profile-async-actions';

export const Profile = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();

  const profile = useAppSelector(state => state.profile.profile);
  const myUserId = useAppSelector(state => state.login.userId);
  const status = useAppSelector(state => state.profile.status);
  const isAuth = useAppSelector(state => state.login.isAuth);
  const { Paragraph } = Typography;
  const [avatar, setAvatar] = useState(test);

  useEffect(() => {
    if (userId) {
      dispatch(setProfileTC({ userId: +userId }));
      dispatch(getStatusTC({ userId: +userId }));
    } else {
      if (myUserId) {
        dispatch(setProfileTC({ userId: myUserId }));
        dispatch(getStatusTC({ userId: myUserId }));
      }
      navigate('/');
    }
  }, [userId]);

  const changeStatusHandler = (newStatus: string) => {
    if (newStatus !== status) {
      dispatch(setStatusTC(newStatus));
    }
  };

  !isAuth && navigate('/login');

  return (
    <div className={style.container}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <div style={{ display: 'inline-block' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>{profile?.fullName}</Typography.Title>
          <Paragraph editable={!userId && { tooltip: false, onChange: changeStatusHandler }}>{status}</Paragraph>
          <Paragraph editable={!userId && { tooltip: false, onChange: changeStatusHandler }}>
            AboutMe: {profile?.aboutMe || 'Field is empty already'}
          </Paragraph>
        </div>
        <div style={{ display: 'inline-block' }}>
          <Image width={200} src={profile?.photos.large || avatar} />
        </div>
        <div style={{ display: 'inline-block' }}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Looking for a job: {profile?.lookingForAJob ? 'YES' : 'PIZDIT'}
          </Typography.Title>
          {profile?.lookingForAJob &&
          <Paragraph editable={!userId && { tooltip: false, onChange: changeStatusHandler }}>
            {profile?.lookingForAJobDescription}
          </Paragraph>}
        </div>
      </div>
      <div>
        <h3>Contacts:</h3>
        {profile?.contacts && Object.values(profile?.contacts).some(el => el)
          ? !userId
            ? <ul> {Object.keys(profile?.contacts).map(el =>
              <li key={el}>
                <Paragraph style={{ display: 'inline-block' }}
                           editable={{ tooltip: false, onChange: changeStatusHandler }}>
                  {/*@ts-ignore*/}
                  {el}: {profile?.contacts[el] || '________________'}
                </Paragraph>
              </li>)}
            </ul>
            : <ul> {Object.keys(profile?.contacts).map(el =>
              // @ts-ignore
              profile?.contacts[el] &&
              <li>
                <Paragraph editable={false}>
                  {/*@ts-ignore*/}
                  {el}: {profile?.contacts[el]}
                </Paragraph>
              </li>)}
            </ul>
          : <h4>Fields are empty</h4>}
      </div>
    </div>
  );
};






