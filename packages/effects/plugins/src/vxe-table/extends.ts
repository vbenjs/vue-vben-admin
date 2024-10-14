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

    // 假如数据变少，导致总页数变少并小于当前选中页码，通过getPaginationRef获取到的页码是不正确的，需获取正确的页码再次执行
    const { total } = proxyConfig?.response as any;
    const { pageSize, currentPage } = params.page;
    const resultTotal: number = data[total];
    if (Number(resultTotal)) {
      const currentTotalPage = Math.ceil(resultTotal / pageSize);
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
