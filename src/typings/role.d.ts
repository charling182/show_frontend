export namespace role {
    // 请求角色列表参数
    interface roleListParams {
        keyword?: string;
        limit: number;
        offset: number;
        name?: string;
        prop_order?: string;
        order?: string;
    }
}
