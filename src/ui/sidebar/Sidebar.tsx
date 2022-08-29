import React, { useEffect } from 'react';
import { UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { TeamOutlined } from '@ant-design/icons/lib';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../bll/store';
import { usersAsyncActions } from '../../bll/user/users-reducer';
import style from './sidebar.module.scss'

const { setFriends } = usersAsyncActions;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

export const SidebarComponent: React.FC = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onClick: MenuProps['onClick'] = e => {
    if (e.keyPath[1] === 'user') {
      navigate(`/profile/${e.keyPath[0]}`);
    } else if (e.keyPath[0] === 'myProfile') {
      navigate(`/`);
    }
  };
  const followedUsers = useAppSelector(state => state.users.followedUsers)
    .map(el => ({ label: el.name, key: el.id }));

  const items: MenuProps['items'] = [
    getItem(<Link to="/profile">Profile</Link>, 'myProfile', <UserOutlined />),
    getItem(<Link to="/users">Users</Link>, 'users', <TeamOutlined />),
    getItem('Friends', 'user', null, followedUsers),
  ];

  useEffect(() => {
    dispatch(setFriends());
  }, [followedUsers.length]);

  return (
    <div className={style.container} style={{height: '100%' }}>
      <Menu
        onClick={onClick}
        className={style.menu}
        defaultOpenKeys={['sub1']}
        mode="inline"
        items={items}
      />
    </div>
  );
};
