import type { VxeGridProps } from 'vxe-table';

import type { VxeGridApi } from './api';

import { isFunction } from '@vben/utils';

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
