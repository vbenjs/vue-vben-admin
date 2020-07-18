import http from '@/utils/http/axios';
import { WokbAllRsltModel } from './model/wokbModel';

enum Api {
  WokbAllData = '/wokb/allData',
}
/**
 * @description: 产品数量
 */
export function wokbAllDataApi() {
  return http.request<WokbAllRsltModel>(
    {
      url: Api.WokbAllData,
      method: 'POST',
    },
    {
      // 登陆接口不加 /v1.0
      joinPrefix: false,
    }
  );
}
