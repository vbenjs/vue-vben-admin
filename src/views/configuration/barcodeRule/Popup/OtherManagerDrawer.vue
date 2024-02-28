<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    :width="576"
    destroyOnClose
  >
    <div class="mx-1">
      <BasicForm @register="registerForm" />
    </div>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { useForm, BasicForm, FormSchema } from '@/components/Form';
  import { useDrawerInner, BasicDrawer } from '@/components/Drawer';
  import { TransferDirection } from 'ant-design-vue/es/transfer';
  import { SysDataRelation } from '@/ApiModel/configuration/customer';
  import {
    addBarcodeOther,
    deleteBarcodeOther,
    getBarcodeOther,
    getBarcodeRule,
  } from '@/api/configuration/barcodeRule';

  const customerId = ref<number>(0);
  const listStyle = {
    width: '250px',
    height: '300px',
  };

  async function handleChange(
    _: string[],
    direction: TransferDirection,
    moveKeys: string[],
    createApi: (data: SysDataRelation) => Promise<any>,
    deleteApi: (data: SysDataRelation) => Promise<any>,
  ) {
    // console.log(keys, direction, moveKeys);
    // const old = [...selected.value, attribute.value];
    if (!direction) return;
    try {
      if (direction === 'left') {
        await deleteApi({ mainId: unref(customerId), subIds: moveKeys });
      } else {
        await createApi({ mainId: unref(customerId), subIds: moveKeys });
      }
    } catch (e) {
      // selected.value = old;
    }
  }
  const getFormSchema = () => {
    return [
      {
        // label: '关联其他',
        field: 'other',
        component: 'ApiTransfer',
        componentProps: {
          api: async (where) => {
            const data = await getBarcodeRule(where);
            return data.filter((item) => item.ruleType === 'OTHER');
          },
          showSearch: true,
          listStyle,
          labelField: 'name',
          valueField: 'id',
          onChange: (keys, direction, moveKeys) =>
            handleChange(keys, direction, moveKeys, addBarcodeOther, deleteBarcodeOther),
        },
        colProps: { span: 24 },
      },
    ] as FormSchema[];
  };

  const [registerForm, { resetFields, setFieldsValue }] = useForm({
    layout: 'vertical',
    rowProps: {
      gutter: [24, 8],
    },
    compact: true,
    showActionButtonGroup: false,
    schemas: getFormSchema(),
  });

  const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (id) => {
    setDrawerProps({ confirmLoading: false });
    resetFields();
    customerId.value = id;
    const data: Recordable = {};

    data.other = (await getBarcodeOther(id))?.map((i) => `${i.id}`);
    setFieldsValue(data);
  });

  const getTitle = computed(() => {
    return '关联其他数据';
  });
</script>
