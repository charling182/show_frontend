import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import styles from './index.less';
import BImage from '@/components/b-image';
import { getInviteByUuid, getOneProject, getUserProjectList, acceptInvite as accept } from '@/api';
import { useModel, history } from 'umi';
import NewMessage from '~/public/static/img/new-message.png';
import { Choose, When, Otherwise } from 'tsx-control-statements/components';

const Invite = ({ match }) => {
    const { initialState } = useModel('@@initialState');
    const [data, setData] = useState({ valid: true });
    const [joined, setJoined] = useState(false);
    const [project, setProject] = useState({});
    const userInfo: any = initialState || {};

    useEffect(() => {
        const fetchInfoByUUID = async () => {
            const { data } = await getInviteByUuid({ uuid: match.params.id });
            // 获取项目名称
            const projectInfo = await getOneProject({ id: data.group_id });
            setProject(projectInfo.data);
            // 判断是已经加入
            const {
                data: { count },
            } = await getUserProjectList({
                user_id: data.receiver_id || userInfo.id,
                project_id: data.group_id,
            });
            setData(data);
            if (count) {
                setJoined(true);
            } else {
                setJoined(false);
            }
            // 如果存在指定邀请接受者，并且不是当前登录者，则认为是一次错误打开的邀请链接， 则403
            if (data.receiver_id && data.receiver_id !== userInfo.id) {
                history.push('/403');
            }
        };

        fetchInfoByUUID();
    }, [match.params.id, userInfo.id]);

    const acceptInvite = async () => {
        const { code } = await accept({ uuid: match.params.id });
        if (code === 200) {
            // 跳转到项目详情页
            message.success('加入成功');
            // history.push(`/project/${data.group_id}`);
        }
    };

    return (
        <div className={styles['project-invite']}>
            <div className={styles['wrap-content']}>
                <div className={styles['app-name']}>charling</div>
                <img className={styles['new-message']} src={NewMessage} alt="" />
                <div className={styles['wrap-ctrl']}>
                    <BImage
                        className={styles['user-avatar']}
                        src={data.actor && data.actor.avatar}
                        width={64}
                        height={64}
                        borderRadius={64}
                    />
                    <div className={styles['text']}>
                        {data.actor && data.actor.username}
                        <span className={styles['color-light']}>邀请你加入项目</span>
                    </div>
                    <div className={styles['project-name']}>{project.name}</div>
                    <div className={styles['wrap-btn']}>
                        <Choose>
                            <When condition={joined}>
                                <Button disabled style={{ width: '80%', borderRadius: 12 }}>
                                    已加入
                                </Button>
                            </When>
                            <When condition={!data.valid && !joined}>
                                <Button disabled style={{ width: '80%', borderRadius: 12 }}>
                                    邀请已过期
                                </Button>
                            </When>
                            <When condition={data.is_accept === 1 && data.valid && !joined}>
                                <Button disabled style={{ width: '80%', borderRadius: 12 }}>
                                    邀请已过期
                                </Button>
                            </When>
                            <Otherwise>
                                <Button
                                    type="primary"
                                    style={{ width: '80%', borderRadius: 12 }}
                                    onClick={acceptInvite}
                                >
                                    立刻加入
                                </Button>
                            </Otherwise>
                        </Choose>
                    </div>
                </div>
            </div>
        </div>
    );
};

Invite.layout = {
    hideMenu: true, // 自动隐藏页面菜单栏
    hideNav: true, // 自动隐藏页面顶部导航条
    hideFooter: true, // 自动隐藏页面底部footer
    // 如果把三个都设置为true，可以实现“无布局”效果，在实现login等全屏页面时非常有用
};
export default Invite;
