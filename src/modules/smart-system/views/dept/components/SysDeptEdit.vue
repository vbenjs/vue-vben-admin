<template>
  <Spin :spinning="getLoading">
    <BasicForm @register="registerForm" :size="getFormSize" />
  </Spin>
</template>

<script lang="ts" setup>
  import type { FormSchema } from '@/components/Form';
  import { Spin } from 'ant-design-vue';

  import { nextTick, ref, watch } from 'vue';
  import { useForm, BasicForm } from '@/components/Form';
  import { propTypes } from '@/utils/propTypes';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';

  import { getByIdApi } from '../SysDept.api';

  const props = defineProps({
    filterField: propTypes.bool,
    deptId: propTypes.number,
  });

  const { t } = useI18n();
  const { getFormSize } = useSizeSetting();

  const getLoading = ref(false);

  watch(
    () => props.deptId,
    (value) => {
      nextTick(async () => {
        if (!value) {
          resetFields();
        } else {
          try {
            getLoading.value = true;
            const deptData = await getByIdApi(value);
            if (deptData.parentDept) {
              deptData.parentName = deptData.parentDept.deptName;
            } else {
              deptData.parentName = '根';
            }
            setFieldsValue(deptData);
          } finally {
            getLoading.value = false;
          }
        }
      });
    },
  );

  const formSchemas: Array<FormSchema & { filter?: boolean }> = [
    {
      label: '',
      field: 'deptId',
      component: 'Input',
      show: false,
    },
    {
      label: '',
      field: 'parentId',
      component: 'Input',
      show: false,
    },
    {
      label: t('system.views.dept.title.parent'),
      field: 'parentName',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      // filter: true,
    },
    {
      label: t('system.views.dept.title.deptCode'),
      field: 'deptCode',
      component: 'Input',
      required: true,
    },
    {
      label: t('system.views.dept.title.deptType'),
      field: 'deptType',
      component: 'SmartApiSelectDict',
      required: true,
      componentProps: {
        dictCode: 'SYSTEM_ORGANIZATION_TYPE',
      },
    },
    {
      label: t('system.views.dept.title.deptName'),
      field: 'deptName',
      required: true,
      component: 'Input',
    },
    {
      label: t('common.table.useYn'),
      field: 'useYn',
      component: 'Switch',
      defaultValue: true,
    },
    {
      label: t('system.views.dept.title.email'),
      field: 'email',
      component: 'Input',
    },
    {
      label: t('system.views.dept.title.director'),
      field: 'director',
      component: 'Input',
    },
    {
      label: t('system.views.dept.title.phone'),
      field: 'phone',
      component: 'Input',
    },
    {
      label: t('common.table.seq'),
      field: 'seq',
      component: 'InputNumber',
      defaultValue: 1,
      required: true,
    },
    {
      label: t('common.table.remark'),
      field: 'remark',
      component: 'InputTextArea',
    },
    {
      label: t('common.table.createUser'),
      field: 'createBy',
      component: 'Input',
      filter: true,
      componentProps: {
        disabled: true,
      },
    },
    {
      label: t('common.table.createTime'),
      field: 'createTime',
      component: 'Input',
      filter: true,
      componentProps: {
        disabled: true,
      },
    },
    {
      label: t('common.table.updateUser'),
      field: 'updateBy',
      component: 'Input',
      filter: true,
      componentProps: {
        disabled: true,
      },
    },
    {
      label: t('common.table.updateTime'),
      field: 'updateTime',
      component: 'Input',
      filter: true,
      componentProps: {
        disabled: true,
      },
    },
  ];

  const getFormSchemas = () => {
    if (!props.filterField) {
      return formSchemas;
    }
    return formSchemas.filter((item) => item.filter === undefined || !item.filter);
  };

  const [registerForm, { setFieldsValue, validate, clearValidate, resetFields }] = useForm({
    colon: true,
    schemas: getFormSchemas(),
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 17,
    },
    baseColProps: {
      span: 24,
    },
    showActionButtonGroup: false,
  });

  defineExpose({
    setFieldsValue,
    validate,
    clearValidate,
    resetFields,
  });
</script>

<style scoped></style>
