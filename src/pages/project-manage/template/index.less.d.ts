export type Styles = {
    'project-template': string;
    'create-template': string;
    list: string;
    'item-list': string;
    'item-img': string;
    'item-info': string;
    'item-tasks': string;
    task: string;
    'item-control': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
