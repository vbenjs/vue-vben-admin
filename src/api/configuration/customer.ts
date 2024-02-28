import {
  HxCustomer,
  QueryHxCustomerForm,
  SysDataRelation,
} from '@/ApiModel/configuration/customer';
import { YN } from '@/enums/YN';
import { defHttp } from '@/utils/http/axios';
import { Result } from '/#/axios';
import { HxBaseProduct } from '@/ApiModel/configuration/product';
import { HxBaseEfficiency } from '@/ApiModel/configuration/efficiency';
import { HxBaseData } from '@/ApiModel/configuration/base';
import { OtherDataType } from '@/enums/baseDataType';
import { isNull, isUndefined } from 'lodash-es';

enum Api {
  base = '/admin/hxCustomer',
  info = '/admin/hxCustomer/info',
  create = '/admin/hxCustomer/create',
  delete = '/admin/hxCustomer/delete',
  update = '/admin/hxCustomer/update',
  modifyStatus = '/admin/hxCustomer/enabled',
}

//客户
enum ProductApi {
  base = '/admin/hxCustomer/product',
  create = '/admin/hxCustomer/addProduct',
  delete = '/admin/hxCustomer/deleteProduct',
}

//效率
enum EfficiencyApi {
  base = '/admin/hxCustomer/efficiency',
  create = '/admin/hxCustomer/addEfficiency',
  delete = '/admin/hxCustomer/deleteEfficiency',
}

//其他基础信息
enum OtherApi {
  base = '/admin/hxCustomer/base',
  create = '/admin/hxCustomer/addBase',
  delete = '/admin/hxCustomer/deleteBase',
}

// //模板
// enum TemplateApi {
//   base = '/admin/hxCustomer/template',
//   create = '/admin/hxCustomer/addTemplate',
//   delete = '/admin/hxCustomer/deleteTemplate',
// }

// //条码规则
// enum BarcodeApi {
//   base = '/admin/hxCustomer/barcode',
//   create = '/admin/hxCustomer/addBarcode',
//   delete = '/admin/hxCustomer/deleteBarcode',
// }

export function getCustomer(data?: QueryHxCustomerForm): Promise<HxCustomer[]>;
export function getCustomer(data: QueryHxCustomerForm, status: YN): Promise<HxCustomer[]>;
export function getCustomer(
  data: QueryHxCustomerForm,
  status: YN | null,
  isTable?: true,
): Promise<Result<HxCustomer[]>>;
export function getCustomer(data?: QueryHxCustomerForm, status?: YN | null, isTable?: boolean) {
  const enabled = isNull(status) ? undefined : isUndefined(status) ? 'Y' : status;
  return defHttp.post(
    {
      url: Api.base,
      data: { enabled, ...data },
    },
    { isTable },
  );
}

export const getCustomerById = async (id: number) => {
  return defHttp.post<HxCustomer>({
    url: Api.info,
    data: { id },
  });
};

export function createCustomer(data = {}) {
  return defHttp.post({
    url: Api.create,
    data,
  });
}

export function updateCustomer(data = {}) {
  return defHttp.post({
    url: Api.update,
    data,
  });
}

export function modifyCustomerStatus(ids: number[], status: YN) {
  return defHttp.post({
    url: Api.modifyStatus,
    data: { ids, status },
  });
}

export function deleteCustomer(ids: number[]) {
  return defHttp.post({
    url: Api.delete,
    data: { ids },
  });
}

//客户
export function getCustomerProduct(id: number): Promise<HxBaseProduct[]>;
export function getCustomerProduct({ id }: { id: number }): Promise<HxBaseProduct[]>;
export function getCustomerProduct(val: any): Promise<HxBaseProduct[]> {
  const id = getId(val);
  if (!id) return Promise.resolve([]);
  return defHttp.post({
    url: ProductApi.base,
    data: { id },
  });
}

export function createCustomerProduct(data: SysDataRelation) {
  return defHttp.post({
    url: ProductApi.create,
    data,
  });
}

export function deleteCustomerProduct(data: SysDataRelation) {
  return defHttp.post({
    url: ProductApi.delete,
    data,
  });
}

//效率
export function getCustomerEfficiency(id: number): Promise<HxBaseEfficiency[]>;
export function getCustomerEfficiency({ id }: { id: number }): Promise<HxBaseEfficiency[]>;
export function getCustomerEfficiency(val: any): Promise<HxBaseEfficiency[]> {
  const id = getId(val);
  if (!id) return Promise.resolve([]);
  return defHttp.post({
    url: EfficiencyApi.base,
    data: { id },
  });
}

export function createCustomerEfficiency(data: SysDataRelation) {
  return defHttp.post({
    url: EfficiencyApi.create,
    data,
  });
}

export function deleteCustomerEfficiency(data: SysDataRelation) {
  return defHttp.post({
    url: EfficiencyApi.delete,
    data,
  });
}

//其他基础信息
export function getCustomerBase(id: number, type?: OtherDataType): Promise<HxBaseData[]>;
export function getCustomerBase(
  { id }: { id: number },
  type?: OtherDataType,
): Promise<HxBaseData[]>;
export async function getCustomerBase(val: any, type?: OtherDataType): Promise<HxBaseData[]> {
  const id = getId(val);
  if (!id) return Promise.resolve([]);
  const data = await defHttp.post<HxBaseData[]>({
    url: OtherApi.base,
    data: { id },
  });
  if (type) {
    return data?.filter((item) => item.dataType === type);
  } else {
    return data;
  }
}

export function createCustomerBase(data: SysDataRelation) {
  return defHttp.post({
    url: OtherApi.create,
    data,
  });
}

export function deleteCustomerBase(data: SysDataRelation) {
  return defHttp.post({
    url: OtherApi.delete,
    data,
  });
}

// //模板
// export function getCustomerTemplate(id: number): Promise<HxPrintTemplate[]>;
// export function getCustomerTemplate({ id }: { id: number }): Promise<HxPrintTemplate[]>;
// export function getCustomerTemplate(val: any): Promise<HxPrintTemplate[]> {
//   const id = getId(val);
//   if (!id) return Promise.resolve([]);
//   return defHttp.post({
//     url: TemplateApi.base,
//     data: { id },
//   });
// }

// export function createCustomerTemplate(data: SysDataRelation) {
//   return defHttp.post({
//     url: TemplateApi.create,
//     data,
//   });
// }

// export function deleteCustomerTemplate(data: SysDataRelation) {
//   return defHttp.post({
//     url: TemplateApi.delete,
//     data,
//   });
// }

// //条码规则
// export function getCustomerBarcode(id: number): Promise<HxBarcodeRule[]>;
// export function getCustomerBarcode({ id }: { id: number }): Promise<HxBarcodeRule[]>;
// export function getCustomerBarcode(val: any): Promise<HxBarcodeRule[]> {
//   const id = getId(val);
//   if (!id) return Promise.resolve([]);
//   return defHttp.post({
//     url: BarcodeApi.base,
//     data: { id },
//   });
// }

// export function createCustomerBarcode(data: SysDataRelation) {
//   return defHttp.post({
//     url: BarcodeApi.create,
//     data,
//   });
// }

// export function deleteCustomerBarcode(data: SysDataRelation) {
//   return defHttp.post({
//     url: BarcodeApi.delete,
//     data,
//   });
// }

export const getId = (val: any) => {
  if (typeof val === 'number') return `${val}`;
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && val.id) return val.id as string;
  return;
};
