// import { message } from 'udesk-ui';
// import { handleError } from '../utils';
// import { IHttpPromise } from './type';
// import { request } from 'umi';
// import { encryptedData } from '@/utils/encrypt';
export * from './user';
export * from './department';
export * from './role';
export * from './menu';
export * from './permission';
export * from './project';
export * from './upload';
export * from './invite';
export * from './message';
export * from './tasks';
export * from './operation';

// /**
//  * 后端接口地址的前缀。
//  * 一般用来拼接后端接口的url地址，但如果使用`request`调用后端接口的话，已经自动配置前缀，用不到这个值
//  */
export const backendBase = `${window.location.origin}/backend`;

// export const apiBase = `${window.location.origin}/api`;

// export const agentApiBase = `${window.location.origin}/agent/api`;

// export const mBase = `${window.location.origin}/m`;
// export const pcBase = `${window.location.origin}/wfsite`;

// export const base = window.location.origin;

// export const noSecondBase = `${window.location.origin.replace(/(^https?:\/\/\w+)\./, '.')}/backend`;

// const wechatImageBase = '/wechat_image';

// // 微信域名`https://mp.weixin.qq.com/`下图片资源转发路径：
// export const wechatImageBasePC = mBase + wechatImageBase;

// /** 营销活动链接 */
// export const ActivityLinkURI = `${backendBase}/luckdrawInfo/openLuckdraw/`;

// /** 群打卡活动链接 */
// export const GroupClockInActivityLinkURI = `${backendBase}/groupClockIn/link?clockInId=`;

// /**
//  * 伊利促销海报嵌入链接
//  */
// export const promotionaPostUrl =
//     window.location.origin.indexOf('-test') === -1
//         ? 'https://cxp.yili.com/spassit/#/create'
//         : 'https://cxp-test.yili.com/poster/#/create';

// /** 模拟请求-开发用 */
// export const asyncRequest = (...arg: any[]): Promise<any> => {
//     console.log('[asyncRequest]:', arg);
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve({
//                 succeed: true,
//             });
//         }, 2000);
//     });
// };

// /** 执行一个请求并返回是否成功 */
// export const exec = async <T extends Array<any>>({
//     params,
//     request,
//     successInfo,
// }: {
//     params: T;
//     request: (...args: T) => IHttpPromise;
//     successInfo?: string;
// }) => {
//     let flag: boolean = true;
//     try {
//         const res = await request(...params);
//         flag = res.succeed;
//         if (flag) {
//             successInfo && message.success(successInfo);
//         } else {
//             throw res;
//         }
//     } catch (e: any) {
//         handleError(e);
//     } finally {
//         return flag;
//     }
// };

// /** 微信公众号二维码链接 */
// export const WechatPublicQrcodeUrl = wechatImageBasePC + '/cgi-bin/showqrcode?ticket=';
