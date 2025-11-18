<script setup lang="ts">
import { watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElButton, ElMessage } from 'element-plus';

import { useVbenForm, z } from '#/adapter/form';
import {
  createUserApi,
  getRoleListApi,
  getUserDetailApi,
  updateUserApi,
} from '#/api/core/user';

const [Drawer, drawerApi] = useVbenDrawer();

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
  },
  layout: 'horizontal',
  scrollToFirstError: true,
  schema: [
    {
      component: 'Input',
      componentProps: { placeholder: '请输入用户名' },
      fieldName: 'username',
      label: '用户名',
      rules: z.string().min(1, { message: '请输入用户名' }),
    },
    {
      component: 'Input',
      componentProps: { placeholder: '请输入密码' },
      fieldName: 'password',
      label: '密码',
      rules: 'required',
      dependencies: {
        show(values) {
          return values.__mode !== 'edit';
        },
        triggerFields: ['__mode'],
      },
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: '角色1', value: 1 },
          { label: '角色2', value: 2 },
        ],
        placeholder: '请选择角色',
        showSearch: true,
        multiple: true,
      },
      fieldName: 'roleIdList',
      label: '角色',
    },
    {
      component: 'Input',
      componentProps: { placeholder: '请输入头像URL' },
      fieldName: 'avatar',
      label: '头像',
    },
  ],
  showDefaultActions: false,
});

async function submit() {
  const { valid } = await formApi.validate();
  const values = await formApi.getValues();
  if (!valid) return;
  const payload = drawerApi.getData<{
    mode: 'create' | 'edit';
    record?: { id: number };
  }>();
  try {
    await (payload?.mode === 'edit' && payload.record?.id
      ? updateUserApi({
          id: payload.record.id,
          username: values.username,
          password: values.password,
          roleIdList: values.roleIdList || [],
          avatar: values.avatar,
        })
      : createUserApi({
          username: values.username,
          password: values.password,
          roleIdList: values.roleIdList || [],
          avatar: values.avatar,
        }));
    ElMessage.success('保存成功');
    await drawerApi.close();
  } catch {
    ElMessage.error('保存失败');
  }
}

const stateRef = drawerApi.useStore();
watch(
  () => stateRef.value?.isOpen,
  async (isOpen) => {
    if (isOpen) {
      const payload = drawerApi.getData<{
        mode: 'create' | 'edit';
        record?: Record<string, any>;
      }>();
      await formApi.setValues({ __mode: payload?.mode });
      const roleRes = await getRoleListApi();
      const roleData = (roleRes as any)?.data ?? roleRes;
      const roleOptions = Array.isArray(roleData)
        ? roleData.map((item: any) => ({
            label: item.remark ?? item.name,
            value: item.id,
          }))
        : [];
      formApi.updateSchema([
        {
          fieldName: 'roleIdList',
          componentProps: { options: roleOptions },
        } as any,
      ]);
      if (payload?.mode === 'edit') {
        formApi.setState((prev) => {
          const currentSchema = prev?.schema ?? [];
          return {
            schema: currentSchema.filter(
              (s: any) => s.fieldName !== 'password',
            ),
          };
        });
      } else {
        formApi.setState((prev) => {
          const currentSchema = prev?.schema ?? [];
          const hasPwd = currentSchema.some(
            (s: any) => s.fieldName === 'password',
          );
          if (hasPwd) return { schema: currentSchema };
          const pwd = {
            component: 'Input',
            componentProps: { placeholder: '请输入密码' },
            fieldName: 'password',
            label: '密码',
            rules: 'required',
          } as any;
          const idx = currentSchema.findIndex(
            (s: any) => s.fieldName === 'username',
          );
          const next = [...currentSchema];
          if (idx === -1) {
            next.unshift(pwd);
          } else {
            next.splice(idx + 1, 0, pwd);
          }
          return { schema: next };
        });
      }
      if (payload?.mode === 'edit' && payload.record?.id) {
        const res = await getUserDetailApi(payload.record.id);
        const data = (res as any)?.data ?? res;
        await formApi.setValues({
          username: data.username,
          avatar: data.avatar ?? '',
          roleIdList: data.roleIdList ?? [],
        });
      }
      drawerApi.setState({
        title: payload?.mode === 'edit' ? '编辑用户' : '新增用户',
      });
    }
  },
);
</script>

<template>
  <Drawer :footer="false" class="w-[600px]">
    <Form />
    <div class="mt-4 flex justify-end">
      <ElButton class="mr-2" @click="() => drawerApi.close()">取消</ElButton>
      <ElButton type="primary" @click="submit">保存</ElButton>
    </div>
  </Drawer>
</template>
