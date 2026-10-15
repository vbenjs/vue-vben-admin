import { eventHandler, getRouterParam, readBody } from 'h3';
import { findDictDataById, updateDictData } from '~/utils/dict-utils';
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
  if (!id || !findDictDataById(id)) {
    return useResponseError('dict data not found');
  }

  const body = await readBody(event);
  await sleep(300);
  return useResponseSuccess(
    updateDictData(id, {
      color: body?.color,
      label: body?.label,
      remark: body?.remark,
      sort: body?.sort,
      status: body?.status,
      value: body?.value,
    }),
  );
});
