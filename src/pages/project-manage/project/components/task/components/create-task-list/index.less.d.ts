export type Styles = {
    'create-task-list-wrap-form': string;
    title: string;
    'color-light': string;
    'create-task-list': string;
    disabled: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
