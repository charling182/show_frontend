export type Styles = {
  'menu-color': string;
  'menu-color-active': string;
  'menu-background': string;
  'menu-background-active': string;
  'tag-background-active': string;
  'button-background': string;
  'pagination-background-active': string;
  'wrap-content-main': string;
  'color-light': string;
  ellipsis: string;
  'disabled-custom': string;
  'wrap-el-table-100width': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
