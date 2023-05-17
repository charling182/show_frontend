export type Styles = {
    'wrap-item-menu': string;
    'task-dialog': string;
    'on-normal': string;
    'on-recycle': string;
    tip: string;
    'el-dropdown-link-type': string;
    'wrap-task': string;
    'wrap-name': string;
    'wrap-name-done': string;
    'wrap-item': string;
    iconfont: string;
    label: string;
    content: string;
    'wrap-date': string;
    'el-icon-minus': string;
    'wrap-remark': string;
    'btn-remark': string;
    'wrap-remark-html': string;
    btn: string;
    'wrap-rich-text': string;
    'wrap-btn-remark': string;
    'wrap-tag': string;
    'btn-add-tag': string;
    'el-icon-circle-plus': string;
    'wrap-dynamic': string;
    'close-icon': string;
    'menu-item': string;
    'menu-item-title': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
