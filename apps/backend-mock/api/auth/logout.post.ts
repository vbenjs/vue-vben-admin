import { clearRefreshTokenCookie } from '~/utils/jwt_utils';

export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, 'jwt');
  if (!refreshToken) {
    return setResponseStatus(event, 204);
  }

  clearRefreshTokenCookie(event);

  return setResponseStatus(event, 204);
});
