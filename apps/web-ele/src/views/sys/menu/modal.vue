<script setup lang="ts">
import type { MenuData, UpdateMenuParams } from '#/api/core/menu';

import { h, onUnmounted, ref, unref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { useVbenForm, z } from '#/adapter/form';
import { appendMenuApi, ListType, updateMenuApi } from '#/api/core/menu';

import { getFullPath } from './index';

const formValues = ref<Record<string, any>>();
const formParams = ref<Record<string, any>>({
  // 行为
  behavior: '',
  // 路径前缀
  prefixUrl: '',
  // 树形选择器缓存数据
  treeCache: [],
});

const [Modal, modelApi] = useVbenModal({
  draggable: true,
  animationType: 'scale',
  fullscreenButton: false,
  appendToMain: true,
  openAutoFocus: true,
  footer: false,
  onOpenChange: (isOpen: boolean) => {
    if (isOpen) {
      const { $, ...params } = modelApi.getData();
      formValues.value = { ...params };
      formParams.value = { ...$ };
      // 设置表单值
      formApi.setValues(
        {
          ...params,
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
    { behavior: Record<string, (...args: any[]) => any>; schema: any[] }
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
        schema: [
          {
            component: 'TreeSelect',
            label: '上级菜单',
            fieldName: 'pid',
            checkStrictly: false,
            componentProps: {
              clearable: true,
              filterable: true,
              accordion: true,
              checkStrictly: true,
              placeholder: '请输入上级菜单（不输入则为根菜单）',
              props: {
                label: 'name',
                children: 'children',
                value: 'id',
              },
              filterNodeMethod: (
                value: string,
                data: { [K: string]: any; name: string },
              ) => {
                return data.name.includes(value);
              },
              // 下拉选项
              data: unref(formParams)?.treeCache,
              onChange: (val: string) => {
                // 根据 id 获取完整路径
                const result = getFullPath({
                  id: Number(val),
                  data: formParams.value?.treeCache,
                  options: {
                    extractVal: 'url',
                    returnVal: 'result',
                  },
                });
                formParams.value.prefixUrl = result;
              },
            },
          },
          {
            component: 'Input',
            componentProps: {
              placeholder: '请输入菜单名称',
            },
            fieldName: 'name',
            label: '菜单名称',
            rules: z
              .string()
              .min(2, { message: '请输入至少两个字符作为菜单名称' }),
          },
          {
            component: 'Input',
            fieldName: 'url',
            label: '菜单路径',
            componentProps: {
              placeholder: '请输入菜单路径',
            },
            renderComponentContent: () => ({
              prefix: () => {
                const { prefixUrl } = formParams.value;
                let content = prefixUrl || '';
                content = content.slice(-1) === '/' ? content : `${content}/`;
                return h('span', { class: 'text-blue-600/75' }, content);
              },
            }),
            rules: z.string().regex(/^\w+$/, {
              message: '只能包含字母、数字或下划线，且至少一个字符',
            }),
          },
          {
            component: 'InputNumber',
            fieldName: 'sort',
            label: '排序',
            defaultValue: 0,
            rules: z.number().min(0, { message: '请输入大于等于0的整数' }),
          },
          {
            component: 'IconPicker',
            componentProps: {
              placeholder: '请输入图标字符串',
            },
            fieldName: 'icon',
            label: '图标',
            defaultValue: '',
          },
        ],
        behavior: {
          handleSubmit: (
            values: Pick<
              MenuData,
              'icon' | 'name' | 'pid' | 'sort' | 'type' | 'url'
            >,
          ) => {
            const { ...params } = values;
            // console.log('💬 ⋮ updateForm ⋮ params =>', params);

            formApi.setState({
              submitButtonOptions: {
                loading: true,
              },
            });
            appendMenuApi({
              ...params,
            })
              .then(() => {
                ElMessage.success('添加菜单成功');
                modelApi.setData({
                  loaded: true,
                });
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
            renderComponentContent: () => {
              const { prefixUrl } = formParams.value;
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
          {
            component: 'IconPicker',
            componentProps: {
              placeholder: '请输入图标字符串',
            },
            fieldName: 'icon',
            label: '图标',
            defaultValue: '',
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
                modelApi.setData({
                  loaded: true,
                });
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

  const conf = behaviorMap.get([type, behavior].join(','));

  formApi.setState((prev) => {
    const { schema: _, ...original } = prev;
    const options = conf?.behavior;
    return {
      ...original,
      ...options,
      // 修改schema
      schema: conf?.schema,
    };
  });
}

watch(
  () => formValues.value,
  (cur) => {
    const { ...params } = cur ?? {};
    updateForm(ListType[params.type] as any, formParams.value?.behavior);
  },
  {
    immediate: true,
  },
);

onUnmounted(() => {
  formApi.resetForm();
});
</script>

<template>
  <Modal>
    <Form />
  </Modal>
</template>

<style scoped lang="scss"></style>
