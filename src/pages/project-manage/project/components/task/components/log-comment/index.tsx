import React, { useState } from 'react';
import styles from './index.less';
import { If } from 'tsx-control-statements/components';

const LogComment = ({ log = {} }) => {
    const [showMore, setShowMore] = useState(false);

    const commentClick = () => {
        setShowMore(!showMore);
    };

    return (
        <div className={styles['log-comment']}>
            <If condition={log?.content && showMore}>
                <div
                    className={`${styles['content']} ${
                        log.is_comment === 1 ? styles['content-comment'] : ''
                    }`}
                    dangerouslySetInnerHTML={{ __html: log.content }}
                    onClick={commentClick}
                ></div>
            </If>
            <If condition={log.content && !showMore}>
                <div
                    className={`${styles['content']} ${
                        log.is_comment === 1 ? styles['content-comment'] : ''
                    } ${!showMore && log.is_comment !== 1 ? styles['ellipsis-content'] : ''}`}
                    dangerouslySetInnerHTML={{ __html: log.content }}
                    onClick={commentClick}
                ></div>
            </If>
        </div>
    );
};

export default LogComment;
