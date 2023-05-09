export type Styles = {
    'menu-management': string;
    header: string;
    pagination: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
