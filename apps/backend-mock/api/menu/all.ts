import { verifyAccessToken } from '~/utils/jwt_utils';

export default eventHandler((event) => {
  const token = getHeader(event, 'Authorization');

  if (!token) {
    setResponseStatus(event, 401);
    return useResponseError('UnauthorizedException', 'Unauthorized Exception');
  }

  const { username } = verifyAccessToken(token);

  const menus =
    MOCK_MENUS.find((item) => item.username === username)?.menus ?? [];
  return useResponseSuccess(menus);
});
