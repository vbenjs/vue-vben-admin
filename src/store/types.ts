export interface LockInfo {
  pwd: string | undefined;
  isLock: boolean;
}

export interface UserInfo {
  // 用户id
  userId: string | number;
  // 用户名
  username: string;
  // 真实名字
  realName: string;
  // 介绍
  desc?: string;
}
