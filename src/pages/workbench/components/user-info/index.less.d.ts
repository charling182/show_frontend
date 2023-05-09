export type Styles = {
    'user-info': string;
    'wrap-user': string;
    'user-avatar': string;
    info: string;
    tip: string;
    'wrap-project': string;
    count: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
