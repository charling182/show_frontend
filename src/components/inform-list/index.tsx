import { List, Avatar, Button, message } from 'antd';
import { For } from 'tsx-control-statements/components';
import { updateMessage } from '@/api';
import styles from './index.less';

const InformList = ({ data }) => {
    const select = (item) => {
        if (item.url) {
            // 在此处使用路由导航实现页面跳转,跳转到具体项目
        }
        doRead(item);
    };

    const doRead = async (item, e) => {
        e.stopPropagation();
        const { code } = await updateMessage({
            ...item,
            is_read: 1,
        });
        if (code === 200) {
            message.success('操作成功');
        }
    };

    const renderItem = (item: any) => {
        const { actor, content, created_at_humanize } = item;

        return (
            <List.Item onClick={() => select(item)}>
                <List.Item.Meta
                    avatar={<Avatar src={actor.avatar}>{actor && actor.username[0]}</Avatar>}
                    title={<span>{actor && actor.username}</span>}
                    description={<span dangerouslySetInnerHTML={{ __html: content }} />}
                />
                <div className={styles['created_at']}>{created_at_humanize}</div>
                <div className={styles['controller']}>
                    <Button
                        type="link"
                        onClick={(e) => {
                            e.stopPropagation();
                            doRead(item);
                        }}
                    >
                        标记为已读
                    </Button>
                </div>
            </List.Item>
        );
    };

    return (
        <div className={styles['list-inform']}>
            <For each="item" of={data} index="index">
                <div className={styles['item']} onClick={() => select(item)}>
                    <div className={styles['main']}>
                        <span className={styles['username']}>
                            {item.actor && item.actor.username}
                        </span>
                        <span
                            className={styles['content']}
                            dangerouslySetInnerHTML={{ __html: item.content }}
                        ></span>
                    </div>
                    <div className={styles['created_at']}>{item.created_at_humanize}</div>
                    <div className={styles['controller']}>
                        <div className={styles['btn']} onClick={(e) => doRead(item, e)}>
                            {' '}
                            标记为已读{' '}
                        </div>
                    </div>
                </div>
            </For>
        </div>
    );
};

export default InformList;
