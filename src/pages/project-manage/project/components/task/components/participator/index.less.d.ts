export type Styles = {
    'popover-content-executor-selector': string;
    'wrap-current-executor': string;
    title: string;
    'current-executor': string;
    'wrap-info': string;
    name: string;
    disabled: string;
    'wrap-footer': string;
    participator: string;
    point: string;
    'user-list': string;
    item: string;
    btn: string;
    'el-icon-circle-plus': string;
    icon: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
