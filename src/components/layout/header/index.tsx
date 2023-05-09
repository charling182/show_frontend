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

    return (
        <div className={styles['header-react-charling']}>
            <div className={styles['wrap-logo']} onClick={logoClick}>
                <img className={styles['logo-img']} src="../../assets/logo.png" alt="" />
                <span className={styles['logo-title']}>{logoTitle}</span>
            </div>
            <div className={styles['wrap-nav-ctrl']}>
                <div className={styles['nav-list']}>
                    <For each="item" of={accessRoutesTreeNoHidden} index="index">
                        <div
                            key={item.id}
                            className={`${styles['nav-item']} ${
                                navIndex === index ? styles['nav-item-active'] : ''
                            }}`}
                            onClick={() => navClick(index)}
                        >
                            <If condition={item.icon}>
                                <i className={item.icon}></i>
                                <span>{item.title}</span>
                            </If>
                        </div>
                    </For>
                </div>
                <div className={styles['wrap-ctrl']}>
                    <GithubPath />
                    <div className={styles['wrap-online-user']}>
                        <Badge color="#1890ff" size="small" count={onlineUserIds.length}>
                            <IconFont type="duoren" />
                        </Badge>
                    </div>
                    <MessageBox>
                        <div className={styles['wrap-message-icon']}>
                            <Badge color="#1890ff" size="small" count={messageCount}>
                                <IconFont type="xiangling" />
                            </Badge>
                        </div>
                    </MessageBox>
                    <UserOperation>
                        <div className={styles['username']}>
                            <Avatar size={32} icon={<UserOutlined />} />
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
