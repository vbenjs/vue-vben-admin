import { generateAccessToken, generateRefreshToken } from '~/utils/jwt_utils';

export default defineEventHandler(async (event) => {
  const { password, username } = await readBody(event);

  const findUser = MOCK_USERS.find(
    (item) => item.username === username && item.password === password,
  );

  if (!findUser) {
    setResponseStatus(event, 403);
    return useResponseError('UnauthorizedException', '用户名或密码错误');
  }

  const accessToken = generateAccessToken(findUser);
  const refreshToken = generateRefreshToken(findUser);
  await useStorage().setItem(`refreshToken-${findUser.id}`, refreshToken);

  return useResponseSuccess({
    accessToken,
    refreshToken,
  });
});
