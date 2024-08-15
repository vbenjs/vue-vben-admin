import { verifyAccessToken } from '~/utils/jwt_utils';

export default eventHandler((event) => {
  const token = getHeader(event, 'Authorization');
  if (!token) {
    setResponseStatus(event, 401);
    return useResponseError('UnauthorizedException', 'Unauthorized Exception');
  }

  const userinfo = verifyAccessToken(token);
  if (!userinfo) {
    setResponseStatus(event, 401);
    return useResponseError('UnauthorizedException', 'Unauthorized Exception');
  }

  return useResponseSuccess(userinfo);
});
