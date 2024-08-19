import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse } from '~/utils/response';

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const codes =
    MOCK_CODES.find((item) => item.username === userinfo.username)?.codes ?? [];

  return useResponseSuccess(codes);
});
