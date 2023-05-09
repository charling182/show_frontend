import React, { useState, useEffect } from 'react';
import { Popover, Tabs, Badge } from 'antd';
import InformList from '@/components/inform-list';
import { IconFont } from '@/components/iconfont';
import { Choose, When, Otherwise } from 'tsx-control-statements/components';
import styles from './index.less';

const { TabPane } = Tabs;

const MessageBox = (props) => {
    const { children } = props;
    const [activeName, setActiveName] = useState('');

    const handleTabClick = (key) => {
        console.log('Tab clicked:', key);
    };

    return (
        <Popover
            placement="topLeft"
            content={
                <div className={styles['message-box']}>
                    <Tabs centered defaultActiveKey="mention" onChange={handleTabClick}>
                        <TabPane
                            tab={
                                <Badge color="#1890ff" size="small" count={8} offset={[4, 0]}>
                                    @我
                                </Badge>
                            }
                            key="mention"
                        >
                            <div className={styles['wrap-pane']}>
                                <Choose>
                                    <When condition={true}>
                                        <InformList data={[]} />
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
                                <Badge color="#1890ff" size="small" count={5} offset={[4, 0]}>
                                    通知
                                </Badge>
                            }
                            key="inform"
                        >
                            <div className={styles['wrap-pane']}>
                                <Choose>
                                    <When condition={true}>
                                        <InformList data={[]} />
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
                                <Badge color="#1890ff" size="small" count={3} offset={[4, 0]}>
                                    私信
                                </Badge>
                            }
                            key="personal"
                        >
                            <div className={styles['wrap-pane']}>
                                <Choose>
                                    <When condition={true}>
                                        <InformList data={[]} />
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
