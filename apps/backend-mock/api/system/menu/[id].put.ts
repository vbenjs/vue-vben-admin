import { eventHandler, getRouterParam, readBody } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { MOCK_MENU_LIST } from '~/utils/mock-data';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  const numericId = Number(id);

  const index = MOCK_MENU_LIST.findIndex(
    (item) => item.id === numericId || item.menuId === numericId,
  );
  if (index !== -1) {
    MOCK_MENU_LIST[index] = { ...MOCK_MENU_LIST[index], ...body };
  }

  return useResponseSuccess(MOCK_MENU_LIST[index]);
});
