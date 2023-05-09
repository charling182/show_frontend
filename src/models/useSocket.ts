import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socketUrl = 'http://127.0.0.1:7001';
const socket = io(socketUrl, {
    autoConnect: false, // 避免在导入时立即连接
    transports: ['websocket'],
});

import { getUserInfo } from '@/api';

const UseSocket = () => {
    const [message, setMessage] = useState<string>('');
    const [chatHistory, setChatHistory] = useState([]);

    const handlePublicSendMessage = () => {
        socket.emit('ack', message);
        setMessage('');
    };

    useEffect(() => {
        socket.on('connect', () => {
            console.log('WebSocket connection opened');
        });

        socket.on('res', (data) => {
            console.log(`Received message: ${data}`);
        });

        socket.on('disconnect', (reason) => {
            console.log(`WebSocket connection closed: ${reason}`);
        });
        socket.on('packet', (data) => {
            setChatHistory((prevState) => [...prevState, data]);
            console.log(`项目管理收到了: ${data}`);
        });

        // socket.connect();

        return () => {
            // 组件卸载时，socket.off() 方法不带参数时，它会移除与该 socket 实例相关的所有事件监听器。
            // socket.off();
            // 退出时断开连接
            // socket.disconnect();
        };
    }, []);
    return {
        socket,
        message,
        setMessage,
        chatHistory,
        setChatHistory,
        handlePublicSendMessage,
    };
};

export default UseSocket;
