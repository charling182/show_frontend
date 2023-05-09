export type Styles = {
    'user-content': string;
    'wrap-content-head': string;
    'title-content': string;
    'wrap-ctrl': string;
    'el-button--small': string;
    iconfont: string;
    'wrap-list': string;
    'wrap-list-item': string;
    'user-avatar': string;
    'user-info': string;
    'user-name': string;
    foot: string;
    'user-emial': string;
    'color-light': string;
    line: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
