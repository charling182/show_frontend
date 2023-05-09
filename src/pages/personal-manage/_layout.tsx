import React from 'react';
import styles from './index.less';

const PersonalManage = (props) => {
    return <div className={styles['personal-manage']}>{props.children}</div>;
};

PersonalManage.menu = {
    name: '用户管理',
    icon: 'LineChartOutlined',
};

PersonalManage.order = 4;

export default PersonalManage;
