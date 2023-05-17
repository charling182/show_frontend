export type Styles = {
    'list-group-item': string;
    state: string;
    'wrap-done': string;
    iconfont: string;
    content: string;
    name: string;
    info: string;
    'info-item': string;
    'task-date': string;
    'task-date-overdue': string;
    'task-date-intraday': string;
    'task-date-recently': string;
    'task-date-safety': string;
    executor: string;
    'task-priority': string;
    'task-state-success': string;
    'list-group-item-done': string;
    'color-light': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
