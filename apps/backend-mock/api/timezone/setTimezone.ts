import { eventHandler, readBody } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';
import { setTimezone } from '~/utils/timezone-utils';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }
  const { timezone } = await readBody(event);
  setTimezone(timezone);
  return useResponseSuccess({});
});
