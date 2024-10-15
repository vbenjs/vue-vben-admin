import type { VxeGridProps, VxeUIExport } from 'vxe-table';

import type { VxeGridApi } from './api';

import { isFunction } from '@vben/utils';

import dayjs from 'dayjs';

export function extendProxyOptions(
  api: VxeGridApi,
  options: VxeGridProps,
  getFormValues: () => Record<string, any>,
) {
  [
    'query',
    'querySuccess',
    'queryError',
    'queryAll',
    'queryAllSuccess',
    'queryAllError',
  ].forEach((key) => {
    extendProxyOption(key, api, options, getFormValues);
  });
}

function extendProxyOption(
  key: string,
  api: VxeGridApi,
  options: VxeGridProps,
  getFormValues: () => Record<string, any>,
) {
  const { proxyConfig } = options;
  const configFn = (proxyConfig?.ajax as any)?.[key];
  if (!isFunction(configFn)) {
    return options;
  }

  const wrapperFn = async (params: any, _formValues: any, ...args: any[]) => {
    const formValues = getFormValues();
    const data = await configFn(params, formValues, ...args);

    // If the page is incorrect, make corrections and request again
    const total = proxyConfig?.response?.total as string;
    const { pageSize, currentPage } = params.page;
    const resultTotal: number = data[total];
    if (Number(resultTotal)) {
      const currentTotalPage = Math.max(1, Math.ceil(resultTotal / pageSize));
      if (currentPage > currentTotalPage) {
        params.page.currentPage = currentTotalPage;
        return await wrapperFn(params, _formValues, ...args);
      }
    }
    return data;
  };
  api.setState({
    gridOptions: {
      proxyConfig: {
        ajax: {
          [key]: wrapperFn,
        },
      },
    },
  });
}

export function extendsDefaultFormatter(vxeUI: VxeUIExport) {
  vxeUI.formats.add('formatDate', {
    tableCellFormatMethod({ cellValue }) {
      return dayjs(cellValue).format('YYYY-MM-DD');
    },
  });

  vxeUI.formats.add('formatDateTime', {
    tableCellFormatMethod({ cellValue }) {
      return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss');
    },
  });
}
