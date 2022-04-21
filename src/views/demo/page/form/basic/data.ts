import { FormSchema } from '/@/components/Form';
const colProps = {
  span: 8,
};

export const schemas: FormSchema[] = [
  {
    field: 'title',
    component: 'Input',
    label: '标题',
    colProps,
    componentProps: {
      placeholder: '给目标起个名字',
    },
    required: true,
  },
  {
    field: 'time',
    component: 'RangePicker',
    label: '起止日期',
    colProps,
    required: true,
  },
  {
    field: 'client',
    component: 'Input',
    colProps,
    label: '客户',
    helpMessage: '目标的服务对象',
    subLabel: '( 选填 )',
    componentProps: {
      placeholder: '请描述你服务的客户，内部客户直接 @姓名／工号',
    },
  },
  {
    field: 'weights',
    component: 'InputNumber',
    label: '权重',
    colProps,
    subLabel: '( 选填 )',
    componentProps: {
      formatter: (value: string) => (value ? `${value}%` : ''),
      parser: (value: string) => value.replace('%', ''),
      placeholder: '请输入',
    },
  },
  {
    field: 'target',
    component: 'InputTextArea',
    label: '目标描述',
    colProps,
    componentProps: {
      placeholder: '请输入你的阶段性工作目标',
      rows: 4,
    },
    required: true,
  },
  {
    field: 'metrics',
    component: 'InputTextArea',
    label: '衡量标准',
    colProps,
    componentProps: {
      placeholder: '请输入衡量标准',
      rows: 4,
    },
    required: true,
  },

  {
    field: 'inviteer',
    component: 'Input',
    label: '邀评人',
    colProps: {
      span: 8,
    },
    subLabel: '( 选填 )',
    componentProps: {
      placeholder: '请直接 @姓名／工号，最多可邀请 5 人',
    },
  },
  {
    field: 'disclosure',
    component: 'RadioGroup',
    label: '目标公开',
    colProps: {
      span: 16,
    },
    itemProps: {
      extra: '客户、邀评人默认被分享',
    },
    componentProps: {
      options: [
        {
          label: '公开',
          value: '1',
        },
        {
          label: '部分公开',
          value: '2',
        },
        {
          label: '不公开',
          value: '3',
        },
      ],
    },
  },
  {
    field: 'disclosure',
    component: 'Select',
    label: ' ',
    colProps: {
      span: 8,
    },
    show: ({ model }) => {
      return model.disclosure === '2';
    },
    componentProps: {
      placeholder: '公开给',
      mode: 'multiple',
      options: [
        {
          label: '同事1',
          value: '1',
        },
        {
          label: '同事2',
          value: '2',
        },
        {
          label: '同事3',
          value: '3',
        },
      ],
    },
  },
];
