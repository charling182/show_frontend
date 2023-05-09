import { List, Avatar, Button } from 'antd';
import { For } from 'tsx-control-statements/components';
// import { doEdit } from '@/api/messageManagement';
import styles from './index.less';

const InformList = ({ data }) => {
    const select = (item) => {
        if (item.url) {
            // 在此处使用路由导航实现页面跳转
        }
        doRead(item);
    };

    const doRead = (item) => {
        // doEdit({
        //   ...item,
        //   is_read: 1,
        // });
    };

    const renderItem = (item: any) => {
        const { actor, content, created_at_humanize } = item;

        return (
            <List.Item onClick={() => select(item)}>
                <List.Item.Meta
                    avatar={<Avatar>{actor && actor.username[0]}</Avatar>}
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
                {renderItem(item)}
            </For>
        </div>
    );
};

export default InformList;
