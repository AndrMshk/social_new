import React, { FC, useCallback } from 'react';
import { Image, Switch, Typography } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons/lib';
import { useAppDispatch, useAppSelector } from '../../../../bll/store';
import test from '../../../../img/test.jpg';
import { ProfileObjType } from '../Profile';
import { setPhoto, setStatus, updateProfileAbout } from '../../../../bll/profile/profile-reducer';
import { usersAsyncActions } from '../../../../bll/user/users-reducer';
import style from './profileInfo.module.scss';

type ProfileInfoPropsType = {
  userId: number
  profile: ProfileObjType
}
const { follow, unFollow } = usersAsyncActions;

export const ProfileInfo: FC<ProfileInfoPropsType> = React.memo(({ userId, profile }) => {

  const dispatch = useAppDispatch();

  const { status, isFollowedUser } = useAppSelector(state => state.profile);
  const myUserId = useAppSelector(state => state.login.userId);
  const followingInProgress = useAppSelector(state => state.users.followingInProgress);

  const { Paragraph } = Typography;

  const changeStatusHandler = useCallback((newStatus: string) => {
    if (newStatus !== status) {
      dispatch(setStatus({ status: newStatus }));
    }
  }, []);

  const updateProfileAboutHandler = (contact: string, value: string | boolean) => {
    if (!(profile) || profile[contact] !== value) {
      dispatch(updateProfileAbout({ contact, value }));
    }
  };

  const followingToggleHandler = useCallback(() => {
    if (!isFollowedUser && userId) {
      dispatch(follow({ userId: userId }));
    } else if (userId) {
      dispatch(unFollow({ userId: userId }));
    }
  }, [isFollowedUser]);

  return (
    <div className={style.container}>
      <div className={style.mainInfo}>
        <div className={style.title}>
          <Typography.Title level={4}>{profile?.fullName}</Typography.Title>
          {userId !== myUserId &&
          <Switch
            onChange={followingToggleHandler}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={isFollowedUser || false}
            disabled={followingInProgress.some(el => el === userId)}
          />}
          <Paragraph
            editable={userId === myUserId && { tooltip: false, onChange: changeStatusHandler }}>{status}</Paragraph>
          AboutMe:
          <Paragraph
            editable={userId === myUserId && {
              tooltip: false,
              onChange: (value) => updateProfileAboutHandler('aboutMe', value),
            }}>
            {profile ? profile.aboutMe : 'Field is empty already'}
          </Paragraph>
        </div>
        <div className={style.ava}>
          <Image width={200} src={profile?.photos.large || test} />
          {userId === myUserId &&
          <label className={style.changePhoto}>Change photo
            <input
              type="file"
              onChange={e => {e.target.files && dispatch(setPhoto({ file: e.target.files[0] }));}} />
          </label>}
        </div>
      </div>
      <div className={style.workInfo}>
        <Typography.Title level={5}>
          Looking for a job:
          {userId !== myUserId
            ? <span style={{ marginLeft: '5px' }}>
              {profile?.lookingForAJob ? 'Yes' : 'No'}
            </span>
            : <Switch
              className={style.switch}
              onChange={(value) => updateProfileAboutHandler('lookingForAJob', value)}
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              checked={profile?.lookingForAJob}
            />
          }
        </Typography.Title>
        {profile?.lookingForAJob &&
        <Paragraph editable={userId === myUserId && {
          tooltip: false,
          onChange: (value) => updateProfileAboutHandler('lookingForAJobDescription', value),
        }}>
          {profile.lookingForAJobDescription}
        </Paragraph>}
      </div>
    </div>
  );
});

