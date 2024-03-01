<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    @ok="handleSubmit"
    :width="578"
    destroyOnClose
    showFooter
  >
    <BasicForm @register="registerForm">
      <template #bind="{ model }">
        <a-button type="primary" @click="handleCreate(model.storeId)">
          {{ !model.sensor?.length ? '选择' : '重新选择' }}
        </a-button>

        <div v-for="(item, index) of model.sensor" class="mt-2">
          #{{ index + 1 }}： {{ formatSensor(item) }}
        </div>
      </template>
    </BasicForm>

    <SelectSensor @register="registerSelectDrawer" @success="handleSelect" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { ActionKey, createApi, getFormSchema, modalTitle, updateApi } from '../data';
  import { message } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import { useForm, BasicForm } from '@/components/Form';
  import { useDrawerInner, BasicDrawer, useDrawer } from '@/components/Drawer';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { SensorResult } from '@/api/model/sensorModel';
  import { useFormat } from '@/utils/format';

  const SelectSensor = createAsyncComponent(
    () => import('@/views/common/Drawers/SelectSensor.vue'),
  );

  const actionKey = ref<ActionKey>();
  const rowId = ref<number>();
  const emit = defineEmits(['success', 'register']);

  const { formatSensor } = useFormat();

  const [registerForm, { setFieldsValue, validate, resetSchema }] = useForm({
    // layout: 'vertical',
    labelWidth: 100,
    showActionButtonGroup: false,
  });

  const [registerSelectDrawer, { openDrawer: openSelectDrawer }] = useDrawer();
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    actionKey.value = data?.actionKey;
    resetSchema(getFormSchema(actionKey.value));
    setDrawerProps({ confirmLoading: false });

    if (unref(actionKey) !== 'create') {
      const formData = cloneDeep(data.record);
      rowId.value = formData.id;
      setFieldsValue({
        ...formData,
      });
    }
  });

  const getTitle = computed(() => {
    const action = unref(actionKey);
    if (action === 'create') return '新建' + modalTitle;
    if (action === 'edit') return '编辑' + modalTitle;
    if (action === 'show') return '查看' + modalTitle;
    return '';
  });

  const handleCreate = (storeId) => {
    openSelectDrawer(true, {
      title: '选择传感器',
      multiple: true,
      storeId: storeId,
    });
  };

  const handleSelect = async (array: SensorResult[]) => {
    setFieldsValue({ sensor: array });
  };
  async function handleSubmit() {
    try {
      const values = await validate();
      const { sensor, ...other } = values;

      setDrawerProps({ confirmLoading: true });
      const action = unref(actionKey);
      const id = rowId.value;
      if (action === 'create') {
        await createApi({
          ...other,
          sensorList: sensor?.map((item) => ({ id: item.id })),
        });
        message.success(`新建${modalTitle}成功！`);
      }
      if (action === 'edit') {
        await updateApi({ id, ...other });
        message.success('更新成功！');
      }
      closeDrawer();
      emit('success', {
        actionKey: unref(actionKey),
        values: { ...values, id: rowId.value },
      });
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
