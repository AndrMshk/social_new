import React, { FC } from 'react';
import { Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '../../../../bll/store';
import { ProfileObjType } from '../Profile';
import { updateProfileContacts } from '../../../../bll/profile-reducer';
import style from './profileContacts.module.scss';

type ProfileContactsPropsType = {
  userId: number
  profile: ProfileObjType
}

export const ProfileContacts: FC<ProfileContactsPropsType> = React.memo(({ userId, profile }) => {

  const dispatch = useAppDispatch();

  const myUserId = useAppSelector(state => state.login.userId);

  const { Paragraph } = Typography;

  const updateProfileContactsHandler = (contact: string, value: string) => {
    if (!(profile) || profile.contacts[contact] !== value) {
      dispatch(updateProfileContacts({ contact, value }));
    }
  };

  return (
    <div className={style.container}>
      <h3>Contacts:</h3>
      {userId === myUserId
        ? <ul style={{ listStyleType: 'none', padding: '0' }}> {profile?.contacts &&
        Object.entries(profile.contacts).map(([key, value]: any) =>
          <li key={key}>
            <h4>{key} :</h4>
            <Paragraph style={{ display: 'inline-block', marginLeft: '5px' }}
                       editable={{ tooltip: false, onChange: (value) => updateProfileContactsHandler(key, value) }}>
              {value ? value : ''}
            </Paragraph>
          </li>,
        )}
        </ul>
        : profile?.contacts && Object.values(profile?.contacts).some(el => el)
          ? <ul style={{ listStyleType: 'none', padding: '0' }}> {Object.entries(profile?.contacts)
            .map(([key, value]: any) =>
              value &&
              <li key={key}>
                <Paragraph editable={false}>
                  <h4>{key} :</h4> {value}
                </Paragraph>
              </li>)}
          </ul>
          : <h4>Fields are empty</h4>}
    </div>
  );
});
