import React, { useState } from 'react';
import { Image, Typography } from 'antd';
// import { useSelector } from 'react-redux';
import classnames from 'classnames';
import styles from './index.less';
import { useModel } from 'umi';

const { Text } = Typography;

interface IUserInfo {
    username: string;
    email: string;
}

const UserInfo = ({ projectCount }) => {
    const { initialState }: any = useModel('@@initialState');

    const [userInfo, setUserInfo] = useState<types.user.changeUserData & IUserInfo>({
        username: initialState?.username || '',
        email: initialState?.email || '',
        id: initialState?.id || '',
        nickname: initialState?.nickname || '',
        phone: initialState?.phone || '',
        company: initialState?.company || '',
        city: initialState?.city || '',
        roles: initialState?.roles || '',
        avatar: initialState?.avatar || '',
    });

    const getTip = () => {
        const time = new Date().getHours();
        if (time >= 0 && time < 5) {
            return '深夜了，注意身体哦，';
        } else if (time < 7) {
            return '清晨好，早起的鸟儿有虫吃，';
        } else if (time < 12) {
            return '上午好，';
        } else if (time < 19) {
            return '下午好，';
        } else if (time < 22) {
            return '晚上好，';
        } else if (time <= 23) {
            return '还在加班吗？辛苦了，';
        }
    };

    const tip = getTip();

    return (
        <div className={styles['user-info']}>
            <div className={styles['wrap-user']}>
                <img className={styles['user-avatar']} src={userInfo.avatar || ''} alt="用户头像" />
                <div className={styles.info}>
                    <div
                        className={styles.tip}
                    >{`${tip} ${userInfo.username}，祝你开心每一天！`}</div>
                    <Text className={styles.role}>
                        {userInfo.roles && userInfo.roles[0] && userInfo.roles[0].name}
                    </Text>
                </div>
            </div>
            <div className={styles['wrap-project']}>
                <Text>项目总数</Text>
                <div className={classnames(styles.count, 'text-xl')}>{projectCount}</div>
            </div>
        </div>
    );
};

export default UserInfo;
