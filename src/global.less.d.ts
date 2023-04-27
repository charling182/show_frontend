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
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
