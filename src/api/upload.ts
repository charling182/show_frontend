import { request } from 'umi';

/**
 * 上传文件
 */
export async function uploadFile(data: any) {
    return request('/uploads', {
        method: 'POST',
        data,
        // headers: {
        //   'Content-Type': 'multipart/form-data'
        // },
        requestType: 'form',
    });
}
