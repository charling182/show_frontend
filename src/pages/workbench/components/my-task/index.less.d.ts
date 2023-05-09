export type Styles = {
    'my-task': string;
    head: string;
    title: string;
    'wrap-nav': string;
    'wrap-task-list': string;
    'task-item': string;
    'task-name': string;
    'project-name': string;
    'wrap-pagination': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
