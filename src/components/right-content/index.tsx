import React, { useState, useEffect } from 'react';
import { Badge, Avatar } from 'antd';
import { title } from '~/config/_vars.ts';
import { For, If } from 'tsx-control-statements/components';
import { IconFont } from '@/components/iconfont';
import GithubPath from '@/components/github-path';
import MessageBox from '@/components/message-box';
import UserOperation from '@/components/user-operation';
import { UserOutlined } from '@ant-design/icons';
import { useModel, useStore } from 'umi';

import styles from './index.less';

const LayoutHeader = () => {
    const store = useStore();

    const {
        socket: { onlineUserSocketIds },
    }: any = store.getState();
    const { initialState } = useModel('@@initialState');
    const logoTitle: string = title.charAt(0).toUpperCase() + title.slice(1);
    const accessRoutesTreeNoHidden: any[] = [];
    const [navIndex, setNavIndex] = useState<number>(0);
    const onlineUserIds: any[] = ['1', '2'];
    const userInfo = initialState || {};
    const [messageCount, setMessageCount] = useState<number>(0);

    const logoClick = () => {
        // if (this.navIndex !== 0) {
        //   this.navClick(0);
        // }
    };
    const navClick = (index: number) => {
        // this.navIndex = index;
        // this.$router.push(this.accessRoutesTreeNoHidden[index].path);
    };
    const getMessageCount = (count: number) => {
        setMessageCount(count);
    };

    useEffect(() => {}, []);

    return (
        <div className={styles['header-react-charling']}>
            <div className={styles['wrap-nav-ctrl']}>
                <div className={styles['wrap-ctrl']}>
                    <GithubPath />
                    <div className={styles['wrap-online-user']}>
                        <Badge color="#1890ff" size="small" count={onlineUserSocketIds.length}>
                            <IconFont type="duoren" />
                        </Badge>
                    </div>
                    <MessageBox getCount={getMessageCount}>
                        <div className={styles['wrap-message-icon']}>
                            <Badge color="#1890ff" size="small" count={messageCount}>
                                <IconFont type="xiangling" />
                            </Badge>
                        </div>
                    </MessageBox>
                    <UserOperation>
                        <div className={styles['username']}>
                            <Avatar src={userInfo.avatar} size={32} icon={<UserOutlined />} />
                            <div className={styles['username-text']}>
                                {userInfo.username ? userInfo.username : '用户姓名'}
                            </div>
                        </div>
                    </UserOperation>
                </div>
            </div>
        </div>
    );
};

export default LayoutHeader;
