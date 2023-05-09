export type Styles = {
    'wrap-content': string;
    'user-list': string;
    'wrap-list-item': string;
    'user-avatar': string;
    'user-info': string;
    foot: string;
    'user-emial': string;
    'wrap-ctrl': string;
    line: string;
    'wrap-pagination': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
