import { eventHandler, getQuery } from 'h3';
import { isDictCodeExists } from '~/utils/dict-utils';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { firstQueryString } from '~/utils/query';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const { code, id } = getQuery(event);
  return useResponseSuccess(
    !!code &&
      isDictCodeExists(
        firstQueryString(code),
        id ? firstQueryString(id) : undefined,
      ),
  );
});
