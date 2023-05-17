export type Styles = {
    'project-template-task': string;
    'create-template': string;
    list: string;
    'item-list': string;
    'item-info': string;
    'item-tasks': string;
    'item-control': string;
    intro: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
