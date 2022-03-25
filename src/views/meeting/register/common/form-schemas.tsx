import registerGroupRender from './register-group-render';
import { getMeetingUserType } from '/@/api/meeting/user-type';
import type { FormSchema } from '/@/components/Form';

const schemas: FormSchema[] = [
  {
    label: '姓名',
    field: 'name',
    component: 'Input',
    required: true,
  },

  {
    label: '单位',
    field: 'company',
    component: 'Input',
    required: true,
  },

  {
    label: '职务/职称',
    field: 'job',
    component: 'Input',
    required: true,
  },

  {
    label: '手机号码',
    field: 'phone',
    component: 'Input',
    required: true,
  },

  {
    label: '电话',
    field: 'telephone',
    component: 'Input',
  },

  {
    label: '邮箱',
    field: 'email',
    component: 'Input',
    required: true,
  },

  {
    label: '参会身份',
    field: 'meeting_user_type_id',
    component: 'ApiSelect',
    componentProps: {
      api: getMeetingUserType,
      resultField: 'data',
      labelField: 'name',
      valueField: 'id',
    },
    required: true,
  },

  {
    label: '同行人',
    field: 'register_groups',
    component: 'Input',
    defaultValue: [],
    render: registerGroupRender,
  },
];

export default schemas;
