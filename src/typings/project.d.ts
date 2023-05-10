export namespace project {
    interface getProjectParams {
        limit?: number;
        offset?: number;
        pageSize?: number;
        pageNo?: number;
        is_recycle?: 1 | 0; // 是否进入回收站.1为true,0为false
        is_archived?: 1 | 0; // 是否已归档.1为true,0为false
        collection?: 1 | 0; // 项目收藏状态.1为true,0为false
    }
}
