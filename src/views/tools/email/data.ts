import { h } from 'vue';
import { FormSchema } from '/@/components/Form/index';
import { Tinymce } from '/@/components/Tinymce/index';

export interface ListItem {
  key: string;
  title: string;
  description: string;
  extra?: string;
  avatar?: string;
  color?: string;
}

// 邮箱设置 form
export const baseSetschemas: FormSchema[] = [
  {
    field: 'from',
    component: 'Input',
    label: '发件人邮箱',
    helpMessage: '发件人，一般为邮箱账号',
    colProps: { span: 18 },
  },
  {
    field: 'user',
    component: 'Input',
    label: '发件用户名',
    helpMessage: '用户名，默认为发件人邮箱前缀',
    colProps: { span: 18 },
  },
  {
    field: 'password',
    component: 'InputPassword',
    label: '邮箱密码',
    helpMessage: '密码（注意，某些邮箱需要为SMTP服务单独设置密码，如QQ和163等等）',
    colProps: { span: 18 },
    required: true,
  },
  {
    field: 'host',
    component: 'Input',
    label: 'SMTP地址',
    helpMessage: '邮件服务器的SMTP地址，可选，默认为smtp',
    colProps: { span: 18 },
  },
  {
    field: 'port',
    component: 'Input',
    label: 'SMTP端口',
    helpMessage: '邮件服务器的SMTP端口，可选，默认465或者25',
    colProps: { span: 18 },
  },
];

// 邮箱设置 form
export const sendSchemas: FormSchema[] = [
  {
    field: 'subject',
    component: 'Input',
    label: '邮件标题',
    required: true,
    colProps: { md: 18 },
  },
  {
    field: 'to',
    component: 'Input',
    label: '收件邮箱',
    helpMessage: '多个地址英文逗号,隔开',
    componentProps: {
      placeholder: '请输入邮箱地址,多个地址英文逗号,隔开',
    },
    required: true,
    colProps: { md: 18 },
  },
  {
    field: 'content',
    component: 'Input',
    label: '正文',
    colProps: { md: 18 },
    render: ({ model, field }) => {
      return h(Tinymce, {
        value: model[field],
        onChange: (value: string) => {
          model[field] = value;
        },
      });
    },
  },
];
