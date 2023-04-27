export type Styles = {
  'header-react-charling': string;
  'wrap-logo': string;
  'logo-img': string;
  'logo-title': string;
  'menu-collapse': string;
  'wrap-nav-ctrl': string;
  'nav-list': string;
  'nav-item': string;
  'nav-item-active': string;
  'wrap-ctrl': string;
  'user': string;
  'user-avatar': string;
  'wrap-message-icon': string;
  'wrap-online-user': string;
  'username': string;
  'username-text': string;
}

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
