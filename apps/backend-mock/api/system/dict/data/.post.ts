import { eventHandler, readBody } from 'h3';
import { createDictData, findDictTypeByCode } from '~/utils/dict-utils';
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
  if (
    !body?.dictCode ||
    body?.label === undefined ||
    body?.value === undefined
  ) {
    return useResponseError('dictCode, label and value are required');
  }
  if (!findDictTypeByCode(body.dictCode)) {
    return useResponseError('dict type not found');
  }

  await sleep(300);
  return useResponseSuccess(
    createDictData({
      color: body.color,
      dictCode: body.dictCode,
      label: body.label,
      remark: body.remark,
      sort: body.sort ?? 0,
      status: body.status ?? 1,
      value: body.value,
    }),
  );
});
