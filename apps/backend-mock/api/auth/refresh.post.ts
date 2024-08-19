import {
  clearRefreshTokenCookie,
  getRefreshTokenFromCookie,
  setRefreshTokenCookie,
} from '~/utils/cookie_utils';
import { verifyRefreshToken } from '~/utils/jwt_utils';
import { forbiddenResponse } from '~/utils/response';

export default defineEventHandler(async (event) => {
  const refreshToken = getRefreshTokenFromCookie(event);
  if (!refreshToken) {
    return forbiddenResponse(event);
  }

  clearRefreshTokenCookie(event);

  const userinfo = verifyRefreshToken(refreshToken);
  if (!userinfo) {
    return forbiddenResponse(event);
  }

  const findUser = MOCK_USERS.find(
    (item) => item.username === userinfo.username,
  );
  if (!findUser) {
    return forbiddenResponse(event);
  }
  const accessToken = generateAccessToken(findUser);

  setRefreshTokenCookie(event, refreshToken);

  return accessToken;
});
