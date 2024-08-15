import { verifyAccessToken } from '~/utils/jwt_utils';

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    setResponseStatus(event, 401);
    return useResponseError('UnauthorizedException', 'Unauthorized Exception');
  }

  const menus =
    MOCK_MENUS.find((item) => item.username === userinfo.username)?.menus ?? [];
  return useResponseSuccess(menus);
});
