import React, { useState, useEffect } from 'react';
import { Table, Pagination, Button, Input, Form, message } from 'antd';
import styles from './index.less';
import { getMessageList, updateMessage } from '@/api';
import { useModel } from 'umi';
import BImage from '@/components/b-image';
import { history } from 'umi';

interface IProps {
    type: 'mention' | 'inform' | 'personal';
}

const Message = ({ type = 'mention' }: IProps) => {
    const { initialState } = useModel('@@initialState');
    const userInfo: any = initialState || {};
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    const [total, setTotal] = useState(0);
    const [keyword, setKeyword] = useState('');
    // 自增刷新
    const [refresh, setRefresh] = useState<number>(0);
    // 请求参数
    const [requestParams, setRequestParams] = useState({
        receiver_id: userInfo.id,
        prop_order: 'id',
        order: 'desc',
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize,
        type,
        keyword: '',
    });

    const fetchData = async () => {
        setLoading(true);
        const {
            data: { rows, count },
        } = await getMessageList(requestParams);
        setTotal(count);
        setList(rows);
        setLoading(false);
    };

    const handleTableChange = (current: number) => {
        setPagination({ ...pagination, current });
        setRequestParams({
            ...requestParams,
            offset: (current - 1) * pagination.pageSize,
        });
    };

    const onKeywordChange = (e) => {
        setKeyword(e.target.value);
        if (!e.target.value) {
            setRequestParams({
                ...requestParams,
                keyword: '',
            });
        }
    };

    const onSearch = (value: string) => {
        setKeyword(value);
        setRequestParams({
            ...requestParams,
            keyword: value,
        });
    };

    const doRead = async (record) => {
        const { code } = await updateMessage({
            ...record,
            is_read: 1,
        });
        if (code === 200) {
            message.success('操作成功');
            setRefresh(refresh + 1);
        }
    };

    const columns = [
        {
            title: '内容',
            key: 'content',
            render: (text, record) => (
                <div className={styles['content-column']}>
                    <BImage
                        src={(record.actor && record.actor.avatar) || ''}
                        width={32}
                        height={32}
                        borderRadius={32}
                    ></BImage>
                    <span className={styles['content-username']}>{record?.actor?.username}</span>
                    <span dangerouslySetInnerHTML={{ __html: record.content }}></span>
                </div>
            ),
        },
        {
            title: '时间',
            dataIndex: 'created_at',
            key: 'created_at',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Button type="link" onClick={() => history.push(record.url)}>
                        查看
                    </Button>
                    <Button
                        type="link"
                        disabled={record.is_read === 1}
                        onClick={() => doRead(record)}
                    >
                        {record.is_read === 1 ? '已读' : '标记为已读'}
                    </Button>
                </div>
            ),
        },
    ];

    useEffect(() => {
        fetchData();
    }, [refresh, requestParams]);

    return (
        <div className={styles['message-management-container']}>
            <div className={styles['search-box']}>
                <Input.Search
                    className={styles['search-input']}
                    value={keyword}
                    onChange={onKeywordChange}
                    placeholder="输入搜索内容"
                    allowClear
                    enterButton="搜索"
                    size="middle"
                    onSearch={onSearch}
                />
            </div>
            <Table
                dataSource={list}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={false}
            />
            <div className={styles['pagination']}>
                <Pagination {...pagination} total={total} onChange={handleTableChange} />
            </div>
        </div>
    );
};

export default Message;
