export namespace department {
  interface createDepartmentParams {
    name: string;
    parent_id: number;
    sort: number;
    owner_id?: number;
  }
  interface updateDepartmentParams {
    id: number;
    name: string;
    parent_id: number;
    sort: number;
    owner_id?: number;
  }
  interface getDepartmentListParams {
    limit?: number;
    offset?: number;
    keyword?: string;
    name?: string;
  }
}
