import React, { useState, useEffect } from 'react';
import { Popover, Tabs, Badge } from 'antd';
import InformList from '@/components/inform-list';
import { IconFont } from '@/components/iconfont';
import { Choose, When, Otherwise } from 'tsx-control-statements/components';
import styles from './index.less';
import { getMessageList as getList } from '@/api';
import { useModel } from 'umi';
import { dateHumanizeFormat } from '@/utils';
import dayjs from 'dayjs';
import { groupBy } from 'lodash';

const { TabPane } = Tabs;

const MessageBox = (props) => {
    const { children, getCount } = props;
    const { initialState } = useModel('@@initialState');
    const userInfo = initialState || {};
    const [activeName, setActiveName] = useState('');
    const [messageCount, setMessageCount] = useState<number>(0);
    const [count, setCount] = useState<number>(0);
    const [dataList, setDataList] = useState<any[]>([]);
    const [data, setData] = useState<any>({});

    const handleTabClick = (key) => {
        console.log('Tab clicked:', key);
    };
    const getMessageList = async () => {
        const {
            code,
            data: { count, rows },
        } = await getList({
            receiver_id: userInfo.id,
            prop_order: 'id',
            order: 'desc',
            is_read: 0,
        });
        if (code === 200) {
            setCount(count || 0);
            dataListFilter(rows || []);
        }
    };

    const dataListFilter = (list: any[] = []) => {
        const dataList = list.filter((item) => {
            item.created_at = dayjs(item.created_at).format('YYYY-MM-DD HH:mm:ss');
            item.created_at_humanize = dateHumanizeFormat(item.created_at).value;
            return item.is_read === 0;
        });
        setDataList(dataList);
        setData(groupBy(dataList, 'type'));
    };

    useEffect(() => {
        getMessageList();
    }, []);
    useEffect(() => {
        getCount(count);
    }, [count]);

    return (
        <Popover
            placement="topLeft"
            trigger="click"
            content={
                <div className={styles['message-box']}>
                    <Tabs centered defaultActiveKey="mention" onChange={handleTabClick}>
                        <TabPane
                            tab={
                                <Badge
                                    color="#1890ff"
                                    size="small"
                                    count={data.mention && data.mention.length}
                                    offset={[4, 0]}
                                >
                                    @我
                                </Badge>
                            }
                            key="mention"
                        >
                            <div className={styles['wrap-pane']}>
                                <Choose>
                                    <When condition={data.mention && data.mention.length}>
                                        <InformList data={data.mention || []} />
                                    </When>
                                    <Otherwise>
                                        <div className={styles['no-message-tip']}>
                                            <IconFont style={{ fontSize: '60px' }} type="xiaoxi1" />
                                            你已查看所有@我
                                        </div>
                                    </Otherwise>
                                </Choose>
                            </div>
                        </TabPane>
                        <TabPane
                            tab={
                                <Badge
                                    color="#1890ff"
                                    size="small"
                                    count={data.inform && data.inform.length}
                                    offset={[4, 0]}
                                >
                                    通知
                                </Badge>
                            }
                            key="inform"
                        >
                            <div className={styles['wrap-pane']}>
                                <Choose>
                                    <When condition={data.inform && data.inform.length}>
                                        <InformList data={data.inform || []} />
                                    </When>
                                    <Otherwise>
                                        <div className={styles['no-message-tip']}>
                                            <IconFont style={{ fontSize: '60px' }} type="tongzhi" />
                                            你已查看所有通知
                                        </div>
                                    </Otherwise>
                                </Choose>
                            </div>
                        </TabPane>
                        <TabPane
                            tab={
                                <Badge
                                    color="#1890ff"
                                    size="small"
                                    count={data.personal && data.personal.length}
                                    offset={[4, 0]}
                                >
                                    私信
                                </Badge>
                            }
                            key="personal"
                        >
                            <div className={styles['wrap-pane']}>
                                <Choose>
                                    <When condition={data.personal && data.personal.length}>
                                        <InformList data={data.personal || []} />
                                    </When>
                                    <Otherwise>
                                        <div className={styles['no-message-tip']}>
                                            <IconFont
                                                style={{ fontSize: '60px' }}
                                                type="envelope-open"
                                            />
                                            你已查看所有私信
                                        </div>
                                    </Otherwise>
                                </Choose>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            }
            trigger="hover"
        >
            {children}
        </Popover>
    );
};

export default MessageBox;
