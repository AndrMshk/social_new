import React, { FC, useState } from 'react';
import { Image, Switch, Typography } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons/lib';
import { useAppDispatch, useAppSelector } from '../../../../bll/store';
import test from '../../../../img/test.jpg';
import { ProfileObjType } from '../Profile';
import { usersAsyncActions } from '../../../../bll/user/users-async-actions';
import { setStatus, updateProfileAbout } from '../../../../bll/profile/profile-reducer';

type ProfileInfoPropsType = {
  userId: number
  profile: ProfileObjType
}
const { follow, unFollow } = usersAsyncActions;

export const ProfileInfo: FC<ProfileInfoPropsType> = React.memo(({ userId, profile }) => {

  const status = useAppSelector(state => state.profile.status);
  const isFollowedUser = useAppSelector(state => state.profile.isFollowedUser);
  const myUserId = useAppSelector(state => state.login.userId);
  const followingInProgress = useAppSelector(state => state.users.followingInProgress)

  const { Paragraph } = Typography;
  const dispatch = useAppDispatch();

  const [avatar, setAvatar] = useState(test);

  const changeStatusHandler = (newStatus: string) => {
    if (newStatus !== status) {
      dispatch(setStatus({ status: newStatus }));
    }
  };

  const updateProfileAboutHandler = (contact: string, value: string | boolean) => {
    if (!(profile) || profile[contact] !== value) {
      dispatch(updateProfileAbout({ contact, value }));
    }
  };

  const followingToggleHandler = () => {
    if (!isFollowedUser && userId) {
      dispatch(follow(userId));
    } else if (userId) {
      dispatch(unFollow(userId));
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      <div style={{ display: 'inline-block' }}>
        <Typography.Title level={4} style={{ margin: 0 }}>{profile?.fullName}</Typography.Title>
        {userId !== myUserId &&
        <Switch
          onChange={followingToggleHandler}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          checked={isFollowedUser || false}
          disabled={followingInProgress.some(el=> el === userId)}
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
      <div style={{ display: 'inline-block' }}>
        <Image width={200} src={profile?.photos.large || avatar} />
      </div>
      <div style={{ display: 'inline-block' }}>
        <Typography.Title level={5} style={{ margin: 0 }}>
          Looking for a job:
          {userId !== myUserId
            ? profile?.lookingForAJob ? 'YES' : 'PIZDIT'
            : <Switch
              onChange={(value) => updateProfileAboutHandler('lookingForAJob', value)}
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              checked={profile?.lookingForAJob}
              style={{ marginLeft: '5px' }}
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
