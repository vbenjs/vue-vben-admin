<script setup lang="ts">
import type { UpdateMenuParams } from '#/api/core/menu';

import { ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { useVbenForm, z } from '#/adapter/form';
import { ListType, updateMenuApi } from '#/api/core/menu';

const data = ref();

const [Modal, modelApi] = useVbenModal({
  draggable: true,
  animationType: 'scale',
  fullscreenButton: false,
  appendToMain: true,
  openAutoFocus: true,
  footer: false,
  onOpenChange: (isOpen: boolean) => {
    if (isOpen) {
      const { $other, ...params } = modelApi.getData();
      data.value = {
        ...params,
        ...$other,
      };
      // 设置表单值
      formApi.setValues(
        {
          ...params,
          prefixUrl: $other?.prefixUrl,
        },
        false,
        true,
      );
    }
  },
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  // 表单验证失败时是否自动滚动到第一个错误字段
  scrollToFirstError: true,
  layout: 'horizontal',
  actionLayout: 'inline',
  actionPosition: 'center',
  submitButtonOptions: {
    content: '确认',
  },
  schema: [],
});

function updateForm(
  type: Omit<keyof typeof ListType, 'all'>,
  behavior: 'add' | 'edit',
) {
  const behaviorMap = new Map<
    string,
    { behavior: Record<string, any>; schema: any[] }
  >([
    [
      'button,add',
      {
        schema: [],
        behavior: {},
      },
    ],
    [
      'button,edit',
      {
        schema: [],
        behavior: {},
      },
    ],
    [
      'menu,add',
      {
        schema: [],
        behavior: {},
      },
    ],
    [
      'menu,edit',
      {
        schema: [
          {
            component: 'Input',
            componentProps: {
              placeholder: '请输入菜单名称',
            },
            fieldName: 'name',
            label: '菜单名称',
            rules: 'required',
          },
          {
            component: 'Input',
            componentProps: {
              placeholder: '请输入菜单路径',
            },
            renderComponentContent: (val: Record<string, string>) => {
              const { prefixUrl } = val;
              return {
                prefix: () => {
                  return prefixUrl === '' ? '' : `${prefixUrl}/`;
                },
              };
            },
            fieldName: 'url',
            label: '菜单路径',
            rules: 'required',
          },
          {
            component: 'InputNumber',
            fieldName: 'sort',
            label: '排序',
            defaultValue: 0,
            rules: z.number().min(0, { message: '请输入大于等于0的整数' }),
          },
        ],
        behavior: {
          handleSubmit: (values: Record<string, string>) => {
            const { prefixUrl: _, ...submitParams } = values;
            formApi.setState({
              submitButtonOptions: {
                loading: true,
              },
            });
            updateMenuApi(submitParams as UpdateMenuParams)
              .then(() => {
                ElMessage.success('修改菜单信息成功');
                modelApi.close();
              })
              .finally(() => {
                formApi.setState({
                  submitButtonOptions: {
                    loading: false,
                  },
                });
              });
          },
        },
      },
    ],
  ]);
  // 1. 修改schema
  // 2. 修改提交的api
  formApi.setState((prev) => {
    const { schema: _, ...original } = prev;
    const conf = behaviorMap.get([type, behavior].join(','));
    const options = conf?.behavior;
    return {
      ...original,
      schema: conf?.schema,
      ...options,
    };
  });
}

watch(
  () => data.value,
  (cur) => {
    const { behavior, ...params } = cur ?? {};
    updateForm(ListType[params.type] as any, behavior);
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <Modal>
    <Form />
  </Modal>
</template>

<style scoped lang="scss"></style>
