import React, { useEffect } from 'react';
import { Badge, Avatar } from 'antd';
import { IconFont } from '@/components/iconfont';
import GithubPath from '@/components/github-path';
import MessageBox from '@/components/message-box';
import UserOperation from '@/components/user-operation';
import { UserOutlined } from '@ant-design/icons';
import { useModel, useSelector, useDispatch } from 'umi';

import styles from './index.less';

const LayoutHeader = () => {
    // useStore并不会导致组件重新渲染。如果你需要组件在state变化时重新渲染，你应该使用useSelector。
    const {
        socket: { messageCount, onlineUserIds, messageData },
    } = useSelector((state: any) => state);
    const dispatch = useDispatch();
    const { initialState } = useModel('@@initialState');
    const userInfo = initialState || {};

    useEffect(() => {
        dispatch({
            type: 'socket/getMessageEffects',
        });
    }, []);

    return (
        <div className={styles['header-react-charling']}>
            <div className={styles['wrap-nav-ctrl']}>
                <div className={styles['wrap-ctrl']}>
                    <GithubPath />
                    <div className={styles['wrap-online-user']}>
                        <Badge color="#1890ff" size="small" count={onlineUserIds.length}>
                            <IconFont type="duoren" />
                        </Badge>
                    </div>
                    <MessageBox messageData={messageData}>
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
