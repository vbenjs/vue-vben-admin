import { defHttp } from '/@/utils/http/axios';

enum Api {
  EmailConfig = '/tools/email/config',
  SendEmail = '/tools/email',
}

export const getEmailConfig = () => defHttp.get({ url: Api.EmailConfig });

export const saveEmailConfig = (params) => defHttp.post({ url: Api.EmailConfig, params });

export const sendEmail = (params) =>
  defHttp.post({ url: Api.SendEmail, params }, { successMessageMode: 'message' });
