interface BasicOption {
  label: string;
  value: string;
}

type SelectOption = BasicOption;

type TabOption = BasicOption;

interface BasicUserInfo {
  /**
   * 头像
   */
  avatar: string;
  /**
   * 用户id
   */
  id: string;
  /**
   * 用户昵称
   */
  realName: string;
  /**
   * 用户权限数组
   */
  roleIdList: string[];
  /**
   * 用户身份权限列表
   */
  roles?: string[];
  /**
   * 用户名
   */
  username: string;
}

type ClassType = Array<object | string> | object | string;

export type { BasicOption, BasicUserInfo, ClassType, SelectOption, TabOption };
