import type { VxeUIExport } from 'vxe-table';

import type { Recordable } from '@vben/types';

import type { VxeGridApi } from './api';
import type { VxeGridProps as VbenVxeGridProps } from './types';

import { formatDate, formatDateTime, isFunction } from '@vben/utils';

type VbenGridOptions = NonNullable<VbenVxeGridProps['gridOptions']>;

export function extendProxyOptions(
  api: VxeGridApi,
  options: VbenGridOptions,
  getFormValues: () => Recordable<any>,
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

// Tracks ajax handlers wrapped by extendProxyOption so repeated wrapping is a
// no-op instead of stacking wrappers (e.g. setup-time wrap + init-time
// re-wrap). Keyed by function identity.
const wrappedAjaxFns = new WeakSet<object>();

function extendProxyOption(
  key: string,
  api: VxeGridApi,
  options: VbenGridOptions,
  getFormValues: () => Recordable<any>,
) {
  const { proxyConfig } = options;
  const configFn = (proxyConfig?.ajax as Recordable<any>)?.[key];
  if (!isFunction(configFn) || wrappedAjaxFns.has(configFn)) {
    return options;
  }

  const wrapperFn = async (
    params: Recordable<any>,
    customValues: Recordable<any>,
    ...args: Recordable<any>[]
  ) => {
    const formValues = getFormValues();
    const data = await configFn(
      params,
      {
        /**
         * 开启toolbarConfig.refresh功能
         * 点击刷新按钮 这里的值为PointerEvent 会携带错误参数
         */
        ...(customValues instanceof PointerEvent ? {} : customValues),
        ...formValues,
      },
      ...args,
    );
    return data;
  };
  wrappedAjaxFns.add(wrapperFn);
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
      return formatDate(cellValue);
    },
  });

  vxeUI.formats.add('formatDateTime', {
    tableCellFormatMethod({ cellValue }) {
      return formatDateTime(cellValue);
    },
  });
}
