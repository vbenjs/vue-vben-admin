import {
  clearRefreshTokenCookie,
  getRefreshTokenFromCookie,
} from '~/utils/cookie_utils';

export default defineEventHandler(async (event) => {
  const refreshToken = getRefreshTokenFromCookie(event);
  if (!refreshToken) {
    return setResponseStatus(event, 204);
  }

  clearRefreshTokenCookie(event);

  return setResponseStatus(event, 204);
});
