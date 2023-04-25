type menuListItem = {
  createTime: string;
  deleteFlag: number;
  id: number;
  name: string;
  orders: number;
  parentId: number;
  parentIds: string;
  permission: string;
  permissionCode: string;
  resourceType: string;
};

export default (initialState: any) => {
  let access: Record<string, boolean> = {};
  if (initialState && initialState.statusCodeValue !== 401) {
    const menuListField = 'wfMenuList';
    const permissionField = 'permissionCode';

    initialState[menuListField].forEach((item: menuListItem) => {
      access[item[permissionField]] = true;
    });
    // todo: 可以修改plugin-access的逻辑，就可以不用Proxy了。unaccessible = item.access ? !access[code] : true
    // https://github.com/umijs/plugins/blob/0791a70c8445c027024acf2740c03db59dac22ec/packages/plugin-access/src/utils/runtimeUtil.tsx#L6
    return new Proxy(access, {
      get(target, propertyKey: string) {
        return !!target[propertyKey];
      },
    });
  }
  return access;
};
