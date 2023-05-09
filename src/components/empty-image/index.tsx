import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import dayjs from 'dayjs';
// import {
//   doDelete as doDeleteTask,
//   doEdit as doEditTask,
// } from '@/api/taskManagement';
import multiDownload from 'multi-download';
import emptyImage from '~/public/static/img/empty.png';
// import { request } from 'umi';
import request from 'umi-request';

import styles from './index.less';

const EmptyImage = (props) => {
    const { height = 339, heightImg = 339, text = '空空如也...' } = props;

    const [randomImgPath, setRandomImgPath] = useState('');

    // useEffect(() => {
    //   getRandomImgPath().then((path) => setRandomImgPath(path));
    // }, []);

    const dateFormat = (date, template) => {
        return dayjs(date).format(template);
    };

    const recoverTask = async (task) => {
        try {
            Modal.confirm({
                title: '确定恢复内容？',
                content: '恢复后可在任务列表中查看',
                okText: '确定',
                cancelText: '取消',
                okType: 'danger',
                onOk: async () => {
                    // await doDeleteTask({ ids: [task.id] });
                },
                onCancel: () => {
                    console.log('取消删除');
                },
            });
        } catch (e) {
            console.error(e);
        }
    };

    const deleteTask = async (task) => {
        try {
            Modal.confirm({
                title: '确定彻底删除任务？',
                content: '彻底删除任务后，该任务将会被永久删除。',
                okText: '确定',
                cancelText: '取消',
                okType: 'danger',
                onOk: async () => {
                    // await doDeleteTask({ ids: [task.id] });
                },
                onCancel: () => {
                    console.log('取消删除');
                },
            });
        } catch (e) {
            console.error(e);
        }
    };

    const multiDownload = (item) => {
        multiDownload([item.path], {
            rename: () => `${item.title}${item.extension}`,
        });
    };

    const doCopy = (text) => {
        const input = document.createElement('input');
        const div = document.createElement('div');
        input.setAttribute('readonly', 'readonly');
        input.setAttribute('value', text);
        input.setAttribute('style', 'position: absolute;left: 100000px;');
        div.setAttribute('style', 'position: absolute;width: 0px;height: 0px;overflow: hidden;');
        div.appendChild(input);
        document.body.appendChild(div);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(div);
    };
    // https://picsum.photos”是一个提供随机图片的网站。
    // 您可以通过向该网站发送HTTP请求来获取不同尺寸和分辨率的随机图片

    const getRandomPicsumPicturePath = async (path = 'https://picsum.photos/100') => {
        const response = await request(path, { responseType: 'blob' });
        // const response = await request(path, { responseType: 'arraybuffer' });
        const blob = new Blob([response.data], {
            type: response.headers['content-type'],
        });
        return URL.createObjectURL(blob);
    };

    const getRandomImgPath = async (path = 'https://picsum.photos/290/160') => {
        let data = localStorage.getItem(path);
        getRandomPicsumPicturePath(path).then((data) => {
            localStorage.setItem(path, data);
        });
        if (data) {
            return data;
        }
        return await getRandomPicsumPicturePath(path);
    };

    return (
        <div className={styles['empty-image']} style={{ height: `${height}px` }}>
            <img
                className={styles['empty']}
                src={randomImgPath || emptyImage}
                height={heightImg}
                alt=""
            />
            {text && <div className={styles['text']}>{text}</div>}
        </div>
    );
};

export default EmptyImage;
