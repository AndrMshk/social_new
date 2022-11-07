import { Layout, Modal, Space, Spin } from 'antd';
import React, { useEffect } from 'react';
import { FooterComponent } from './ui/footer/Footer';
import { useAppDispatch, useAppSelector } from './bll/store';
import { HeaderComponent } from './ui/header/Header';
import { SidebarComponent } from './ui/sidebar/Sidebar';
import { ContentComponent } from './ui/content/Content';
import { setAppErrorReducer, setAppInitialized } from './bll/app-reducer';
import style from './app.module.scss';

const { Content } = Layout;

const App: React.FC = () => {

  const dispatch = useAppDispatch();

  const { isInitialized, error } = useAppSelector(state => state.app);
  const isAuth = useAppSelector(state => state.login.isAuth);

  useEffect(() => {dispatch(setAppInitialized()); }, []);

  const ErrorModal = () => {
    Modal.error({
      title: 'Error',
      content: (<div>{error}</div>),
      onOk() {dispatch(setAppErrorReducer({ error: null }));},
    });
  };

  if (!isInitialized) {
    return <div className={style.loading}><Space size="large"><Spin size="large" /></Space></div>;
  }

  return (
    <>
      <div className={style.container}>
        <HeaderComponent />
        <main className={style.main}>
          {isAuth && <SidebarComponent />}
          <Content className={style.content}><ContentComponent /></Content>
        </main>
        <FooterComponent />
      </div>
      {error && ErrorModal()}
    </>
  );
};

export default App;
