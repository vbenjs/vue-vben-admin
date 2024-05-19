interface RoleInfo {
  /** 角色名 */
  roleName: string;
  /** 角色值 */
  value: string;
}

/** 用户信息 */
interface UserInfo {
  /**
   * 头像
   */
  avatar: string;
  /**
   * 用户描述
   */
  desc: string;
  /**
   * 首页地址
   */
  homePath: string;
  /**
   * 用户昵称
   */
  realName: string;
  /**
   * 用户角色信息
   */
  roles: RoleInfo[];
  /**
   * accessToken
   */
  token: string;
  /**
   * 用户id
   */
  userId: string;
  /**
   * 用户名
   */
  username: string;
}

export type { RoleInfo, UserInfo };
