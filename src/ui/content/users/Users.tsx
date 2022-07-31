import React, { useEffect } from 'react';
import { Image, PaginationProps, Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import avatar from '../../../img/avatar.png';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../../bll/store';
import { findUsersTC, followTC, setUsersTC, unFollowTC } from '../../../bll/users-reducer';
import { UserType } from '../../../dal/types';
import { Input } from 'antd';

const { Search } = Input;

export const Users: React.FC = () => {
  const currentPage = useAppSelector(state => state.users.currentPage);
  const pageSize = useAppSelector(state => state.users.pageSize);
  const users = useAppSelector(state => state.users.users);
  const loading = useAppSelector(state => state.users.loading);
  const totalUsersCount = useAppSelector(state => state.users.totalUsersCount);
  const dispatch = useAppDispatch();
  const followingInProgress = useAppSelector(state => state.users.followingInProgress);
  const error = useAppSelector(state => state.app.error);

  const followingToggleHandler = (user: UserType) => {
    if (!user.followed) {
      dispatch(followTC(user.id));
    } else {
      dispatch(unFollowTC(user.id));
    }
  };

  const columns: ColumnsType<UserType> = [
    {
      title: 'image',
      dataIndex: 'photos',
      key: 'image',
      render: (photos) => <>{photos.small
        ? <Image width={50} src={photos.small} />
        : <img src={photos.small ? photos.small : avatar} style={{ width: '50px' }} />
      }</>,
    },
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'followed',
      dataIndex: 'followed',
      key: 'followed',
      render: (_, user) => <Switch
        onChange={() => followingToggleHandler(user)}
        checkedChildren={<CheckOutlined />}
        unCheckedChildren={<CloseOutlined />}
        checked={user.followed}
        disabled={followingInProgress.includes(user.id)}
      />,
    },
  ];

  const onSearch = (value: string) => {
    dispatch(findUsersTC(value))
  }
  // don't work

  useEffect(() => {
    dispatch(setUsersTC(currentPage, pageSize));
  }, [currentPage, pageSize]);

  const onChange: PaginationProps['onChange'] = (current, pageSize) => {
    dispatch(setUsersTC(current, pageSize));
  };

  return (
    <>
      <Search placeholder="input search text" allowClear onSearch={onSearch} style={{ width: 200 }} />
      <Table
        style={{ height: '400px' }}
        loading={loading}
        pagination={
          {
            position: ['topCenter'],
            pageSize: pageSize,
            total: totalUsersCount,
            defaultCurrent: currentPage,
            onChange: onChange,
            showSizeChanger: false,
          }
        }
        columns={columns}
        dataSource={users}
        size={'middle'}
      />
    </>
  );
};
