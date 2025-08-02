// config.ts
import { h, reactive, ref, watch, shallowRef } from 'vue';
import { NTag, NButton } from 'naive-ui';
import { imgUrl } from '#/utils/imgUrl';
import { useVbenForm } from '#/adapter/form';
import { useVbenModal } from '@vben/common-ui';
import { z } from '#/adapter/form';
import { editSystemUserInfo, addSystemUser } from '#/api/core/system/user';
import { message } from '#/adapter/naive';

// 创建 Modal 的工厂函数
export const createModalConfig = () => {
  const [Modal, modalApi] = useVbenModal();

  return {
    Modal,
    modalApi,
  };
};
// 单条数据
let itemData = reactive({});

// 创建表格配置的工厂函数
export const createTableColumns = (
  modalApi: any,
  formApi: any,
  config: any,
) => [
  {
    key: 'id',
    title: 'ID',
  },
  {
    key: 'avatar_url',
    title: '头像',
    render(row: any) {
      return h('img', {
        src: imgUrl(row.avatar_url),
        style: {
          width: '50px',
          height: '50px',
          borderRadius: '50%',
        },
      });
    },
  },
  {
    key: 'nickname',
    title: '昵称',
  },
  {
    key: 'telephone',
    title: '电话',
  },
  {
    key: 'mailbox',
    title: '邮箱',
  },
  {
    key: 'status',
    title: '状态',
    render(row: any) {
      let statusText = '启用';
      let statusColor:
        | 'default'
        | 'error'
        | 'primary'
        | 'success'
        | 'info'
        | 'warning' = 'primary';
      if (row.status) {
        statusText = '启用';
        statusColor = 'primary';
      } else {
        statusText = '禁用';
        statusColor = 'error';
      }
      return h(
        NTag,
        {
          type: statusColor,
          bordered: true,
          strong: true,
        },
        {
          default: () => statusText,
        },
      );
    },
  },
  {
    title: '操作',
    key: 'actions',
    render(item: any) {
      return h(
        NButton,
        {
          size: 'small',
          type: 'success',
          tertiary: true,
          round: true,
          onClick: () => {
            let { fromConfig } = config;
            fromConfig.isAdd = false;
            modalApi.open();
            itemData = Object.assign(itemData, item);
            formApi.setValues(itemData);
          },
        },
        { default: () => '编辑信息' },
      );
    },
  },
];

export const createBaseForm = (modalApi: any, config: any) => {
  const { init, fromConfig } = config;

  // 动态 schema
  const FromFields = shallowRef();

  // 提交函数
  const onSubmit = async (values: Record<string, any>) => {
    if (fromConfig.isAdd) {
      fromConfig.submitting = true;
      await addSystemUser(values);
      message.success('系统用户已添加');
      modalApi.close();
      fromConfig.submitting = false;
    } else {
      const UpdateData = Object.assign(itemData, values);
      fromConfig.submitting = true;
      await editSystemUserInfo(UpdateData);
      message.success('用户信息已更新');
      init();
      modalApi.close();
      fromConfig.submitting = false;
    }
  };

  // 初始化空 schema 给 useVbenForm
  const [BaseForm, formApi] = useVbenForm({
    schema: FromFields,
    handleSubmit: onSubmit,
    commonConfig: {
      componentProps: {
        class: 'w-full',
      },
    },
    layout: 'horizontal',
    wrapperClass: 'grid-cols-1',
  });

  // 监听 isAdd 动态更新 schema
  watch(
    () => fromConfig.isAdd,
    (isAdd) => {
      // 更新 schema
      FromFields.value = setFromFields(isAdd);
    },
    { immediate: true },
  );

  return { BaseForm, formApi };
};

// 动态设置表单字段
function setFromFields(status: boolean) {
  const FromFields = [
    {
      component: 'Input',
      componentProps: { placeholder: '请输入用户昵称' },
      fieldName: 'nickname',
      label: '昵称',
      rules: z.string().min(1, { message: '请输入昵称' }).max(20),
    },
    {
      component: 'Input',
      componentProps: { placeholder: '请输入用户邮箱' },
      fieldName: 'mailbox',
      label: '邮箱',
      rules: z.string().email({ message: '请输入有效的邮箱地址' }),
    },
    {
      component: 'Input',
      componentProps: { placeholder: '请输入用户电话' },
      fieldName: 'telephone',
      label: '电话',
      rules: z
        .string()
        .refine(
          (value) =>
            /^(?:\+86)?1[3-9]\d{9}$|^(?:\+86)?0\d{2,3}-\d{7,8}$/.test(value),
          { message: '请输入有效电话号码' },
        ),
    },
    {
      component: 'Select',
      componentProps: {
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
        placeholder: '请选择用户状态',
        showSearch: true,
      },
      fieldName: 'status',
      label: '账号状态',
      defaultValue: 1,
    },
    {
      component: 'Select',
      componentProps: {
        options: [
          { label: '男', value: 1 },
          { label: '女', value: 0 },
        ],
        placeholder: '请选择性别',
        showSearch: true,
      },
      fieldName: 'gender',
      label: '性别',
      defaultValue: 1,
    },
  ];

  if (status) {
    FromFields.unshift(
      {
        component: 'Input',
        componentProps: { placeholder: '请输入账号' },
        fieldName: 'account',
        label: '账号',
        rules: z.string().min(1, { message: '账号不能为空' }),
      },
      {
        component: 'Input',
        componentProps: { placeholder: '请输入密码', type: 'password' },
        fieldName: 'password',
        label: '密码',
        rules: z.string().min(6, { message: '密码至少6位' }),
      },
      // {
      //   component: 'InputPassword',
      //   componentProps: { placeholder: '请再次输入密码' },
      //   fieldName: 'confirmPassword',
      //   label: '确认密码',
      //   rules: z
      //     .string()
      //     .refine((val) => val === formApi.getValues().password, {
      //       message: '两次输入的密码不一致',
      //     }),
      // },
    );
  }
  return FromFields;
}
