/**
 * 系统管理表 国际化信息
 */
export default {
  trans: true,
  key: 'system.views.system',
  data: {
    title: {
      id: 'id',
      code: '系统编码',
      name: '系统名称',
      enterprise: '所属公司',
      version: '系统版本',
      createBy: 'createBy',
      updateBy: 'updateBy',
    },
    validate: {
      id: '请输入',
      code: '请输入系统编码',
      name: '请输入系统名称',
      enterprise: '请输入所属公司',
      version: '请输入系统版本',
    },
    rules: {
      code_NOT_EMPTY: '请输入系统编码',
      name_NOT_EMPTY: '请输入系统名称',
    },
    search: {
      code: '请输入系统编码',
      name: '请输入系统名称',
    },
    button: {
      setUser: '设置人员',
    },
  },
};
