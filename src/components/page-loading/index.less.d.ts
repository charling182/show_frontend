export type Styles = {
  'placeholder-container': string;
  'error-container': string;
  'placeholder-delay': string;
}

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
