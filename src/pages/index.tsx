import { Layout, Menu, Breadcrumb } from 'antd';
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import ProjectHeader from '@/components/layout/header';
import { Route, Switch } from 'react-router-dom';
import PersonalCenter from '@/pages/personal-center/_layout';
import type { IRouteComponentProps } from 'umi';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export default function MyLayout(
  props: IRouteComponentProps & { routes: types.IRoute[] },
) {
  console.log('props.routes', props.routes);

  return (
    // <Layout>
    //   <ProjectHeader />

    //   <Header className="header">
    //     <div className="logo" />
    //     <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
    //       <Menu.Item key="1">nav 1</Menu.Item>
    //       <Menu.Item key="2">nav 2</Menu.Item>
    //       <Menu.Item key="3">nav 3</Menu.Item>
    //     </Menu>
    //   </Header>
    //   <Layout style={{ padding: '0 24px 24px' }}>
    //     <Breadcrumb style={{ margin: '16px 0' }}>
    //       <Breadcrumb.Item>Home</Breadcrumb.Item>
    //       <Breadcrumb.Item>List</Breadcrumb.Item>
    //       <Breadcrumb.Item>App</Breadcrumb.Item>
    //     </Breadcrumb>
    //     <Content
    //       className="site-layout-background"
    //       style={{
    //         padding: 24,
    //         margin: 0,
    //         minHeight: 280,
    //       }}
    //     ></Content>
    //   </Layout>
    // </Layout>
    <>{props.children}</>
  );
}
