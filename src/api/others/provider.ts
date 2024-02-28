import { defHttp } from '@/utils/http/axios';

enum Api {
  provider = '/js/hx_template_data.js',
}
type TemplateType = 'Bill' | 'Box' | 'Pallet';
export const getProvider = async (type: TemplateType = 'Box') => {
  const { data } = await defHttp.get({ url: Api.provider }, { isReturnNativeResponse: true });
  const str = data + `return hxTemplateData${type}`;
  const func = new Function(str);
  return func() as any[];
};
