import { Layout, Modal, Space, Spin } from 'antd';
import React, { useEffect } from 'react';
import { FooterComponent } from './ui/footer/Footer';
import { useAppDispatch, useAppSelector } from './bll/store';
import { HeaderComponent } from './ui/header/Header';
import { SidebarComponent } from './ui/sidebar/Sidebar';
import { ContentComponent } from './ui/content/Content';
import { setAppErrorReducer, setAppInitialized } from './bll/app/app-reducer';
import style from './app.module.scss';

const { Header, Footer, Sider, Content } = Layout;

const App: React.FC = () => {

  const dispatch = useAppDispatch();

  const { isInitialized, error } = useAppSelector(state => state.app);
  const isAuth = useAppSelector(state => state.login.isAuth);

  useEffect(() => {
    dispatch(setAppInitialized());
  }, []);

  if (!isInitialized) {
    return <div className={style.loading}><Space size="large"><Spin size="large" /></Space></div>;
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
      <Layout className={style.container}>
        <Header className={style.header}><HeaderComponent /></Header>
        <div className={style.main}>
          {isAuth && <Layout><Sider><SidebarComponent /></Sider> </Layout>}
          <Content className={style.content}><ContentComponent /></Content>
        </div>
        <Footer className={style.footer}><FooterComponent /></Footer>
      </Layout>
      {error && ErrorModal()}
    </>
  );
};

export default App;
