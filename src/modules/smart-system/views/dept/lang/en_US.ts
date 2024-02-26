/**
 * 部门表 国际化信息
 */
export default {
  trans: true,
  key: 'system.views.dept',
  data: {
    title: {
      deptId: '部门ID',
      parent: 'Parent org',
      deptCode: 'Org code',
      deptType: 'Org type',
      deptName: 'Org name',
      email: 'Email',
      director: 'Director',
      phone: 'Phone',
      baseMessage: 'Basic message',
    },
    validate: {
      deptId: '请输入部门ID',
      parentId: '请输入上级ID',
      deptCode: 'Please enter org code',
      deptType: 'Please select org type',
      deptName: 'Please enter org name',
      email: 'Please enter email',
      director: 'Please enter director',
      phone: 'Please enter phone',
    },
    rules: {
      deptCode_NOT_EMPTY: 'Org code cannot be empty',
      deptType_NOT_EMPTY: 'Please select org type',
      deptName_NOT_EMPTY: 'Org name cannot be empty',
    },
    search: {
      deptCode: 'Please enter org code',
      deptName: 'Please enter org name',
    },
    button: {
      addChild: 'Add child',
    },
    message: {
      selectDeptError: 'Please select parent org',
    },
  },
};
