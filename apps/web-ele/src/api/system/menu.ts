import { requestClient } from '#/api/request';

export namespace MenuApi {
  /** 菜单树表查询参数 */
  export interface GetMenuTreeTableRequest {
    menuCode?: string;
    menuName?: string;
    menuType?: string;
  }

  /** 菜单树表响应数据 */
  export interface MenuTreeTableResponse {
    menuId: number;
    menuCode: string;
    menuName: string;
    menuType: string;
    routerName?: string;
    routerPath?: string;
    routerQuery?: string;
    componentName?: string;
    componentFileName?: string;
    componentPath?: string;
    icon?: string;
    isShow: string;
    isSystem: string;
    parentMenuCode?: string;
    sort?: number;
    hasChildren: boolean;
    children?: MenuTreeTableResponse[];
    createdTime: string;
    updatedTime: string;
  }

  /** 菜单详情请求 */
  export interface MenuDetailRequest {
    menuId: number;
  }

  /** 菜单详情响应 */
  export interface MenuDetailResponse {
    menuId: number;
    menuCode: string;
    menuName: string;
    menuType: string;
    routerName?: string;
    routerPath?: string;
    routerQuery?: string;
    componentName?: string;
    componentFileName?: string;
    componentPath?: string;
    icon?: string;
    isShow: string;
    isSystem: string;
    parentMenuCode?: string;
    sort?: number;
    createdTime: string;
    updatedTime: string;
    createdBy: number;
    updatedBy: number;
    remark?: string;
  }

  /** 创建菜单请求 */
  export interface CreateMenuRequest {
    menuCode: string;
    menuName: string;
    menuType: string;
    routerName?: string;
    routerPath?: string;
    routerQuery?: string;
    componentName?: string;
    componentFileName?: string;
    componentPath?: string;
    icon?: string;
    isShow: string;
    parentMenuCode?: string;
    sort?: number;
  }

  /** 更新菜单请求 */
  export interface UpdateMenuRequest {
    menuId: number;
    menuName: string;
    menuType: string;
    routerName?: string;
    routerPath?: string;
    routerQuery?: string;
    componentName?: string;
    componentFileName?: string;
    componentPath?: string;
    icon?: string;
    isShow: string;
    parentMenuCode?: string;
    sort?: number;
  }

  /** 删除菜单请求 */
  export interface DeleteMenuRequest {
    menuId: number;
  }

  /** 获取子菜单请求 */
  export interface GetMenuChildrenRequest {
    parentMenuCode: string;
    menuType?: string;
    status?: string;
  }

  /** 分页结果 */
  export interface PageResult<T> {
    list: T[];
    total: number;
    pageNum: number;
    pageSize: number;
  }

  /** 通用响应 */
  export interface CommonResult<T = any> {
    code: string;
    message: string;
    data?: T;
  }
}

/**
 * 获取菜单树表数据
 */
export async function getMenuTreeTableApi(
  data: MenuApi.GetMenuTreeTableRequest,
) {
  return requestClient.get<MenuApi.MenuTreeTableResponse[]>(
    '/auth/menu/tree-table',
    { params: data },
  );
}

/**
 * 获取菜单详情
 */
export async function getMenuDetailApi(data: MenuApi.MenuDetailRequest) {
  return requestClient.get<MenuApi.MenuDetailResponse>('/auth/menu/detail', {
    params: data,
  });
}

/**
 * 创建菜单
 */
export async function createMenuApi(data: MenuApi.CreateMenuRequest) {
  return requestClient.post<MenuApi.CommonResult>('/auth/menu/create', data);
}

/**
 * 更新菜单
 */
export async function updateMenuApi(data: MenuApi.UpdateMenuRequest) {
  return requestClient.put<MenuApi.CommonResult>('/auth/menu/update', data);
}

/**
 * 删除菜单
 */
export async function deleteMenuApi(data: MenuApi.DeleteMenuRequest) {
  return requestClient.delete<MenuApi.CommonResult>('/auth/menu/delete', {
    data,
  });
}

/**
 * 获取子菜单列表
 */
export async function getMenuChildrenApi(data: MenuApi.GetMenuChildrenRequest) {
  return requestClient.post<MenuApi.MenuTreeTableResponse[]>(
    '/auth/menu/children',
    data,
  );
}
