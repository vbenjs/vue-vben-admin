import { verifyAccessToken } from '~/utils/jwt_utils';

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    setResponseStatus(event, 401);
    return useResponseError('UnauthorizedException', 'Unauthorized Exception');
  }

  return useResponseSuccess(userinfo);
});
