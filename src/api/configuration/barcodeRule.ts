import { HxBarcodeRule, QueryHxBarcodeRuleForm } from '@/ApiModel/configuration/barcodeRule';
import { YN } from '@/enums/YN';
import { defHttp } from '@/utils/http/axios';
import { Result } from '/#/axios';
import { EnumsVo } from '@/ApiModel';
import { getId } from './customer';
import { SysDataRelation } from '@/ApiModel/configuration/customer';
import { isNull, isUndefined } from 'lodash-es';
import { BarcodeRuleType } from '@/enums/barcodeRuleType';

enum Api {
  base = '/admin/hxBarcodeRule',
  info = '/admin/hxBarcodeRule/info',
  create = '/admin/hxBarcodeRule/create',
  delete = '/admin/hxBarcodeRule/delete',
  update = '/admin/hxBarcodeRule/update',
  modifyStatus = '/admin/hxBarcodeRule/enabled',

  bindField = '/admin/hxBarcodeRule/bindField',
  updateContent = '/admin/hxBarcodeRule/updateContent',
  updateVerify = '/admin/hxBarcodeRule/updateVerify',

  other = '/admin/hxBarcodeRule/other',
  addOther = '/admin/hxBarcodeRule/addOther',
  deleteOther = '/admin/hxBarcodeRule/deleteOther',

  ruleField = '/admin/hxBarcodeRule/ruleField',
}

export function getBarcodeRule(data?: QueryHxBarcodeRuleForm): Promise<HxBarcodeRule[]>;
export function getBarcodeRule(data: QueryHxBarcodeRuleForm, status: YN): Promise<HxBarcodeRule[]>;
export function getBarcodeRule(
  data: QueryHxBarcodeRuleForm,
  status: YN | null,
  isTable: true,
): Promise<Result<HxBarcodeRule[]>>;
export function getBarcodeRule(
  data?: QueryHxBarcodeRuleForm,
  status?: YN | null,
  isTable?: boolean,
) {
  const enabled = isNull(status) ? undefined : isUndefined(status) ? 'Y' : status;
  return defHttp.post(
    {
      url: Api.base,
      data: { enabled, ...data },
    },
    { isTable },
  );
}

export const getBarcodeRuleById = async (id: number) => {
  return defHttp.post<HxBarcodeRule>({
    url: Api.info,
    data: { id },
  });
};

export function createBarcodeRule(data = {}) {
  return defHttp.post({
    url: Api.create,
    data,
  });
}

export function updateBarcodeRule(data = {}) {
  return defHttp.post({
    url: Api.update,
    data,
  });
}

export function modifyBarcodeRuleStatus(ids: number[], status: YN) {
  return defHttp.post({
    url: Api.modifyStatus,
    data: { ids, status },
  });
}

export function deleteBarcodeRule(ids: number[]) {
  return defHttp.post({
    url: Api.delete,
    data: { ids },
  });
}

export function getBindField() {
  return defHttp.get<EnumsVo[]>({
    url: Api.bindField,
  });
}

export function updateBarcodeRuleContent(data: { id: number; content: string }) {
  return defHttp.post({
    url: Api.updateContent,
    data,
  });
}

export function updateBarcodeVerifyRule(data: { id: number; verify: string }) {
  return defHttp.post({
    url: Api.updateVerify,
    data,
  });
}

export function getBarcodeOther(id: number): Promise<HxBarcodeRule[]>;
export function getBarcodeOther({ id }: { id: number }): Promise<HxBarcodeRule[]>;
export function getBarcodeOther(val: any): Promise<HxBarcodeRule[]> {
  const id = getId(val);
  if (!id) return Promise.resolve([]);
  return defHttp.post({
    url: Api.other,
    data: { id },
  });
}
export function addBarcodeOther(data: SysDataRelation) {
  return defHttp.post({
    url: Api.addOther,
    data,
  });
}

export function deleteBarcodeOther(data: SysDataRelation) {
  return defHttp.post({
    url: Api.deleteOther,
    data,
  });
}

export function getRuleField(ruleType: BarcodeRuleType) {
  return defHttp.post<{ fields: EnumsVo[]; funs: EnumsVo[] }>({
    url: Api.ruleField,
    data: { ruleType },
  });
}
