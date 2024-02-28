import { HxPda, QueryHxPdaForm } from '@/ApiModel/configuration/pda';
import { YN } from '@/enums/YN';
import { defHttp } from '@/utils/http/axios';
import { Result } from '/#/axios';
import { isNull, isUndefined } from 'lodash-es';

enum Api {
  base = '/admin/hxPda',
  info = '/admin/hxPda/info',
  create = '/admin/hxPda/create',
  delete = '/admin/hxPda/delete',
  update = '/admin/hxPda/update',
  modifyStatus = '/admin/hxPda/enabled',
  updateBoxRule = '/admin/hxPda/updateBoxRule',
  updateBillInRule = '/admin/hxPda/updateBillInRule',
}

export function getPda(data?: QueryHxPdaForm): Promise<HxPda[]>;
export function getPda(data: QueryHxPdaForm, status: YN): Promise<HxPda[]>;
export function getPda(
  data: QueryHxPdaForm,
  status: YN | null,
  isTable?: true,
): Promise<Result<HxPda[]>>;
export function getPda(data?: QueryHxPdaForm, status?: YN | null, isTable?: boolean) {
  const enabled = isNull(status) ? undefined : isUndefined(status) ? 'Y' : status;
  return defHttp.post(
    {
      url: Api.base,
      data: { enabled, ...data },
    },
    { isTable },
  );
}

export const getPdaById = async (id: number) => {
  return defHttp.post<HxPda>({
    url: Api.info,
    data: { id },
  });
};

export function createPda(data = {}) {
  return defHttp.post({
    url: Api.create,
    data,
  });
}

export function updatePda(data = {}) {
  return defHttp.post({
    url: Api.update,
    data,
  });
}

export function modifyPdaStatus(ids: number[], status: YN) {
  return defHttp.post({
    url: Api.modifyStatus,
    data: { ids, status },
  });
}

export function deletePda(ids: number[]) {
  return defHttp.post({
    url: Api.delete,
    data: { ids },
  });
}

export function updateBoxRule(data = {}) {
  return defHttp.post({
    url: Api.updateBoxRule,
    data,
  });
}

export function updateBillInRule(data = {}) {
  return defHttp.post({
    url: Api.updateBillInRule,
    data,
  });
}
