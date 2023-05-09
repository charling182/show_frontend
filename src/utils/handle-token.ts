export const setJwtToLocalstorage = (token: string) => {
    localStorage.setItem('Authorization', 'Bearer ' + token);
};

export const getJwtFromLocalstorage = () => {
    return localStorage.getItem('Authorization');
};

export const removeJwtFromLocalstorage = () => {
    localStorage.removeItem('Authorization');
};
