import { eventHandler, getRouterParam, readBody } from 'h3';
import {
  findDictTypeById,
  isDictCodeExists,
  updateDictType,
} from '~/utils/dict-utils';
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
  if (!id || !findDictTypeById(id)) {
    return useResponseError('dict type not found');
  }

  const body = await readBody(event);
  if (body?.code && isDictCodeExists(body.code, id)) {
    return useResponseError('dict code already exists');
  }

  await sleep(300);
  return useResponseSuccess(
    updateDictType(id, {
      code: body?.code,
      name: body?.name,
      remark: body?.remark,
      status: body?.status,
    }),
  );
});
