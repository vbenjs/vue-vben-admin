import { eventHandler, readBody } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { TIME_ZONE_OPTIONS } from '~/utils/mock-data';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';
import { setTimezone } from '~/utils/timezone-utils';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }
  const body = await readBody<{ timezone?: unknown }>(event);
  const timezone =
    typeof body?.timezone === 'string' ? body.timezone : undefined;
  const allowed = TIME_ZONE_OPTIONS.some((o) => o.timezone === timezone);
  if (!timezone || !allowed) {
    setResponseStatus(event, 400);
    return useResponseError('Bad Request', 'Invalid timezone');
  }
  setTimezone(timezone);
  return useResponseSuccess({});
});
