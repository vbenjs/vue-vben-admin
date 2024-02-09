/**
 * 部门表 国际化信息
 */
export default {
  trans: true,
  key: 'system.views.dept',
  data: {
    title: {
      deptId: '部门ID',
      parent: '上级组织',
      deptCode: '组织编码',
      deptType: '组织类型',
      deptName: '组织名称',
      email: '邮箱',
      director: '负责人',
      phone: '电话',
      baseMessage: '基本信息',
    },
    validate: {
      deptId: '请输入部门ID',
      parentId: '请输入上级ID',
      deptCode: '请输入组织编码',
      deptType: '请输入组织类型',
      deptName: '请输入组织名称',
      email: '请输入邮箱',
      director: '请输入负责人',
      phone: '请输入电话',
      deleteYn: '请输入删除状态',
      createUserId: '请输入创建人ID',
      createTime: '请输入创建时间',
      updateUserId: '请输入更新人员ID',
      updateTime: '请输入更新时间',
    },
    rules: {
      deptCode_NOT_EMPTY: '组织编码不能为空',
      deptType_NOT_EMPTY: '请选择组织类型',
      deptName_NOT_EMPTY: '请输入组织名称',
    },
    search: {
      deptCode: '请输入组织编码',
      deptName: '请输入组织名称',
    },
    button: {
      addChild: '添加下级',
    },
    message: {
      selectDeptError: '请选择上级组织',
    },
  },
};
