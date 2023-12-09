import React, { useState, useEffect, useCallback } from 'react';
import { Popover, Tabs, Badge } from 'antd';
import InformList from '@/components/inform-list';
import { IconFont } from '@/components/iconfont';
import { Choose, When, Otherwise } from 'tsx-control-statements/components';
import styles from './index.less';

const { TabPane } = Tabs;

const MessageBox = ({ children, messageData }: any) => {
    return (
        <Popover
            placement="topLeft"
            trigger="click"
            content={
                <div className={styles['message-box']}>
                    <Tabs centered defaultActiveKey="mention">
                        <TabPane
                            tab={
                                <Badge
                                    color="#1890ff"
                                    size="small"
                                    count={messageData.mention && messageData.mention.length}
                                    offset={[4, 0]}
                                >
                                    @我
                                </Badge>
                            }
                            key="mention"
                        >
                            <div className={styles['wrap-pane']}>
                                <Choose>
                                    <When
                                        condition={
                                            messageData.mention && messageData.mention.length
                                        }
                                    >
                                        <InformList data={messageData.mention || []} />
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
                                    count={messageData.inform && messageData.inform.length}
                                    offset={[4, 0]}
                                >
                                    通知
                                </Badge>
                            }
                            key="inform"
                        >
                            <div className={styles['wrap-pane']}>
                                <Choose>
                                    <When
                                        condition={messageData.inform && messageData.inform.length}
                                    >
                                        <InformList data={messageData.inform || []} />
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
                                    count={messageData.personal && messageData.personal.length}
                                    offset={[4, 0]}
                                >
                                    私信
                                </Badge>
                            }
                            key="personal"
                        >
                            <div className={styles['wrap-pane']}>
                                <Choose>
                                    <When
                                        condition={
                                            messageData.personal && messageData.personal.length
                                        }
                                    >
                                        <InformList data={messageData.personal || []} />
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
