import { eventHandler, readBody } from 'h3';
import { createDictType, isDictCodeExists } from '~/utils/dict-utils';
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

  const body = await readBody(event);
  if (!body?.code || !body?.name) {
    return useResponseError('name and code are required');
  }
  if (isDictCodeExists(body.code)) {
    return useResponseError('dict code already exists');
  }

  await sleep(300);
  return useResponseSuccess(
    createDictType({
      code: body.code,
      name: body.name,
      remark: body.remark,
      status: body.status ?? 1,
    }),
  );
});
