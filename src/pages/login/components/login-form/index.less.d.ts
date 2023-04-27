export type Styles = {
  'login-form': string;
  title: string;
  'router-link-box': string;
  'wrap-login-btn': string;
  'github-button': string;
  'btn-special': string;
  'github-btn-text': string;
  iconfont: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
