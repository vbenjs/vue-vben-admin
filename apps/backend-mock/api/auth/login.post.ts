export default defineEventHandler(async (event) => {
  const { password, username } = await readBody(event);

  const findUser = MOCK_USERS.find(
    (item) => item.username === username && item.password === password,
  );

  if (!findUser) {
    setResponseStatus(event, 403);
    return useResponseError('UnauthorizedException', '用户名或密码错误');
  }

  const accessToken = Buffer.from(username).toString('base64');

  return useResponseSuccess({
    accessToken,
    // TODO: refresh token
    refreshToken: accessToken,
  });
});
