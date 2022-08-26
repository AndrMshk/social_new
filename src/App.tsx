import { Layout, Modal, Space, Spin } from 'antd';
import React, { useEffect } from 'react';
import './App.css';
import { FooterComponent } from './ui/footer/Footer';
import { useAppDispatch, useAppSelector } from './bll/store';
import { HeaderComponent } from './ui/header/Header';
import { SidebarComponent } from './ui/sidebar/Sidebar';
import { ContentComponent } from './ui/content/Content';
import { appAsyncActions } from './bll/app/app-async-actions';
import { setAppErrorReducer } from './bll/app/app-reducer';

const { setAppInitialized } = appAsyncActions;

const { Header, Footer, Sider, Content } = Layout;

const App: React.FC = () => {

  const dispatch = useAppDispatch();

  const isInitialized = useAppSelector(state => state.app.isInitialized);
  const isAuth = useAppSelector(state => state.login.isAuth);
  const error = useAppSelector(state => state.app.error);

  useEffect(() => {
    dispatch(setAppInitialized());
  }, []);

  if (!isInitialized) {
    return <div style={
      {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }
    }>
      <Space size="large">
        <Spin size="large" />
      </Space></div>;
  }

  const errorModal = () => {
    Modal.error({
      title: 'Error',
      content: (<div>{error}</div>),
      onOk() {dispatch(setAppErrorReducer({ error: null }));},
    });
  };

  return (
    <>
      <Layout>
        <Header className="header"><HeaderComponent /></Header>
        <Layout className="content">
          {isAuth && <Sider><SidebarComponent /></Sider>}
          <Content><ContentComponent /></Content>
        </Layout>
        <Footer className="footer"><FooterComponent /></Footer>
      </Layout>
      {error && errorModal()}
    </>
  );
};

export default App;
