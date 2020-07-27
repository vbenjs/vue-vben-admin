import { VAxios } from './Axios';
import { getToken } from '@/utils/auth';
import { AxiosTransform } from './axiosTransform';
import { AxiosResponse } from 'axios';

import { checkStatus } from './checkStatus';

import { useSetting } from '@/hooks/core/useSetting';
import { useMessage } from '@/hooks/core/useMessage';

import { RequestEnum, ResultEnum, ContentTypeEnum } from '@/enums/httpEnum';

import { isString } from '@/utils/is/index';
import { formatRequestDate } from '@/utils/momentUtil';
import { setObjToUrlParams } from '@/utils/urlUtils';
import { RequestOptions, Result } from './types';
import { errorStore, ErrorTypeEnum, ErrorInfo } from '@/store/modules/error';

const { globSetting } = useSetting();
const prefix = globSetting.urlPrefix;
const { createMessage, createErrorModal } = useMessage();

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理请求数据
   */
  transformRequestData: (res: AxiosResponse<Result>, options: RequestOptions) => {
    const { isTransformRequestResult } = options;
    // 不进行任何处理，直接返回
    if (!isTransformRequestResult) {
      return res.data;
    }

    const errorResult = undefined;

    const { data } = res;
    if (!data) {
      return '[HTTP] Request has no return value';
    }
    const { code, result, message } = data;
    const hasSuccess = data && Reflect.has(data, 'code') && code === ResultEnum.SUCCESS;

    if (!hasSuccess) {
      if (message) {
        if (options.errorMessageMode === 'modal') {
          createErrorModal({ title: '错误提示', content: message });
        } else {
          createMessage.error(message);
        }
      }
      Promise.reject(new Error(message));
      return errorResult;
    }

    if (code === ResultEnum.SUCCESS) {
      return result;
    }
    if (code === ResultEnum.ERROR) {
      if (message) {
        createMessage.error(data.message);
        Promise.reject(new Error(message));
      } else {
        const msg = '操作失败,系统异常!';
        createMessage.error(msg);
        Promise.reject(new Error(msg));
      }
      return errorResult;
    }
    // 登录超时
    if (code === ResultEnum.TIMEOUT) {
      const timeoutMsg = '登录超时,请重新登录!';
      createErrorModal({
        title: '操作失败',
        content: timeoutMsg,
      });
      Promise.reject(new Error(timeoutMsg));
      return errorResult;
    }
    return errorResult;
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate } = options;

    if (joinPrefix) {
      config.url = `${prefix}${config.url}`;
    }

    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }
    if (config.method === RequestEnum.GET) {
      const now = new Date().getTime();
      if (!isString(config.params)) {
        config.data = {
          // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
          params: Object.assign(config.params || {}, {
            _t: now,
          }),
        };
      } else {
        // 兼容restful风格
        config.url = config.url + config.params + `?_t=${now}`;
        config.params = {};
      }
    } else {
      if (!isString(config.params)) {
        formatDate && formatRequestDate(config.params);
        config.data = config.params;
        config.params = {};
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(config.url as string, config.data);
        }
      } else {
        // 兼容restful风格
        config.url = config.url + config.params;
        config.params = {};
      }
    }
    return config;
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config) => {
    // 请求之前处理config
    const token = getToken();
    if (token) {
      // jwt token
      config.headers.Authorization = token;
    }
    return config;
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (error: any) => {
    const errInfo: Partial<ErrorInfo> = {
      message: error.message,
      type: ErrorTypeEnum.AJAX,
    };
    if (error.response) {
      const {
        config: { url = '', data: params = '', method = 'get', headers = {} } = {},
        data = {},
      } = error.response;
      errInfo.url = url;
      errInfo.name = 'Ajax Error!';
      errInfo.file = '-';
      errInfo.stack = JSON.stringify(data);
      errInfo.detail = JSON.stringify({ params, method, headers });
    }
    errorStore.commitErrorInfoState(errInfo as ErrorInfo);
    const { response, code, message } = error || {};
    const msg: string =
      response && response.data && response.data.error ? response.data.error.message : '';
    const err: string = error.toString();
    try {
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        createMessage.error('接口请求超时,请刷新页面重试!');
        return;
      }
      if (err && err.includes('Network Error')) {
        createErrorModal({
          title: '网络异常',
          content: '请检查您的网络连接是否正常!',
        });
        return;
      }
    } catch (error) {
      throw new Error(error);
    }
    checkStatus(error.response && error.response.status, msg);
    return error;
  },
};

const axios = new VAxios({
  timeout: 10 * 1000,
  // 基础接口地址
  // baseURL: globSetting.apiUrl,
  // 接口可能会有通用的地址部分，可以统一抽取出来
  prefixUrl: prefix,
  headers: { 'Content-Type': ContentTypeEnum.JSON },
  // 数据处理方式
  transform,
  // 配置项，下面的选项都可以在独立的接口请求中覆盖
  requestOptions: {
    // 默认将prefix 添加到url
    joinPrefix: true,
    // 需要对返回数据进行处理
    isTransformRequestResult: true,
    // post请求的时候添加参数到url
    joinParamsToUrl: false,
    // 格式化提交参数时间
    formatDate: true,
    // 消息提示类型
    errorMessageMode: 'none',
    // 接口地址
    apiUrl: globSetting.apiUrl,
  },
});

export default axios;
