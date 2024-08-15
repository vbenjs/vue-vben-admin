import {
  clearRefreshTokenCookie,
  setRefreshTokenCookie,
} from '~/utils/cookie_utils';
import { generateAccessToken, generateRefreshToken } from '~/utils/jwt_utils';

export default defineEventHandler(async (event) => {
  const { password, username } = await readBody(event);
  if (!password || !username) {
    setResponseStatus(event, 400);
    return useResponseError(
      'BadRequestException',
      'Username and password are required',
    );
  }

  const findUser = MOCK_USERS.find(
    (item) => item.username === username && item.password === password,
  );

  if (!findUser) {
    clearRefreshTokenCookie(event);

    setResponseStatus(event, 403);
    return useResponseError(
      'UnauthorizedException',
      'Username or password is incorrect',
    );
  }

  const accessToken = generateAccessToken(findUser);
  const refreshToken = generateRefreshToken(findUser);
  await useStorage().setItem(refreshToken, findUser.id);

  setRefreshTokenCookie(event, refreshToken);

  return useResponseSuccess({
    ...findUser,
    accessToken,
  });
});
