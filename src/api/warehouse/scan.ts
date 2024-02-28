import { defHttp } from '@/utils/http/axios';
import { HxScanCode, QueryHxScanCodeForm } from '@/ApiModel/warehouse/scan';

enum Api {
  base = '/admin/hxScanCode',
  // info = '/admin/hxScanCode/info',
  // create = '/admin/hxScanCode/create',
  delete = '/admin/hxScanCode/delete',
  // update = '/admin/hxScanCode/update',

  last = '/admin/hxScanCode/lastPda',
}

export function getScanCode(data: QueryHxScanCodeForm = {}) {
  const { isTable, ...rest } = data;
  return defHttp.post<HxScanCode[]>(
    {
      url: Api.base,
      data: rest,
    },
    { isTable },
  );
}

// export const getScanCodeById = async (id: number) => {
//   return defHttp.post<HxScanCode>({
//     url: Api.info,
//     data: { id },
//   });
// };

// export function createScanCode(data = {}) {
//   return defHttp.post({
//     url: Api.create,
//     data,
//   });
// }

// export function updateScanCode(data = {}) {
//   return defHttp.post({
//     url: Api.update,
//     data,
//   });
// }

export function deleteScanCode(ids: number[]) {
  return defHttp.post({
    url: Api.delete,
    data: { ids },
  });
}

export function getLastScanCode() {
  return defHttp.post<HxScanCode | undefined>({
    url: Api.last,
  });
}
