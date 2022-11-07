import React, { useState } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../bll/store';
import test from '../../img/test.jpg';
import { loginAsyncActions } from '../../bll/login-reducer';
import style from './header.module.scss';

const { logout } = loginAsyncActions;

export const HeaderComponent = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isShowFriends, setIsShowFriends] = useState(false);

  const { isAuth, email } = useAppSelector(state => state.login);
  const friends = useAppSelector(state => state.users.followedUsers);

  const navigateHandler = (path?: string) => {
    if (path) {
      path === '/profile'
        ? navigate('/profile')
        : navigate('/users');
      setIsShowFriends(false);
    } else {
      setIsShowFriends(!isShowFriends);
    }
  };

  const goToCurrentFriend = (userId: number) => {
    navigate(`/profile/${userId}`);
    setIsShowFriends(false);
  };

  return (
    <header className={style.main}>
      <div className={style.wrapper}>
        <div className={style.container}>
          <img src={test} alt="logo" />
          {email && <div>{email}</div>}
          <div>{isAuth
            ? <Button onClick={() => dispatch(logout())}>Exit</Button>
            : <Button onClick={() => navigate('/login')}>Login</Button>}
          </div>
        </div>
        <div className={style.buttons}>
          <Button onClick={() => navigateHandler('/profile')}>Profile</Button>
          <Button onClick={() => navigateHandler()}>Friends</Button>
          <Button onClick={() => navigateHandler('/users')}>Users</Button>
        </div>
      </div>
      {isShowFriends &&
      <div className={style.friends}>
        {friends.map(el => <div
          key={el.id}
          className={style.friend}
          onClick={() => {goToCurrentFriend(el.id);}}>
          {el.name}</div>)}
      </div>}
    </header>
  );
};
