import { useI18n } from '@/hooks/web/useI18n';
import { Account } from '@/ApiModel/system/accountModel';
import { getRole } from '@/api/system/roles';
import { FormSchema } from '@/components/Form';
import { YN } from '@/enums/YN';

const { t } = useI18n();

export type ActionKey = 'create' | 'edit';
export const getFormSchema: (actionKey?: ActionKey, account?: Account) => FormSchema[] = (
  actionKey,
  account,
) => {
  if (!actionKey) return [];
  return [
    {
      field: 'username',
      label: t('system.account.username'),
      component: 'Input',
      componentProps: {
        disabled: actionKey !== 'create',
        placeholder: t('system.account.rules.username'),
      },
      rules: [
        {
          required: actionKey === 'create',
          message: t('system.account.rules.username'),
        },
      ],
      colProps: { span: 24 },
    },
    {
      field: 'password',
      label: t('system.account.password'),
      component: 'InputPassword',
      componentProps: {
        placeholder: t('system.account.rules.password'),
        autocomplete: 'autocomplete',
      },
      rules: [
        {
          required: true,
          min: 6,
          max: 20,
          message: t('system.account.rules.password'),
        },
      ],
      colProps: { span: 24 },
      ifShow: actionKey === 'create',
    },
    {
      field: 'confirm_password',
      label: t('system.account.confirm_password'),
      component: 'InputPassword',
      componentProps: {
        placeholder: t('system.account.rules.confirm_password3'),
        autocomplete: 'autocomplete',
      },
      dynamicRules: ({ values }) => {
        return [
          {
            required: true,
            validator: (_, value) => {
              if (!value) {
                return Promise.reject(t('system.account.rules.confirm_password1'));
              }
              if (value !== values.password) {
                return Promise.reject(t('system.account.rules.confirm_password2'));
              }
              return Promise.resolve();
            },
          },
        ];
      },
      colProps: { span: 24 },
      ifShow: actionKey === 'create',
    },
    {
      field: 'roleIds',
      label: t('system.role.role'),
      component: 'ApiSelect',
      componentProps: () => {
        return {
          api: getRole,
          showSearch: true,
          filterOption: false,
          mode: 'multiple',
          maxTagCount: 2,
          labelField: 'name',
          valueField: 'id',
          searchField: 'name',
          placeholder: t('system.account.rules.role'),
          checkedOptions: account?.roles,
        };
      },
      dynamicRules: () => {
        return [
          {
            required: true,
            message: t('system.account.rules.role'),
            trigger: 'blur',
          },
        ];
      },
      colProps: { span: 24 },
    },
    // {
    //   field: 'platformAdmin',
    //   label: '允许登录管理平台',
    //   component: 'RadioGroup',
    //   componentProps: {
    //     options: [
    //       { value: YN.Y, label: '是' },
    //       { value: YN.N, label: '否' },
    //     ],
    //   },
    //   colProps: { span: 24 },
    // },
    // {
    //   field: 'platformWx',
    //   label: '允许登录微信小程序',
    //   component: 'RadioGroup',
    //   componentProps: {
    //     options: [
    //       { value: YN.Y, label: '是' },
    //       { value: YN.N, label: '否' },
    //     ],
    //   },
    //   colProps: { span: 24 },
    // },
    // {
    //   field: 'platform',
    //   label: '平台',
    //   component: 'CheckboxGroup',
    //   componentProps: {
    //     options: [
    //       { value: 'admin', label: '管理平台' },
    //       { value: 'wx', label: '微信小程序' },
    //     ],
    //   },
    //   colProps: { span: 24 },
    // },
    {
      field: 'enabled',
      label: t('common.enableText'),
      component: 'RadioGroup',
      componentProps: {
        options: [
          { value: YN.Y, label: '启用' },
          { value: YN.N, label: '禁用' },
        ],
      },
      defaultValue: 'Y',
      colProps: { span: 24 },
      ifShow: actionKey === 'create',
    },
    {
      field: 'name',
      label: t('system.account.name'),
      component: 'Input',
      colProps: { span: 24 },
    },
    {
      field: 'phone',
      label: '手机号',
      component: 'Input',
      rules: [
        {
          pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
          message: '请输入正确的手机号',
        },
      ],
      colProps: { span: 24 },
    },
    {
      field: 'email',
      label: t('system.account.email'),
      component: 'Input',
      colProps: { span: 24 },
    },
    {
      field: 'note',
      label: t('common.noteText'),
      component: 'InputTextArea',
      componentProps: {
        autoSize: { minRows: 4 },
      },
      colProps: { span: 24 },
    },
  ];
};
