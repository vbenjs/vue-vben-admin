import type { MakeErrorMessageFn, ResponseInterceptorConfig } from './types';

import { $t } from '@vben/locales';

import axios from 'axios';

export const errorMessageResponseInterceptor = (
  makeErrorMessage?: MakeErrorMessageFn,
): ResponseInterceptorConfig => {
  return {
    rejected: (error: any) => {
      if (axios.isCancel(error)) {
        return Promise.reject(error);
      }

      const err: string = error?.toString?.() ?? '';
      let errMsg = '';
      if (err?.includes('Network Error')) {
        errMsg = $t('fallback.http.networkError');
      } else if (error?.message?.includes?.('timeout')) {
        errMsg = $t('fallback.http.requestTimeout');
      }
      if (errMsg) {
        makeErrorMessage?.(errMsg);
        return Promise.reject(error);
      }

      let errorMessage = error?.response?.data?.error?.message ?? '';
      const status = error?.response?.status;

      switch (status) {
        case 400: {
          errorMessage = $t('fallback.http.badRequest');
          break;
        }
        case 401: {
          errorMessage = $t('fallback.http.unauthorized');
          break;
        }
        case 403: {
          errorMessage = $t('fallback.http.forbidden');
          break;
        }
        case 404: {
          errorMessage = $t('fallback.http.notFound');
          break;
        }
        case 408: {
          errorMessage = $t('fallback.http.requestTimeout');
          break;
        }
        default: {
          errorMessage = $t('fallback.http.internalServerError');
        }
      }
      makeErrorMessage?.(errorMessage);
      return Promise.reject(error);
    },
  };
};
