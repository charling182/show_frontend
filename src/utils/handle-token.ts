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
