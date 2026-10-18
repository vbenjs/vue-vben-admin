import { eventHandler, getQuery } from 'h3';
import { getEnabledDictData } from '~/utils/dict-utils';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const { code } = getQuery(event);
  if (!code) {
    return useResponseSuccess([]);
  }

  return useResponseSuccess(getEnabledDictData(String(code)));
});
