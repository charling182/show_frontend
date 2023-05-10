import React, { useEffect, useState } from 'react';
import { useModel, useStore, SocketModelState } from 'umi';
import { Row, Col, Input, Button, List } from 'antd';
import styles from './index.less';

const ProjectManage = (props) => {
    const store = useStore();

    const {
        socket: { socketInstance },
    }: any = store.getState();

    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            socketInstance.emit('ack', message);
            setMessage('');
            // handlePublicSendMessage(message);
        }
    };

    useEffect(() => {
        socketInstance.on('connect', () => {
            console.log('WebSocket connection opened');
        });

        socketInstance.on('res', (data) => {
            console.log(`Received message: ${data}`);
        });

        socketInstance.on('disconnect', (reason) => {
            console.log(`WebSocket connection closed: ${reason}`);
        });
        socketInstance.on('packet', (data) => {
            setChatHistory((prevState) => [...prevState, data]);
            console.log(`项目管理收到了: ${data}`);
        });

        return () => {
            socketInstance.off();
        };
    }, []);

    return <div className={styles['project-manage']}>{props.children}</div>;
};

ProjectManage.menu = {
    name: '项目管理',
    icon: 'LineChartOutlined',
};

ProjectManage.order = 2;

export default ProjectManage;
