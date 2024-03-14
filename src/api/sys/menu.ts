import { ApiServiceEnum, defHttp } from '@/utils/http/axios';
import { getMenuListResultModel, RouteItem } from './model/menuModel';
import { useLocaleStore } from '@/store/modules/locale';
import StringUtils from '@/utils/StringUtils';
import TreeUtils from '@/utils/TreeUtils';

enum Api {
  GetMenuList = '/sys/user/listUserMenu',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = async () => {
  const locales = useLocaleStore().localInfo.availableLocales;
  const menuList: Array<getMenuListResultModel> = await defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.GetMenuList,
    data: locales,
  });
  const routeMenuList: RouteItem[] = menuList.map((item) => {
    const {
      url,
      functionName,
      locales,
      icon,
      functionId,
      parentId,
      component,
      componentName,
      redirect,
      cached,
      isMenu,
    } = item;
    // 兼容icon
    let compatibleIcon = icon;
    if (compatibleIcon && compatibleIcon.indexOf(':') === -1) {
      compatibleIcon = StringUtils.humpToLine(compatibleIcon);
      compatibleIcon = 'ant-design:' + compatibleIcon;
    }
    const routeItem: RouteItem = {
      path: url || '',
      name: componentName || functionName,
      component,
      meta: {
        hideMenu: isMenu === false,
        title: functionName,
        locales,
        icon: compatibleIcon,
        key: functionId,
        parentKey: parentId,
        queryToProps: true,
      },
    };
    if (redirect) {
      routeItem.redirect = redirect;
    }
    if (cached === false) {
      routeItem.meta.ignoreKeepAlive = true;
    }
    return routeItem;
  });
  // 构建树
  return TreeUtils.convertList2Tree(
    routeMenuList,
    (data) => data.meta.key,
    (data) => data.meta.parentKey,
    0,
  );
};
