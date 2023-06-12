import { defHttp } from '/@/utils/http/axios';
import { LoveChatModel, CreateChatModel } from './model/lovechatModel';

enum Api {
  OPTIONS_LIST = '/lv/chat',
}

/**
 * @description: Get sample options value
 */
export const createChatApi = (params?: CreateChatModel) =>
  defHttp.post<void>( { 
    url: Api.OPTIONS_LIST, 
    data: params 
  });