import { EnumsVo } from '@/ApiModel';
import { HxBill, QueryHxBillForm } from '@/ApiModel/warehouse/bill';
import { ProductType } from '@/enums/productType';
import { downloadByData } from '@/utils/file/download';
import { defHttp } from '@/utils/http/axios';
import { getFileName } from '@/utils/util';

enum Api {
  base = '/admin/hxBill',
  info = '/admin/hxBill/info',
  preview = '/admin/hxBill/preview',
  note = '/admin/hxBill/note', //批量更新备注
  note3 = '/admin/hxBill/note3', //批量更新备注
  note4 = '/admin/hxBill/note4', //批量更新备注
  updateInfo = '/admin/hxBill/updateInfo',

  allType = '/admin/hxBill/allType',
  timeTable = '/admin/hxBill/timeTable', //获取所有班次
  allStatus = '/admin/hxBill/allStatus', //获取所有状态
  cancelIn = '/admin/hxBill/cancelIn',
  billBack = '/admin/hxBill/billBack', // 整单退回
  // exportpackage = '/admin/hxBill/export/package',
  // exportbox = '/admin/hxBill/export/box',
  export = '/admin/hxBill/export', //导出单据
  exportProduct = '/admin/hxBill/export/product',
  productDetail = '/admin/hxBill/productDetail',
}

export function getBill(data: QueryHxBillForm = {}) {
  const { isTable, ...rest } = data;
  return defHttp.post<HxBill[]>(
    {
      url: Api.base,
      data: rest,
    },
    { isTable },
  );
}

export const getBillById = (id: number) => {
  return defHttp.post<HxBill>({
    url: Api.info,
    data: { id },
  });
};

export const getBillPreview = (billIds: number[], templateId: number) => {
  return defHttp.post<HxBill>({
    url: Api.preview,
    data: { billIds, templateId },
  });
};

export const updateBillInfo = ({
  id,
  note,
  outCode,
}: {
  id: number;
  note: string;
  outCode: string;
}) => {
  return defHttp.post<string>({
    url: Api.updateInfo,
    data: { id, note, outCode },
  });
};

export const updateBillNoteBatch = ({ ids, note }: { ids: number[]; note: string }) => {
  return defHttp.post<string>({
    url: Api.note,
    data: { ids, note },
  });
};

export const updateBillNote3Batch = ({ ids, note }: { ids: number[]; note: string }) => {
  return defHttp.post<string>({
    url: Api.note3,
    data: { ids, note },
  });
};

export const updateBillNote4Batch = ({ ids, note }: { ids: number[]; note: string }) => {
  return defHttp.post<string>({
    url: Api.note4,
    data: { ids, note },
  });
};

export const getAllBillType = () => {
  return defHttp.post<EnumsVo[]>({
    url: Api.allType,
  });
};

export const cancelIn = (id: number) => {
  return defHttp.post<string>({
    url: Api.cancelIn,
    data: { id },
  });
};

export const billBack = (ids: number[]) => {
  return defHttp.post<string>({
    url: Api.billBack,
    data: { billIds: ids },
  });
};

export const getTimeTable = () => {
  return defHttp.post<EnumsVo[]>({
    url: Api.timeTable,
  });
};

export const getAllStatus = () => {
  return defHttp.post<EnumsVo[]>({
    url: Api.allStatus,
  });
};

export const exportPackage = async (billCodes: string[]) => {
  return exportProduct(billCodes, 'PACKAGE');
};

export const exportBox = async (billCodes: string[]) => {
  return exportProduct(billCodes, 'BOX');
};

export const exportProduct = async (billCodes: string[], productType: ProductType) => {
  const res = await defHttp.post(
    {
      url: Api.exportProduct,
      data: { billCodes, productType },
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
  downloadByData(blob, getFileName(res) ?? '产品明细.xlsx');
};

export const exportBill = async (billIds: number[], billType: string) => {
  const res = await defHttp.post(
    {
      url: Api.export,
      data: { billIds, billType },
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

  downloadByData(blob, getFileName(res) ?? '单据.xlsx');
};

export const getProductDetail = async (data: { billCodes: string[]; productType: string }) => {
  return defHttp.post(
    {
      url: Api.productDetail,
      data: { ...data },
    },
    { isTable: true },
  );
};
