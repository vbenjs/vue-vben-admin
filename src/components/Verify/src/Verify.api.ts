import type { ImageCaptchaType } from './typing';
import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

enum Api {
  loadCaptcha = 'public/auth/generateCaptcha',
}

export const loadCaptchaApi = (type: ImageCaptchaType) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_AUTH,
    url: Api.loadCaptcha,
    data: {
      type,
    },
  });
};
