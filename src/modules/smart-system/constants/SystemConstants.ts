/**
 * 用户的权限信息
 */
export const SystemPermissions = {
  user: {
    add: 'sys:user:save',
    delete: 'sys:user:delete',
    update: 'sys:user:update',
    setRole: 'sys:user:setRole',
    useYn: 'sys:user:setUseYn',
    createAccount: 'sys:account:add',
    unlockUserAccount: 'sys:user:unlockUserAccount',
    unlockPassword: 'sys:user:resetPassword',
  },
  role: {
    add: 'sys:role:save',
    delete: 'sys:role:delete',
    update: 'sys:role:update',
    setRoleUser: 'sys:role:setRoleUser',
    setFunction: 'sys:role:setFunction',
  },
  userGroup: {
    add: 'sys:userGroup:save',
    delete: 'sys:userGroup:delete',
    update: 'sys:userGroup:update',
    setUser: 'sys:userGroup:setUser',
    useYn: 'sys:userGroup:useYn',
  },
  function: {
    add: 'sys:function:save',
    delete: 'sys:function:delete',
    update: 'sys:function:update',
  },
  i18n: {
    add: 'sys:i18n:save',
    delete: 'sys:i18n:delete',
    update: 'sys:i18n:update',
    reload: 'sys:i18n:reload',
  },
  auth: {
    offline: 'sys:auth.offline',
  },
};

/**
 * 系统用户标识
 */
export const SYS_USER_TYPE = 'SYSTEM_USER';

/**
 * 数据权限
 */
export const DATA_SCOPE = [
  { key: 'DATA_ALL', value: 'system.views.user.title.dataAll' },
  { key: 'DATA_DEPT', value: 'system.views.user.title.dataDept' },
  { key: 'DATA_DEPT_AND_CHILD', value: 'system.views.user.title.dataDeptAll' },
  { key: 'DATA_PERSONAL', value: 'system.views.user.title.dataPersonal' },
];
