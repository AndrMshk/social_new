import React, { FC } from 'react';
import { Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '../../../../bll/store';
import { ProfileObjType } from '../Profile';
import { updateProfileContacts } from '../../../../bll/profile/profile-reducer';

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
    <div>
      <h3>Contacts:</h3>
      {userId === myUserId
        ? <ul style={{ listStyleType: 'none' }}> {profile?.contacts && Object.entries(profile.contacts).map(([key, value]: any) =>
          <li key={key}>
            {key}:
            <Paragraph style={{ display: 'inline-block', marginLeft: '5px' }}
                       editable={{ tooltip: false, onChange: (value) => updateProfileContactsHandler(key, value) }}>
              {value ? value :  ''}
            </Paragraph>
          </li>,
        )}
        </ul>
        : profile?.contacts && Object.values(profile?.contacts).some(el => el)
          ? <ul style={{ listStyleType: 'none' }}> {Object.entries(profile?.contacts).map(([key, value]: any) =>
            value &&
            <li key={key}>
              <Paragraph editable={false}>
                {key}: {value}
              </Paragraph>
            </li>)}
          </ul>
          : <h4>Fields are empty</h4>}
    </div>
  );
});

/*

{profile?.contacts && Object.values(profile?.contacts).some(el => el)
        ? userId === myUserId
          ? <ul style={{ listStyleType: 'none' }}> {Object.entries(profile?.contacts).map(([key, value]: any) =>
            <li key={key}>
              {key}:
              <Paragraph style={{ display: 'inline-block', marginLeft: '5px' }}
                         editable={{ tooltip: false, onChange: (value) => updateProfileContactsHandler(key, value) }}>
                {value || '________________'}
              </Paragraph>
            </li>,
          )}
          </ul>
          : <ul style={{ listStyleType: 'none' }}> {Object.entries(profile?.contacts).map(([key, value]: any) =>
            value &&
            <li key={key}>
              <Paragraph editable={false}>
                {key}: {value}
              </Paragraph>
            </li>)}
          </ul>
        : <h4>Fields are empty</h4>}

        */
