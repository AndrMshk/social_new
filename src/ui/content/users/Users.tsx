import React, { useEffect, useState } from 'react';
import { Image, Input, PaginationProps, Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import avatar from '../../../img/avatar.png';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../../bll/store';
import { UserType } from '../../../dal/types';
import { Link } from 'react-router-dom';
import { setSearchUserNameReducer, usersAsyncActions } from '../../../bll/users-reducer';
import style from './users.module.scss';

const { Search } = Input;
const { follow, unFollow, setUsers } = usersAsyncActions;

export const Users: React.FC = () => {

  const dispatch = useAppDispatch();

  const myUserId = useAppSelector(state => state.login.userId);
  const {
    currentPage,
    pageSize,
    searchUserName,
    users,
    totalUsersCount,
    loading,
    followingInProgress,
  } = useAppSelector(state => state.users);

  const [searchValue, setSearchValue] = useState<string | undefined>(searchUserName);

  const followingToggleHandler = (user: UserType) => {
    user.followed ? dispatch(unFollow({ userId: user.id })) : dispatch(follow({ userId: user.id }));
  };

  const columns: ColumnsType<UserType> = [
    {
      title: 'image',
      dataIndex: 'photos',
      key: 'image',
      render: (photos) =>
        <>{photos.small
          ? <Image width={50} src={photos.small} />
          : <img src={photos.small ? photos.small : avatar} alt="avatar" style={{ width: '50px' }} />
        }</>,
    },
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
      render: (_, user) => <Link to={`/profile/${user.id}`}>{user.name}</Link>,
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
        disabled={followingInProgress.includes(user.id) || user.id === myUserId}
      />,
    },
  ];

  const onSearch = (value: string) => {
    if (value === '') {
      dispatch(setSearchUserNameReducer({ name: undefined }));
    } else {
      dispatch(setSearchUserNameReducer({ name: value }));
    }
  };

  useEffect(() => {
    dispatch(setUsers({ page: currentPage, pageSize, name: searchUserName }));
  }, [searchUserName]);

  const onChange: PaginationProps['onChange'] = (current, pageSize) => {
    dispatch(setUsers({ page: current, pageSize, name: searchUserName }));
  };

  return (
    <div className={style.container}>
      <Search value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="input search text" allowClear onSearch={onSearch}
              className={style.search} />
      <Table
        className={style.table}
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
    </div>
  );
};
