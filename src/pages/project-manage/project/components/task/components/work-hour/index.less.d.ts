export type Styles = {
    'working-hour': string;
    label: string;
    title: string;
    iconfont: string;
    'el-icon-edit-outline': string;
    content: string;
    'btn-add-working-hour': string;
    'el-icon-plus': string;
    'wrap-working-hour-list': string;
    item: string;
    'wrap-working-hour-content': string;
    'wrap-info': string;
    name: string;
    'start-date': string;
    description: string;
    ctrl: string;
    icon: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
