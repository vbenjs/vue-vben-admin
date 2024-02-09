import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

enum Api {
  list = '/smart/message/messageSend/pageCurrentUserMessage',
  markAsRead = '/smart/message/messageSend/markAsRead',
}

export const pageCurrentUserMessageApi = (data) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_MESSAGE,
    url: Api.list,
    data,
  });
};

export const markAsReadApi = (data) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_MESSAGE,
    url: Api.markAsRead,
    data,
  });
};
