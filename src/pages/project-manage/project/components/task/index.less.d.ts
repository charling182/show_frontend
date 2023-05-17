export type Styles = {
    'task-list': string;
    'wrap-item': string;
    'task-list-info': string;
    name: string;
    'name-point': string;
    more: string;
    'wrap-draggable': string;
    'list-group': string;
    'btn-createTask': string;
    'el-icon-plus': string;
    'menu-item': string;
    'menu-item-title': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
