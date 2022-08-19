import React, { useEffect, useState } from 'react';
import { Image, Input, PaginationProps, Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import avatar from '../../../img/avatar.png';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../../bll/store';
import { followTC, setSearchUserName, setUsersTC, unFollowTC } from '../../../bll/user/users-reducer';
import { UserType } from '../../../dal/types';

const { Search } = Input;

export const Users: React.FC = () => {

  const loading = useAppSelector(state => state.users.loading);
  const followingInProgress = useAppSelector(state => state.users.followingInProgress);
  const error = useAppSelector(state => state.app.error);
  const { currentPage, pageSize, searchUserName, users, totalUsersCount } =
    useAppSelector(state => state.users);

  const dispatch = useAppDispatch();

  const [searchValue, setSearchValue] = useState<string | undefined>(searchUserName);

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
    if (value === '') {
      dispatch(setSearchUserName({ name: undefined }));
    } else {
      dispatch(setSearchUserName({ name: value }));
    }
  };

  useEffect(() => {
    dispatch(setUsersTC(currentPage, pageSize, searchUserName));
  }, [searchUserName]);

  const onChange: PaginationProps['onChange'] = (current, pageSize) => {
    dispatch(setUsersTC(current, pageSize, searchUserName));
  };

  return (
    <>
      <Search value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="input search text" allowClear onSearch={onSearch}
              style={{ width: 200 }} />
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
