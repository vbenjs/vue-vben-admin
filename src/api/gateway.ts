import { QueryGatewayForm, GatewayResult } from './model/gatewayModel';
import { defHttp } from '@/utils/http/axios';
import { Result } from '/#/axios';

enum Api {
  gateway = '/admin/pmGateway',
  info = '/admin/pmGateway/',
  bindStore = '/admin/pmGateway/bindStore',
  mark = '/admin/pmGateway/mark',
  statis = '/admin/pmGateway/multibus/statis',
  originData = '/admin/pmGateway/originData',

  create = '/admin/pmGateway/create',
  update = '/admin/pmGateway/update',
  delete = '/admin/pmGateway/delete',
}

export function getGateway(data: QueryGatewayForm, isTable = false) {
  return defHttp.post<GatewayResult[]>(
    {
      url: Api.gateway,
      data,
    },
    {
      isTable,
    },
  );
}

export function getGatewayById(id: number) {
  return defHttp.post<GatewayResult>({
    url: Api.info + id,
  });
}

export function bindStoreAndGateway(data = {}) {
  return defHttp.post({
    url: Api.bindStore,
    data,
  });
}

export function updateGatewayMark(data = {}) {
  return defHttp.post({
    url: Api.mark,
    data,
  });
}

export function getGatewayStatis(data = {}) {
  return defHttp.post({
    url: Api.statis,
    data,
  });
}

// export function getGatewayOriginData(data = {}, isTable = true) {
//   return defHttp.post(
//     {
//       url: Api.originData,
//       data,
//     },
//     { isTable },
//   );
// }

export async function getGatewayOriginData(data = {}) {
  const result = await defHttp.post<Result<(Recordable | string)[]>>(
    {
      url: Api.originData,
      data,
    },
    { isTable: true },
  );
  result.data = result.data.map((item) => {
    if (typeof item === 'string') return JSON.parse(item);
    return item;
  });
  return result as Result<Recordable[]>;
}

export function createGateway(data = {}) {
  return defHttp.post({
    url: Api.create,
    data,
  });
}

export function updateGateway(data = {}) {
  return defHttp.post({
    url: Api.update,
    data,
  });
}

export function deleteGateway(id: number) {
  return defHttp.post({
    url: Api.delete,
    data: { id },
  });
}
