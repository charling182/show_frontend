import React, { useState, useEffect } from 'react';
import { Button, Image, Pagination, Progress, message } from 'antd';
// import { getList, permissions as projectPermissions } from '@/api/projectManagement';
import { dateHumanizeFormat } from '@/utils';
import EmptyImage from '@/components/empty-image';
import { getProjectList } from '@/api';
import { history } from 'umi';

import styles from './index.less';

const MyProject = ({ onGetProjectCount }) => {
    const [loading, setLoading] = useState(false);
    const [projectList, setProjectList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(12);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        async function fetchList() {
            setLoading(true);
            const {
                data: { rows, count },
            } = await getProjectList({
                is_recycle: 0,
                is_archived: 0,
            });
            setTotal(count);
            onGetProjectCount(count);
            setProjectList(
                rows.map((item) => {
                    item.created_at = new Date(item.created_at).toLocaleString();
                    item.created_at_humanize = dateHumanizeFormat(item.created_at).value;
                    return item;
                })
            );
            setLoading(false);
        }
        fetchList();
    }, []);

    const goToProjectList = () => {
        history.push('/project-manage/list');
    };
    const goToProject = (project) => {
        history.push(`/project-manage/project/${project.id}`);
    };

    const handleCurrentChange = (val) => {
        setCurrentPage(val);
    };

    const projectListShow = projectList
        .sort((a, b) => b.collector - a.collector)
        .sort((a, b) => a.is_private - b.is_private)
        .filter((item, index) => {
            return index >= pageSize * (currentPage - 1) && index < pageSize * currentPage;
        });

    return (
        <div className={styles['my-project']}>
            <div className={styles['head']}>
                <div className={styles['title']}>进行中的项目</div>
                <Button type="link" onClick={goToProjectList}>
                    全部项目
                </Button>
            </div>
            <div className={styles['list-project']}>
                {projectListShow.map((item) => (
                    <div
                        key={item.id}
                        className={styles['item-project']}
                        onClick={() => goToProject(item)}
                    >
                        {item.is_private === 0 && <div className={styles['public-tip']}>公开</div>}
                        <div className={styles['wrap-cover']}>
                            <img src={item.cover} className={styles['cover']} />
                        </div>
                        <div className={`${styles['name']}}`}>{item.name}</div>
                        <div className={styles['intro']}>{item.intro || '暂无介绍'}</div>
                        <Progress percent={item.progress} showInfo={false} strokeWidth={2} />
                        <div className={styles['foot']}>
                            <div className={styles['username']}>
                                {item?.creator && item?.creator.username}
                            </div>
                            <div className={styles['created_at']}>{item.created_at_humanize}</div>
                        </div>
                    </div>
                ))}
                {!projectListShow.length && !loading && (
                    <EmptyImage height={750} heightImg={230} text="空空如也~~" />
                )}
            </div>
            <div className={styles['wrap-pagination']}>
                {total > pageSize && (
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={total}
                        onChange={handleCurrentChange}
                    />
                )}
            </div>
        </div>
    );
};

export default MyProject;
