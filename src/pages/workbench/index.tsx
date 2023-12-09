import React, { useState, useEffect, FC } from 'react';
import { DesktopOutlined } from '@ant-design/icons';
import { Row, Col, Input, Button, List } from 'antd';
import MyProject from './components/my-project';
import MyTask from './components/my-task';
import UserInfo from './components/user-info';
import { connect, ConnectProps, SocketModelState } from 'umi';
import styles from './index.less';

interface PageProps extends ConnectProps {
    socket: SocketModelState;
}

const Workbench: FC<PageProps> & types.IConventionRouting = ({ socket: { socketInstance } }) => {
    // const {
    //   socket,
    //   // message,
    //   // setMessage,
    //   // chatHistory,
    //   // setChatHistory,
    //   handlePublicSendMessage,
    // } = useModel('useSocket', (model) => ({
    //   socket: model.socket,
    //   // message: model.message,
    //   // setMessage: model.setMessage,
    //   // chatHistory: model.chatHistory,
    //   // setChatHistory: model.setChatHistory,
    //   // handlePublicSendMessage: model.handlePublicSendMessage,
    // }));

    const [projectCount, setProjectCount] = useState(0);

    const getProjectCount = (count) => {
        setProjectCount(count);
    };

    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            // handlePublicSendMessage(message);
            // socketInstance.emit('ack', message);
            setMessage('');
        }
    };

    useEffect(() => {
        // socketInstance.on('connect', () => {
        //     console.log('WebSocket connection opened');
        // });
        // socketInstance.on('res', (data) => {
        //     console.log(`Received message: ${data}`);
        // });
        // socketInstance.on('disconnect', (reason) => {
        //     console.log(`WebSocket connection closed: ${reason}`);
        // });
        // socketInstance.on('packet', (data) => {
        //     setChatHistory((prevState) => [...prevState, data]);
        //     console.log(`项目管理收到了: ${data}`);
        // });
        // return () => {
        //     socketInstance.off();
        // };
    }, []);

    return (
        <div className={styles['workbench']}>
            <Row gutter={20}>
                <UserInfo projectCount={projectCount}></UserInfo>
                <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                    <MyProject onGetProjectCount={getProjectCount} />
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                    <MyTask />
                </Col>
            </Row>
        </div>
    );
};

const ConnectedWorkbench = connect(({ socket }: { socket: SocketModelState }) => ({
    socket,
}))(Workbench);

ConnectedWorkbench.menu = {
    name: '工作台',
    icon: 'DesktopOutlined',
};
ConnectedWorkbench.layout = {
    // hideMenu: true, // 自动隐藏页面菜单栏
    // hideNav: true, // 自动隐藏页面顶部导航条
    // hideFooter: true, // 自动隐藏页面底部footer
    // 如果把三个都设置为true，可以实现“无布局”效果，在实现login等全屏页面时非常有用
};
// ConnectedWorkbench.access = 'root:referralTraffic';
ConnectedWorkbench.order = 1;
export default ConnectedWorkbench;
