import { jwt } from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const { password, username } = await readBody(event);

  const findUser = MOCK_USERS.find(
    (item) => item.username === username && item.password === password,
  );

  if (!findUser) {
    setResponseStatus(event, 403);
    return useResponseError('UnauthorizedException', '用户名或密码错误');
  }

  const accessToken = jwt.sign(findUser, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15s',
  });
  const refreshToken = jwt.sign(findUser, process.env.REFRESH_TOKEN_SECRET);
  await useStorage().setItem(`refreshToken-${findUser.id}`, refreshToken);

  return useResponseSuccess({
    accessToken,
    refreshToken,
  });
});
