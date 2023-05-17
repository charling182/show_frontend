export type Styles = {
    'log-comment': string;
    content: string;
    'ellipsis-content': string;
    'content-comment': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
