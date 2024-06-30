class UserEntity {
  id: number;
  /**
   * 密码
   */
  password: string;
  /**
   * 真实姓名
   */
  realName: string;
  /**
   * 角色
   */
  roles: string[];
  /**
   * 用户名
   */
  username: string;
}

export { UserEntity };
