import {
  HxPrinter,
  HxPrinterClient,
  PrinterInfo,
  QueryHxPrinterForm,
} from '@/ApiModel/configuration/printer';
import { YN } from '@/enums/YN';
import { defHttp } from '@/utils/http/axios';
import { Result } from '/#/axios';
import { isNull, isUndefined } from 'lodash-es';

enum Api {
  base = '/admin/hxPrinter',
  info = '/admin/hxPrinter/info',
  create = '/admin/hxPrinter/create',
  delete = '/admin/hxPrinter/delete',
  update = '/admin/hxPrinter/update',
  modifyStatus = '/admin/hxPrinter/enabled',

  clients = '/admin/hxPrinter/clients',
}

export function getPrinter(data?: QueryHxPrinterForm): Promise<HxPrinter[]>;
export function getPrinter(data: QueryHxPrinterForm, status: YN): Promise<HxPrinter[]>;
export function getPrinter(
  data: QueryHxPrinterForm,
  status: YN | null,
  isTable?: true,
): Promise<Result<HxPrinter[]>>;
export function getPrinter(data?: QueryHxPrinterForm, status?: YN | null, isTable?: boolean) {
  const enabled = isNull(status) ? undefined : isUndefined(status) ? 'Y' : status;

  return defHttp.post(
    {
      url: Api.base,
      data: { enabled, ...data },
    },
    { isTable },
  );
}

export const getPrinterById = async (id: number) => {
  return defHttp.post<HxPrinter>({
    url: Api.info,
    data: { id },
  });
};

export function createPrinter(data = {}) {
  return defHttp.post({
    url: Api.create,
    data,
  });
}

export function updatePrinter(data = {}) {
  return defHttp.post({
    url: Api.update,
    data,
  });
}

export function modifyPrinterStatus(ids: number[], status: YN) {
  return defHttp.post({
    url: Api.modifyStatus,
    data: { ids, status },
  });
}

export function deletePrinter(ids: number[]) {
  return defHttp.post({
    url: Api.delete,
    data: { ids },
  });
}

export function getPrinterClients() {
  return defHttp.get<HxPrinterClient[]>({
    url: Api.clients,
  });
}

export async function getAllPrinter() {
  const clients = await getPrinterClients();
  const printers: (PrinterInfo & HxPrinterClient & { id: string })[] = [];
  clients.forEach((client) => {
    client.printList?.forEach((printer) => {
      //@ts-ignore
      delete printer.options;
      printers.push({
        ...printer,
        ...client,
        id: [client.clientId, printer.name].join('/'),
      });
    });
  });
  return printers;
}
