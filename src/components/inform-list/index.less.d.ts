export type Styles = {
    'list-inform': string;
    item: string;
    main: string;
    username: string;
    content: string;
    created_at: string;
    controller: string;
    btn: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
