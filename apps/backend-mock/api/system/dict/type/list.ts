import { eventHandler, getQuery } from 'h3';
import { getDictTypes } from '~/utils/dict-utils';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess } from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const { page = 1, pageSize = 20, name, code, status } = getQuery(event);

  let listData = structuredClone(getDictTypes());
  if (name) {
    listData = listData.filter((item) =>
      item.name.toLowerCase().includes(String(name).toLowerCase()),
    );
  }
  if (code) {
    listData = listData.filter((item) =>
      item.code.toLowerCase().includes(String(code).toLowerCase()),
    );
  }
  if (['0', '1'].includes(status as string)) {
    listData = listData.filter((item) => item.status === Number(status));
  }

  return usePageResponseSuccess(page as string, pageSize as string, listData);
});
