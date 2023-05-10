export type Styles = {
    'project-list': string;
    'create-project': string;
    list: string;
    'item-list': string;
    'item-img': string;
    'item-info': string;
    name: string;
    'name-text': string;
    intro: string;
    'item-tasks': string;
    task: string;
    'item-manager': string;
    'item-create-date': string;
    'item-progress': string;
    'item-control': string;
    pagination: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
