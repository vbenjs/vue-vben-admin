export default eventHandler((event) => {
  try {
    const token = getHeader(event, 'Authorization');
    if (!token) {
      throw new Error('UnauthorizedException');
    }

    const username = Buffer.from(token, 'base64').toString('utf8');
    const codes =
      MOCK_CODES.find((item) => item.username === username)?.codes ?? [];

    return useResponseSuccess(codes);
  } catch {
    setResponseStatus(event, 401);
    return useResponseError('UnauthorizedException', 'Unauthorized Exception');
  }
});
