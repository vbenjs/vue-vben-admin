// config.ts
import { h, reactive, ref, watch, shallowRef, computed, markRaw } from 'vue';
import { NTag, NButton, NUpload } from 'naive-ui';
import { imgUrl } from '#/utils/imgUrl';
import { useVbenForm } from '#/adapter/form';
import { useVbenModal } from '@vben/common-ui';
import { z } from '#/adapter/form';
import {
  editSystemUserInfo,
  addSystemUser,
  deleteSystemUser,
} from '#/api/core/system/user';
import { dialog, message } from '#/adapter/naive';
import md5 from 'js-md5';
import { useAccessStore } from '@vben/stores';

// 拼接请求头
const BaseIURL = import.meta.env.VITE_BASE_API;
const UploadImgUrl = import.meta.env.VITE_UPLOAD_IMG_URL;

// 创建 Modal 的工厂函数
export const createModalConfig = () => {
  const [Modal, modalApi] = useVbenModal();

  return {
    Modal,
    modalApi,
  };
};

// 单条数据
let itemData = reactive({
  avatar_id: '',
  avatar_url: '',
});

// 创建表格配置的工厂函数
export const createTableColumns = (
  modalApi: any,
  formApi: any,
  config: any,
) => {
  const { init } = config;

  let pagination = reactive({
    page: 1,
    pageSize: 10,
    itemCount: 0, // 总条数会在 init 中动态设置
    showSizePicker: true,
    pageSizes: [10, 20, 50, 100],
    onChange: (page: number) => {
      pagination.page = page;
      init(); // 会从外部 reactive 的 queryParams 取值
    },
    onUpdatePageSize: (pageSize: number) => {
      pagination.pageSize = pageSize;
      pagination.page = 1;
      init();
    },
  });

  const TableColumns = setTableColumns(modalApi, formApi, config);

  return {
    TableColumns,
    pagination,
  };
};

// 创建表单配置的工厂函数
export const createBaseForm = (modalApi: any, config: any) => {
  const { init, fromConfig } = config;

  // 动态 schema
  const FromFields = shallowRef();

  // 提交函数
  const onSubmit = async (values: Record<string, any>) => {
    if (fromConfig.isAdd) {
      let POSTDATA = Object.assign({}, values);
      POSTDATA.password = md5(values.password);
      fromConfig.submitting = true;
      const result = await addSystemUser(POSTDATA);
      if (result.code == 200) {
        message.success('系统用户已添加');
        config.init();
        modalApi.close();
      }
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
      FromFields.value = setFromFields(isAdd, formApi);
    },
    { immediate: true },
  );

  return { BaseForm, formApi };
};

// 创建查询表单
export const createQueryForm = (config: any) => {
  const { init } = config;
  const [QueryForm, queryFormApi] = useVbenForm({
    schema: [
      {
        component: 'Input',
        fieldName: 'nickname',
        label: '昵称',
        componentProps: {
          placeholder: '请输入昵称',
          clearable: true,
        },
      },
      {
        component: 'Input',
        fieldName: 'telephone',
        label: '电话',
        componentProps: {
          placeholder: '请输入电话',
          clearable: true,
        },
      },
      {
        component: 'Input',
        fieldName: 'mailbox',
        label: '邮箱',
        componentProps: {
          placeholder: '请输入邮箱',
          clearable: true,
        },
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
        label: '状态',
      },
    ],
    commonConfig: {
      componentProps: {
        class: 'w-full',
      },
    },
    // showCollapseButton: true,
    // collapsed: true,
    layout: 'inline',
    submitButtonOptions: {
      content: '查询',
    },
    handleSubmit: (value) => {
      init(value);
    },
    handleReset: async () => {
      queryFormApi.resetForm();
      init({}, true);
    },
    wrapperClass:
      'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2',
  });
  return { QueryForm, queryFormApi };
};

// 设置表格列
function setTableColumns(modalApi: any, formApi: any, config: any) {
  return [
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
        // 返回一个包含两个按钮的容器
        return h('div', { style: { display: 'flex', gap: '8px' } }, [
          h(
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
                Object.assign(itemData, item);
                formApi.setValues(itemData);
              },
            },
            { default: () => '编辑信息' },
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'error', // 按钮类型（错误色，区分编辑）
              tertiary: true,
              round: true,
              onClick: () => {
                dialog.error({
                  title: '确认删除',
                  content: `您确定要删除用户 ${item.nickname} 吗？`,
                  positiveText: '确定',
                  negativeText: '取消',
                  onPositiveClick: async () => {
                    const result = await deleteSystemUser({ id: item.id });
                    if (result.code !== 200) {
                      message.error('删除用户失败');
                      return;
                    } else {
                      message.success('用户已删除');
                      setTimeout(() => {
                        config.init(); // 重新加载数据
                      }, 1000);
                      // config.init();
                    }
                  },
                });
              },
            },
            { default: () => '删除' }, // 按钮文字
          ),
        ]);
      },
    },
  ];
}
// 动态设置表单字段
function setFromFields(status: boolean, formApi: any) {
  const accessStore = useAccessStore();
  // 创建响应式头像URL
  const AVATARURL = ref('');

  // 在新增模式下，不监听itemData变化，直接设置为空
  if (status) {
    // 新增模式，头像URL为空
    AVATARURL.value = '';
  } else {
    // 编辑模式，监听itemData变化
    watch(
      itemData,
      (newData: any) => {
        AVATARURL.value = imgUrl(newData.avatar_url || '');
      },
      { immediate: true },
    );
  }

  const FromFields = [
    {
      component: markRaw(NUpload),
      componentProps: computed(() => ({
        action: BaseIURL + UploadImgUrl,
        listType: 'image-card',
        max: 1,
        accept: 'image/*',
        showPreviewButton: false,
        headers: {
          authorization: accessStore.accessToken,
        },
        data: {
          module: 'admin',
        },
        name: 'file',
        defaultFileList: AVATARURL.value
          ? [
              {
                id: 'current-avatar',
                name: '头像',
                status: 'finished',
                url: AVATARURL.value,
              },
            ]
          : [],
        onFinish: ({ file, event }: any) => {
          const response = JSON.parse(event?.target?.response);
          if (response.code === 200) {
            const { data } = response;
            itemData.avatar_url = data.img_path;
            itemData.avatar_id = data.id;
            formApi.setFieldValue('avatar_url', data.img_path);
            formApi.setFieldValue('avatar_id', data.id);
            message.success('头像上传成功');
          } else {
            message.error(response.message || '头像上传失败');
          }
        },
      })),
      fieldName: 'avatar_url',
      label: '头像',
      rules: z.string(),
    },
    {
      component: 'Input',
      componentProps: { placeholder: '请输入用户昵称' },
      fieldName: 'nickname',
      label: '昵称',
      rules: z
        .string()
        .min(2, { message: '昵称长度不能少于两个字符' })
        .max(20, { message: '昵称长度不能多余20个字符' }),
      defaultValue: '银河以西',
    },
    {
      component: 'Input',
      componentProps: { placeholder: '请输入用户邮箱' },
      fieldName: 'mailbox',
      label: '邮箱',
      rules: z.string().email({ message: '请输入有效的邮箱地址' }),
      defaultValue: '1145523637@qq.com',
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
      defaultValue: '15581330087',
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
        rules: z
          .string()
          .min(2, { message: '账号长度不能小于2' })
          .max(20, { message: '账号长度不能大于20' }),
        defaultValue: 'yinheyixi',
      },
      {
        component: 'Input',
        componentProps: { placeholder: '请输入密码', type: 'password' },
        fieldName: 'password',
        label: '密码',
        rules: z
          .string()
          .min(6, { message: '密码至少6位' })
          .max(20, { message: '密码不能超过20位' }),
        defaultValue: '123456',
      },
      {
        component: 'Input',
        componentProps: { placeholder: '请再次输入密码', type: 'password' },
        fieldName: 'confirmPassword',
        label: '确认密码',
        rules: z.string().refine(
          async (confirmPassword) => {
            const { password } = await formApi.getValues();
            return confirmPassword === password;
          },
          {
            message: '两次输入的密码不一致',
          },
        ),
        defaultValue: '123456',
      },
    );
  }
  return FromFields;
}
