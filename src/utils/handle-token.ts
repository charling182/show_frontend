export const setJwtToLocalstorage = (token: { accessToken: string; userId: number }) => {
    const data = JSON.stringify({
        accessToken: 'Bearer ' + token.accessToken,
        userId: token.userId,
    });
    localStorage.setItem('Authorization', data);
};

export const getJwtFromLocalstorage = () => {
    return localStorage.getItem('Authorization');
};

export const removeJwtFromLocalstorage = () => {
    localStorage.removeItem('Authorization');
};
/**
 * 确认设置websocket
 */
export const setSocketToLocalstorage = () => {
    localStorage.setItem('socket', 'true');
};
/**
 * 获取websocket的设置情况
 */
export const getSocketFromLocalstorage = () => {
    return localStorage.getItem('socket');
};
/**
 * 移除websocket的设置情况
 */
export const removeSocketFromLocalstorage = () => {
    localStorage.removeItem('socket');
};
