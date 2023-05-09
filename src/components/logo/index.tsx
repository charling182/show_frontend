import React, { useState } from 'react';
import { Badge, Avatar } from 'antd';
import { title } from '~/config/_vars.ts';
import { For, If } from 'tsx-control-statements/components';
import { IconFont } from '@/components/iconfont';
import GithubPath from '@/components/github-path';
import MessageBox from '@/components/message-box';
import UserOperation from '@/components/user-operation';
import { UserOutlined } from '@ant-design/icons';

import styles from './index.less';

const LayoutHeader = () => {
    const logoTitle: string = title.charAt(0).toUpperCase() + title.slice(1);
    const accessRoutesTreeNoHidden: any[] = [];
    const [navIndex, setNavIndex] = useState<number>(0);
    const onlineUserIds: any[] = ['1', '2'];
    const messageCount: number = 3;
    const userInfo = {};

    const logoClick = () => {
        // if (this.navIndex !== 0) {
        //   this.navClick(0);
        // }
    };
    const navClick = (index: number) => {
        // this.navIndex = index;
        // this.$router.push(this.accessRoutesTreeNoHidden[index].path);
    };

    return <img className={styles['logo-img']} src="/static/img/charling.png" alt="" />;
};

export default LayoutHeader;
