<template>
  <BasicModal
    :title="t('layout.header.dropdownChangeApi')"
    v-bind="$attrs"
    @register="register"
    @ok="handelSubmit"
    @cancel="handelCancel"
  >
    <BasicForm @register="registerForm">
      <template #api="{ model, field }">
        <RadioGroup v-model:value="model[field]">
          <Radio :style="radioStyle" :value="key" v-for="(val, key) in addresses" :key="key"
            >{{ key }}: {{ val }}</Radio
          >
        </RadioGroup>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { Radio } from 'ant-design-vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form';
  import { ref } from 'vue';
  import { useAppStore } from '@/store/modules/app';
  import type { ApiAddress } from '#/store';

  const appStore = useAppStore();
  const RadioGroup = Radio.Group;
  const { t } = useI18n();
  const [register, { closeModal }] = useModalInner(async () => {
    initData();
  });
  // perf 能读取所有.env.xxx文件最好, 另外key与--mode XXX最好相同
  const addresses = ref({
    development: 'http://www.a.com',
    test: 'http://www.b.com',
    prod: 'http://www.c.com',
  });
  const radioStyle = ref({
    display: 'flex',
    height: '30px',
    lineHeight: '30px',
  });
  const [registerForm, { validateFields, setFieldsValue }] = useForm({
    showActionButtonGroup: false,
    schemas: [
      {
        field: 'api',
        label: t('layout.header.dropdownChangeApi'),
        colProps: {
          span: 24,
        },
        defaultValue: import.meta.env.MODE || 'development', // 当前环境
        required: true,
        // component: 'Input',
        slot: 'api',
      },
    ],
  });
  const handelSubmit = async () => {
    const values = await validateFields();
    appStore.setApiAddress({
      key: values.api,
      val: addresses.value[values.api],
    });
    location.reload();
  };
  const handelCancel = () => {
    closeModal();
  };
  const initData = () => {
    const { key = '' } = appStore.getApiAddress as ApiAddress;
    if (key) {
      setFieldsValue({
        api: key,
      });
    }
  };
</script>
