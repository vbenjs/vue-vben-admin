import { eventHandler, readBody } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { MOCK_MENU_LIST } from '~/utils/mock-data';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const body = await readBody(event);

  // 模拟将新菜单加入列表中以供本地预览显示
  const newMenuId = Math.floor(Math.random() * 10_000) + 1000;
  const newMenu = {
    ...body,
    id: newMenuId,
    menuId: newMenuId,
  };

  MOCK_MENU_LIST.push(newMenu);

  return useResponseSuccess(newMenu);
});
