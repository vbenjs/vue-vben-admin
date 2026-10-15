import { eventHandler, getRouterParam } from 'h3';
import { deleteDictType } from '~/utils/dict-utils';
import { verifyAccessToken } from '~/utils/jwt-utils';
import {
  sleep,
  unAuthorizedResponse,
  useResponseError,
  useResponseSuccess,
} from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const id = getRouterParam(event, 'id');
  if (!id) {
    return useResponseError('id is required');
  }

  await sleep(300);
  if (!deleteDictType(id)) {
    return useResponseError('dict type not found');
  }
  return useResponseSuccess(null);
});
