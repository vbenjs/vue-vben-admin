namespace UserApiType {
  /** 登录接口参数 */
  export interface LoginParams {
    password: string;
    username: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
    desc: string;
    realName: string;
    refreshToken: string;
    userId: string;
    username: string;
  }
}

export type { UserApiType };
