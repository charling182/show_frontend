import React from 'react';
import Message from '../components/message-component';

const Mention = () => {
    return <Message type="mention" />;
};

Mention.menu = {
    name: '@我',
    icon: 'LineChartOutlined',
};

Mention.order = 1;

export default Mention;
