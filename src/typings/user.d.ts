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
    // 修改用户信息表单数据声明
    interface changeUserData {
        id: number;
        nickname?: string;
        phone?: string;
        company?: string;
        city?: string;
        state?: number;
        avatar?: string;
    }
    // 用户列表数据声明
    interface userListParams {
        keyword?: string;
        state?: number;
        department_id?: number;
        limit?: number;
        offset?: number;
        username?: string;
        phone?: string;
        email?: string;
        date_after_created?: string;
        status?: number;
        avatar?: string;
    }
    interface departmentOperationBtns {
        icon: any;
        label: string;
        disabled: boolean;
    }
    // 更新用户
    interface updateUserData {
        id: number;
    }
}
