export namespace user {
  interface loginData {
    username: string;
    password: string;
  }
  // 注册表单数据声明
  interface registerData {
    username: string;
    email: string;
    password: string;
    confirm_password: string;
    code: string;
  }
  // 修改密码表单数据声明
  interface changePasswordData {
    email: string;
    password: string;
    confirm_password: string;
    code: string;
  }
}
