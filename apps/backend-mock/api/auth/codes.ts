import { verifyAccessToken } from '~/utils/jwt_utils';

export default eventHandler((event) => {
  const token = getHeader(event, 'Authorization');
  if (!token) {
    setResponseStatus(event, 401);
    return useResponseError('UnauthorizedException', 'Unauthorized Exception');
  }

  const { username } = verifyAccessToken(token);
  const codes =
    MOCK_CODES.find((item) => item.username === username)?.codes ?? [];

  return useResponseSuccess(codes);
});
