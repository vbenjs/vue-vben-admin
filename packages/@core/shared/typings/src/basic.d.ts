interface BasicOption {
  label: string;
  value: string;
}

interface SelectOption extends BasicOption {}

interface TabsOption extends BasicOption {}

interface BasicUserInfo {
  /**
   * 头像
   */
  avatar: string;
  /**
   * 用户昵称
   */
  realName: string;
  /**
   * 用户角色
   */
  roles?: string[];
  /**
   * 用户id
   */
  userId: string;
  /**
   * 用户名
   */
  username: string;
}

export type { BasicOption, BasicUserInfo, SelectOption, TabsOption };
