export type Styles = {
    'wrap-project-task-dropdown': string;
    'wrap-el-dropdown-item': string;
    'input-box': string;
    'project-task-wrap-dropdown-input': string;
    'project-task-wrap-dropdown-item': string;
    info: string;
    name: string;
    'project-task-project-dropdown': string;
    'wrap-link': string;
    'el-icon-arrow-down': string;
    'project-name': string;
    'project-task': string;
    'wrap-nav': string;
    tab: string;
    'item-tab': string;
    active: string;
    'wrap-controller': string;
    'wrap-content': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
