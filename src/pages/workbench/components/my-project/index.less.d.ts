export type Styles = {
    'my-project': string;
    head: string;
    title: string;
    'list-project': string;
    'item-project': string;
    'public-tip': string;
    'wrap-cover': string;
    cover: string;
    name: string;
    foot: string;
    'wrap-pagination': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
