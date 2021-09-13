import { defHttp } from '/@/utils/http/axios';
import { MathImageVerifyCode } from '/@/api/sys/model/verifyCodeModel';

enum Api {
  MathImage = '/verifyCode/imgMathVerifyCode',
}

/**
 * @description: 获取数学计算图形验证码
 */
export function getMathImageVerifyCode() {
  return defHttp.get<MathImageVerifyCode>({ url: Api.MathImage });
}
