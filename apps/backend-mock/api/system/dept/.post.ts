import { verifyAccessToken } from '~/utils/jwt-utils';
import {
  sleep,
  unAuthorizedResponse,
  useResponseSuccess,
} from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }
  await sleep(600);
  return useResponseSuccess(null);
});
function eventHandler(_: (event: any) => Promise<any>) {
  throw new Error('Function not implemented.');
}
