import React from 'react';
import { Tooltip } from 'antd';
import { GithubFilled } from '@ant-design/icons';
import styles from './index.less';

const GithubPath = () => {
  return (
    <div className={styles['github-path']}>
      <Tooltip title="项目github地址">
        <a
          href="https://github.com/Imfdj/vue-beehive"
          target="_blank"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <GithubFilled style={{ marginRight: '4px', fontSize: '20px' }} />
          Github
        </a>
      </Tooltip>
    </div>
  );
};

export default GithubPath;
