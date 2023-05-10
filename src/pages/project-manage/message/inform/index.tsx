import React from 'react';
import Message from '../components/message-component';

const Inform = () => {
    return <Message type="inform" />;
};

Inform.menu = {
    name: '通知',
    icon: 'LineChartOutlined',
};

Inform.order = 2;

export default Inform;
