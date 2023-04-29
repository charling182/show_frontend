export type Styles = {
  'charling-icon-font': string;
  xl: string;
  lg: string;
  md: string;
  sm: string;
  xs: string;
  skeleton: string;
  'media-block': string;
  'round-shape': string;
  'charling-pro-top-nav-header-main': string;
  'charling-pro-top-nav-header-logo': string;
  'charling-layout-content': string;
  'charling-pro-top-nav-header': string;
  anticon: string;
  root: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
