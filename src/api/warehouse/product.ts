import { EnumsVo } from '@/ApiModel';
import {
  HxProduct,
  MesPackageForm,
  QueryHxProductForm,
  SyncProgressVo,
  TimeLine,
} from '@/ApiModel/warehouse/product';
import { downloadByData } from '@/utils/file/download';
import { defHttp } from '@/utils/http/axios';
import { getFileName } from '@/utils/util';

enum Api {
  base = '/admin/hxProduct',
  info = '/admin/hxProduct/info',
  create = '/admin/hxProduct/create',
  last = '/admin/hxProduct/lastPackage',

  preview = '/admin/hxProduct/preview', //获取barcode预览
  serialNum = '/admin/hxProduct/serialNum',

  batchCreate = '/admin/hxProduct/batchCreate',
  delete = '/admin/hxProduct/delete',
  allSource = '/admin/hxProduct/allSource',

  printPreview = '/admin/hxProduct/printPreview', // 打印预览

  matchCreate = '/admin/hxProduct/matchCreate', // 匹配创建

  export = '/admin/hxProduct/export', // 导出
  exportAll = '/admin/hxProduct/exportAll', // 导出全部

  timeLine = '/admin/hxProduct/timeLine', // 时间轴
}

enum SyncApi {
  other = '/admin/hxProduct/other',
  syncAll = '/admin/hxProduct/syncAll',
  sync = '/admin/hxProduct/sync',
  syncStatus = '/admin/hxProduct/syncStatus',
  stopSync = '/admin/hxProduct/stopSync',
  syncVerify = '/admin/hxProduct/syncVerify',
}

export function getProduct(data?: QueryHxProductForm, isTable = true) {
  return defHttp.post(
    {
      url: Api.base,
      data: { ...data },
    },
    { isTable },
  );
}

export const getProductById = async (id: number) => {
  return defHttp.post<HxProduct>({
    url: Api.info,
    data: { id },
  });
};

export function createProduct(data = {}) {
  return defHttp.post({
    url: Api.create,
    data,
  });
}

export function getLastPackage(printRuleId: number) {
  return defHttp.post({
    url: Api.last,
    data: { id: printRuleId },
  });
}

export function getProductPreview(data = {}) {
  return defHttp.post({
    url: Api.preview,
    data,
  });
}

export function getProductSerialNum(len: number) {
  return defHttp.post({
    url: Api.serialNum,
    data: { len },
  });
}

export function batchCreateProduct(barcodes: string[], product: Partial<HxProduct>) {
  return defHttp.post({
    url: Api.batchCreate,
    data: { barcodes, product },
  });
}

export function deleteProduct(ids: number[]) {
  return defHttp.post({
    url: Api.delete,
    data: { ids },
  });
}

export function getAllSource() {
  return defHttp.post<EnumsVo[]>({
    url: Api.allSource,
  });
}

export const getProductPrintPreview = async (productIds: number[], templateId: number) => {
  return defHttp.post({
    url: Api.printPreview,
    data: { productIds, templateId },
  });
};

export const matchCreateProduct = async (data: any) => {
  return defHttp.post({
    url: Api.matchCreate,
    data,
  });
};

export const exportProduct = async (codes: string[], name?: string) => {
  const res = await defHttp.post(
    {
      url: Api.export,
      data: { codes },
      responseType: 'blob',
      timeout: 0,
    },
    {
      isReturnNativeResponse: true,
    },
  );
  const blob = new Blob([res.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
  });

  downloadByData(blob, getFileName(res) ?? 'product.xlsx');
};

export const exportAllProduct = async (data: any) => {
  const res = await defHttp.post(
    {
      url: Api.exportAll,
      data,
      responseType: 'blob',
      timeout: 0,
    },
    {
      isReturnNativeResponse: true,
    },
  );
  const blob = new Blob([res.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
  });
  downloadByData(blob, getFileName(res) ?? 'product.xlsx');
};

export const getProductTimeLine = async (code: string) => {
  return defHttp.post<TimeLine[]>({
    url: Api.timeLine,
    data: { code },
  });
};

// 同步
export const getSyncOther = async (
  data: { createdTime?: string; barcode?: string },
  isTable = true,
) => {
  return defHttp.post<MesPackageForm[]>(
    {
      url: SyncApi.other,
      data,
    },
    {
      isTable,
    },
  );
};

export const syncAll = async (data: { createdTime: string; barcode: string }) => {
  return defHttp.post({
    url: SyncApi.syncAll,
    data,
  });
};

export const sync = async (codes: string[]) => {
  return defHttp.post({
    url: SyncApi.sync,
    data: { codes },
  });
};

export const getSyncStatus = async () => {
  return defHttp.get<SyncProgressVo>({
    url: SyncApi.syncStatus,
  });
};

export const stopSync = async () => {
  return defHttp.get({
    url: SyncApi.stopSync,
  });
};

export const syncVerify = async () => {
  return defHttp.post({
    url: SyncApi.syncVerify,
  });
};
