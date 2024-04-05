/**
 * 租户产品套餐 国际化信息
 */
export default {
  trans: true,
  key: 'system.views.tenant.package',
  data: {
    title: {
      packageCode: '产品包编码',
      packageName: '产品包名',
      effectTime: '生效时间',
      expireTime: '过期时间',
      createBy: 'createBy',
      updateBy: 'updateBy',
      deleteKey: 'deleteKey',
      deleteTime: 'deleteTime',
      deleteBy: 'deleteBy',
      deleteUserId: 'deleteUserId',
      setFunction: '套餐功能',
    },
    validate: {
      packageCode: '请输入产品包编码',
      packageName: '请输入产品包名',
      effectTime: '请输入生效时间',
      expireTime: '请输入过期时间',
    },
    rules: {},
    search: {
      packageCode: '请输入产品包编码',
      packageName: '请输入产品包名',
      effectTime: '请输入生效时间',
      expireTime: '请输入过期时间',
    },
    message: {
      chosePackage: '请先选择租户套餐',
      saveFunctionSuccess: '设置菜单成功',
    },
  },
};
