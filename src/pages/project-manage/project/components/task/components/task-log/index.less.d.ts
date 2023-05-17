export type Styles = {
    'task-log': string;
    'wrap-log': string;
    'wrap-filter': string;
    'dropdown-title': string;
    'log-list': string;
    'btn-more': string;
    'el-icon-more': string;
    item: string;
    info: string;
    'info-header': string;
    'operator-icon': string;
    icon: string;
    'user-avatar': string;
    'username-and-remark': string;
    'username-comment': string;
    'create-date': string;
    'wrap-comment': string;
    input: string;
    'el-textarea__inner': string;
    ctrl: string;
    'btn-emoji': string;
    'color-light': string;
    'mention-user-list': string;
    'user-list': string;
    'user-item': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
