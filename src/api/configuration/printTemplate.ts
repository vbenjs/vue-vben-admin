import { HxPrintTemplate, QueryHxPrintTemplateForm } from '@/ApiModel/configuration/printTemplate';
import { YN } from '@/enums/YN';
import { defHttp } from '@/utils/http/axios';
import { ErrorMessageMode, Result } from '/#/axios';
import { isNull, isUndefined } from 'lodash-es';
import { EnumsVo } from '@/ApiModel';

enum Api {
  base = '/admin/hxPrintTemplate',
  info = '/admin/hxPrintTemplate/info',
  create = '/admin/hxPrintTemplate/create',
  delete = '/admin/hxPrintTemplate/delete',
  update = '/admin/hxPrintTemplate/update',
  modifyStatus = '/admin/hxPrintTemplate/enabled',

  test = '/admin/hxPrintTemplate/printTest',
  updateContent = '/admin/hxPrintTemplate/updateContent',
  type = '/admin/hxPrintTemplate/allType',

  print = '/admin/hxPrintTemplate/print',
}

export function getPrintTemplate(data?: QueryHxPrintTemplateForm): Promise<HxPrintTemplate[]>;
export function getPrintTemplate(
  data: QueryHxPrintTemplateForm,
  status: YN,
): Promise<HxPrintTemplate[]>;
export function getPrintTemplate(
  data: QueryHxPrintTemplateForm,
  status: YN | null,
  isTable: true,
): Promise<Result<HxPrintTemplate[]>>;
export function getPrintTemplate(
  data?: QueryHxPrintTemplateForm,
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

export const getPrintTemplateById = async (id: number) => {
  return defHttp.post<HxPrintTemplate>({
    url: Api.info,
    data: { id },
  });
};

export function createPrintTemplate(data = {}) {
  return defHttp.post({
    url: Api.create,
    data,
  });
}

export function updatePrintTemplate(data = {}) {
  return defHttp.post({
    url: Api.update,
    data,
  });
}

export function modifyPrintTemplateStatus(ids: number[], status: YN) {
  return defHttp.post({
    url: Api.modifyStatus,
    data: { ids, status },
  });
}

export function deletePrintTemplate(ids: number[]) {
  return defHttp.post({
    url: Api.delete,
    data: { ids },
  });
}

export function testPrintTemplate(printerId: number, templateId: number) {
  return defHttp.post({
    url: Api.test,
    data: { printerId, templateId },
  });
}

export function updatePrintTemplateContent(id: number, content: string) {
  return defHttp.post({
    url: Api.updateContent,
    data: { id, content },
  });
}

export function getAllPrintTemplateType() {
  return defHttp.get<EnumsVo[]>({
    url: Api.type,
  });
}

export function printTemplate({
  dataIds,
  printerId,
  templateId,
  errorMessageMode = 'message',
}: {
  dataIds: number[];
  printerId: number;
  templateId: number;
  errorMessageMode?: ErrorMessageMode;
}) {
  return defHttp.post(
    {
      url: Api.print,
      data: { dataIds, printerId, templateId },
    },
    { errorMessageMode },
  );
}
