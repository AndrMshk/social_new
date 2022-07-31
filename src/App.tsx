import { Layout, Space, Spin } from 'antd';
import React, { useEffect } from 'react';
import './App.css';
import { FooterComponent } from './ui/footer/Footer';
import { HeaderComponent } from './ui/header/Header';
import { SidebarComponent } from './ui/sidebar/Sidebar';
import { ContentComponent } from './ui/content/Content';
import { useAppDispatch, useAppSelector } from './bll/store';
import { useDispatch } from 'react-redux';
import { setAppInitializedTC } from './bll/app-reducer';
import { BrowserRouter, useNavigate } from 'react-router-dom';

const { Header, Footer, Sider, Content } = Layout;

const App: React.FC = () => {
  const isInitialized = useAppSelector(state => state.app.isInitialized);
  const dispatch = useAppDispatch();
  // const isAuth = useAppSelector(state => state.login.isAuth);
  // const navigate = useNavigate();

  useEffect(() => {
    dispatch(setAppInitializedTC());
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

  return (
    <>
      <Layout>
        <Header className="header"><HeaderComponent /></Header>
        <Layout className="content">
          <Sider><SidebarComponent /></Sider>
          <Content><ContentComponent /></Content>
        </Layout>
        <Footer className="footer"><FooterComponent /></Footer>
      </Layout>
    </>
  );
};

export default App;