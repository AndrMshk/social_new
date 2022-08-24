import React, { useEffect } from 'react';
import { MailOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { TeamOutlined } from '@ant-design/icons/lib';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../bll/store';
import { setFriendsTC } from '../../bll/user/users-reducer';

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
  const isAuth = useAppSelector(state => state.login.isAuth);

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
    getItem('Profile', 'myProfile', <UserOutlined />),
    getItem(<Link to="/messages">Messages</Link>, 'messages', <MailOutlined />),
    getItem(<Link to="/users">Users</Link>, 'users', <TeamOutlined />),
    getItem('Followed users', 'user', null, followedUsers),
  ];

  useEffect(() => {
    dispatch(setFriendsTC());
  }, [followedUsers.length]);

  return (
    <Menu
      onClick={onClick}
      style={{ width: '100%', height: '100%', overflowY: 'scroll', overflowX: 'hidden' }}
      defaultOpenKeys={['sub1']}
      mode="inline"
      items={items}
    />
  );
};
