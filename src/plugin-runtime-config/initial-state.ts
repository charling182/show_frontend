// import { PATHS_WITHOUT_LOGIN } from '~/config/_vars';
// import { request as umiRequest, history } from 'umi';
// import { getMobileEncryptionConfig } from '@/api/mobileEncryption';

// export async function getInitialState() {
//     const WF_INIT_PATH = '/init';
//     // 可以有自己的 getInitialState
//     // 无需经过PC端登录就可以访问的页面路径配置到PATHS_WITHOUT_LOGIN数组中,多层级页面,配置一级路由即可,可防止调用init接口
//     const slices = history.location.pathname
//         .split('/')
//         .filter((str) => str)
//         .reduce((ac: string[], str: string) => {
//             ac.push((ac[ac.length - 1] || '') + '/' + str);
//             return ac;
//         }, [] as string[]);

//     const isWithoutLoginPage = PATHS_WITHOUT_LOGIN.some((i: any) => slices.includes(i));
//     if (isWithoutLoginPage) {
//         return undefined;
//     } else {
//         let initData = await umiRequest<types.InitData & { data: any }>(WF_INIT_PATH);
//         // 保存企微对接开关状态
//         sessionStorage.setItem('WECOME_SWITCH', initData.data.wecomSwitch);
//         let mobileConfig = await getMobileEncryptionConfig();
//         Object.assign(initData, initData.data);
//         delete initData.data;
//         initData.name = initData.user.name;
//         initData.mobileConfig = mobileConfig.data || 'all';
//         initData.avatar = initData.user.avatar;
//         return initData;
//     }
// }
export async function getInitialState() {
  return {
    name: 'test',
    avatar:
      'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    userid: '00000001',
    email: '',
  };
}
