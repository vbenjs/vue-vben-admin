import { defHttp } from '@/utils/http/axios';

enum Api {
  package_add = '/api/mes/package/add',
  box_add = '/api/mes/box/add',
}

export function postMesAddPackage(data: any) {
  return defHttp.post({
    url: Api.package_add,
    data: data,
  });
}

export function postMesAddBox(data: any) {
  return defHttp.post({
    url: Api.box_add,
    data: data,
  });
}
