import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Login = '/oauth2/token',
  Logout = '/logout',
  GetUserInfo = '/core/auth/user/getUserDetail',
  GetPermCode = '/getPermCode',
}
/**
 * @description: user login api
 */

export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return new Promise<LoginResultModel>((resolve, reject) => {
    defHttp
      .post(
        {
          url: Api.Login,
          params: params,
          headers: {
            Authorization:
              'Basic ' + window.btoa('hdcloud-jrtjxt:A59C750196EBF43F696B58667068C452'),
            'Content-Type': ContentTypeEnum.FORM_URLENCODED,
          },
        },
        {
          errorMessageMode: mode,
          isTransformResponse: false,
          withToken: false,
          joinPrefix: false,
        },
      )
      .then((res) => {
        if (res.access_token) {
          resolve(res);
        } else {
          reject(new Error(res?.msg || ''));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout(params) {
  return defHttp.get({ url: Api.Logout, params }, { joinPrefix: false });
}
