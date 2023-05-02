import { request } from 'umi';
import { encryptedData } from '@/utils/encrypt';

/**
 * 获取公钥
 */
export async function getPublicKey() {
  return request('/configuration/public_key', {
    method: 'get',
  });
}
/**
 * 登录接口
 */
export async function login(data: types.user.loginData) {
  let password = await encryptedData(data.password);
  return request('/user/login', {
    method: 'post',
    data: {
      ...data,
      password,
    },
  });
}
/**
 * 登出接口
 */
export async function getLogout() {
  return request('/user/logout', {
    method: 'get',
  });
}
/**
 * 获取用户信息
 */
export async function getUserInfo() {
  return request('/user/user_info', {
    method: 'get',
  });
}
/**
 *
 * 发送验证码
 */
export async function sendVerificationCode(data: { target: string }) {
  return request('/verification_code', {
    method: 'post',
    data,
  });
}
/**
 * 注册接口
 */
export async function postRegister(data: types.user.registerData) {
  let password = await encryptedData(data.password);
  let confirm_password = await encryptedData(data.confirm_password);
  return request('/user/register', {
    method: 'post',
    data: {
      ...data,
      password,
      confirm_password,
    },
  });
}
/**
 * 修改密码接口
 */
export async function putChangePassword(data: types.user.changePasswordData) {
  let password = await encryptedData(data.password);
  let confirm_password = await encryptedData(data.confirm_password);
  return request('/user/password', {
    method: 'put',
    data: {
      ...data,
      password,
      confirm_password,
    },
  });
}
/**
 * 修改用户信息接口
 */
export async function putChangeUserData(data: types.user.changeUserData) {
  return request('/user', {
    method: 'put',
    data,
  });
}
/**
 * 获取用户列表
 */
export async function getUserList(params: types.user.userListParams) {
  return request('/user/list', {
    method: 'get',
    params,
  });
}
