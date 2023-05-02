export type Styles = {
  'personal-center': string;
  'base-setting': string;
  'wrap-form': string;
  'wrap-photo': string;
  'wrap-photo-plus': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
