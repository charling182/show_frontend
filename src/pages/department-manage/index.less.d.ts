export type Styles = {
  'departmentManagement-container': string;
  'wrap-nav': string;
  'title-box': string;
  'warp-member': string;
  'item-member': string;
  'item-member-icon': string;
  title: string;
  'item-member-active': string;
  'warp-menu': string;
  'wrap-content': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
