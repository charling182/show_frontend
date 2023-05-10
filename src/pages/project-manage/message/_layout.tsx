import React from 'react';
import styles from './index.less';

const MessaheManage = (props) => {
    return <div className={styles['messasge-manage']}>{props.children}</div>;
};

MessaheManage.menu = {
    name: '消息提醒',
    icon: 'LineChartOutlined',
};

MessaheManage.order = 4;

export default MessaheManage;
