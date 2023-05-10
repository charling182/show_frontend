import React from 'react';
import Message from '../components/message-component';

const Personal = () => {
    return <Message type="personal" />;
};

Personal.menu = {
    name: '私信',
    icon: 'LineChartOutlined',
};

Personal.order = 3;

export default Personal;
