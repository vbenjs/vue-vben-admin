import {
  clearRefreshTokenCookie,
  setRefreshTokenCookie,
  verifyRefreshToken,
} from '~/utils/jwt_utils';

export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, 'jwt');
  if (!refreshToken) {
    setResponseStatus(event, 401);
    return useResponseError('UnauthorizedException', 'Unauthorized Exception');
  }

  clearRefreshTokenCookie(event);

  const storeValue = await useStorage().getItem(refreshToken);
  if (!storeValue) {
    return setResponseStatus(event, 403);
  }

  const userinfo = verifyRefreshToken(refreshToken);
  if (!userinfo) {
    return setResponseStatus(event, 403);
  }

  const findUser = MOCK_USERS.find((item) => item.id === userinfo.id);
  if (!findUser) {
    return setResponseStatus(event, 403);
  }
  const accessToken = generateAccessToken(findUser);

  setRefreshTokenCookie(event, refreshToken);

  return useResponseSuccess({
    ...findUser,
    accessToken,
  });
});
