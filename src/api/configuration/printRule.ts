import { HxPrintRule, QueryHxPrintRuleForm } from '@/ApiModel/configuration/printRule';
import { YN } from '@/enums/YN';
import { defHttp } from '@/utils/http/axios';
import { Result } from '/#/axios';
import { isNull, isUndefined } from 'lodash-es';

enum Api {
  base = '/admin/hxPrintRule',
  info = '/admin/hxPrintRule/info',
  create = '/admin/hxPrintRule/create',
  delete = '/admin/hxPrintRule/delete',
  update = '/admin/hxPrintRule/update',
  modifyStatus = '/admin/hxPrintRule/enabled',
}

export function getPrintRule(data?: QueryHxPrintRuleForm): Promise<HxPrintRule[]>;
export function getPrintRule(data: QueryHxPrintRuleForm, status: YN): Promise<HxPrintRule[]>;
export function getPrintRule(
  data: QueryHxPrintRuleForm,
  status: YN | null,
  isTable: true,
): Promise<Result<HxPrintRule[]>>;
export function getPrintRule(data?: QueryHxPrintRuleForm, status?: YN | null, isTable?: boolean) {
  const enabled = isNull(status) ? undefined : isUndefined(status) ? 'Y' : status;
  return defHttp.post(
    {
      url: Api.base,
      data: { enabled, ...data },
    },
    { isTable },
  );
}

export const getPrintRuleById = async (id: number) => {
  return defHttp.post<HxPrintRule>({
    url: Api.info,
    data: { id },
  });
};

export function createPrintRule(data = {}) {
  return defHttp.post({
    url: Api.create,
    data,
  });
}

export function updatePrintRule(data = {}) {
  return defHttp.post({
    url: Api.update,
    data,
  });
}

export function modifyPrintRuleStatus(ids: number[], status: YN) {
  return defHttp.post({
    url: Api.modifyStatus,
    data: { ids, status },
  });
}

export function deletePrintRule(ids: number[]) {
  return defHttp.post({
    url: Api.delete,
    data: { ids },
  });
}
