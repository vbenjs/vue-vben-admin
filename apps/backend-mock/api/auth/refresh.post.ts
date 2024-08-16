import {
  clearRefreshTokenCookie,
  getRefreshTokenFromCookie,
  setRefreshTokenCookie,
} from '~/utils/cookie_utils';
import { verifyRefreshToken } from '~/utils/jwt_utils';

export default defineEventHandler(async (event) => {
  const refreshToken = getRefreshTokenFromCookie(event);
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

  const findUser = MOCK_USERS.find(
    (item) => item.username === userinfo.username,
  );
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
