import { defHttp } from '@/utils/http/axios';

enum Api {
  file = '/lib/bar_rule.md',
  pda = '/lib/pda_rule.md',
  verify = '/lib/bar_verify_rule.md',
}
export const getBarRuleMakedown = async () => {
  const { data } = await defHttp.get({ url: Api.file }, { isReturnNativeResponse: true });
  return data;
};

export const getPdaMakedown = async () => {
  const { data } = await defHttp.get({ url: Api.pda }, { isReturnNativeResponse: true });
  return data;
};

export const getBarVerifyMakedown = async () => {
  const { data } = await defHttp.get({ url: Api.verify }, { isReturnNativeResponse: true });
  return data;
};
