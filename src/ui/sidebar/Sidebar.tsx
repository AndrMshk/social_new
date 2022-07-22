import React from 'react';
import { MailOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { TeamOutlined } from '@ant-design/icons/lib';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../bll/store';

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

// сделать массив юзеров которые фолов и при фолове пушить пользователя в массив а потом его отрисовывать
// запрос на сервер все юзеров и потом их фильтровать это пизда
// но когда при перезагрузке будет все теряться
// подумать как сделать рпавильно


export const SidebarComponent: React.FC = () => {
  const onClick: MenuProps['onClick'] = e => {
    console.log('click ', e);
  };
  const followedUsers = useAppSelector(state => state.users.users)
    .filter(el=>(el.followed))
    .map(el=>({label: el.name, key: el.id}))


  const items: MenuProps['items'] = [
    getItem(<Link to="/profile">Profile</Link>, 'n1', <UserOutlined />),
    getItem(<Link to="/messages">Messages</Link>, 'n2', <MailOutlined />),
    getItem(<Link to="/users">Users</Link>, 'n3', <TeamOutlined />),
    getItem('Followed users', 'sub2', null,
      followedUsers,
      // [
      //   getItem('Followed users1', '4'),
      //   getItem('Followed users2', '5'),
      // ]
    ),
  ];
  return (
    <Menu
      onClick={onClick}
      style={{ width: '100%', height: '100%' }}
      // defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="inline"
      items={items}

    />
  );
};
