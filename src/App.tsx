import { Layout, Modal, Space, Spin } from 'antd';
import React, { useEffect } from 'react';
import './App.css';
import { FooterComponent } from './ui/footer/Footer';
import { useAppDispatch, useAppSelector } from './bll/store';
import { HeaderComponent } from './ui/header/Header';
import { SidebarComponent } from './ui/sidebar/Sidebar';
import { ContentComponent } from './ui/content/Content';
import { setAppErrorReducer, setAppInitialized } from './bll/app/app-reducer';

const { Header, Footer, Sider, Content } = Layout;

const App: React.FC = () => {

  const dispatch = useAppDispatch();

  const { isInitialized, error } = useAppSelector(state => state.app);
  const isAuth = useAppSelector(state => state.login.isAuth);

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

  const ErrorModal = () => {
    Modal.error({
      title: 'Error',
      content: (<div>{error}</div>),
      onOk() {dispatch(setAppErrorReducer({ error: null }));},
    });
  };

  return (
    <>
      <Layout className={'main'}>
        <Header className="header"><HeaderComponent /></Header>
        {isAuth && <div className="contentMain">
          <Layout >
            <Sider className="sidebar"><SidebarComponent /></Sider>
          </Layout>
          <Content className="content"><ContentComponent /></Content>
        </div>}
        <Footer className="footer"><FooterComponent /></Footer>
      </Layout>
      {error && ErrorModal()}
    </>
  );
};

export default App;
