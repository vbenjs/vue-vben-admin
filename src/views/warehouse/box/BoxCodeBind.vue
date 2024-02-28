<template>
  <PageWrapper contentFullHeight>
    <div class="flex w-full h-full">
      <div>
        <Card>
          <BasicForm @register="registerForm" />
        </Card>
        <div class="h-10"></div>
      </div>
      <div class="w-76 ml-4 shrink-0">
        <Card title="选择条码" size="small">
          <ApiSelect
            class="w-full"
            :api="getPda"
            :immediate="true"
            :filterOption="false"
            showSearch
            labelField="name"
            valueField="code"
            autoSelectFirst
            v-model:value="pdaCode"
            @options-change="hanldeChangeOptions"
          />
          <div class="h-4"></div>
          <Input.Search v-model:value="search" placeholder="搜索" @search="reset" />
          <div class="h-4"></div>
          <div class="flex justify-between items-center">
            <Checkbox
              v-model:checked="state.checkAll"
              :indeterminate="state.indeterminate"
              @change="onCheckAllChange"
            >
              全选/取消全选
            </Checkbox>

            <a-button
              type="primary"
              danger
              ghost
              size="small"
              v-auth="'packageManager_deleteCode'"
              @click="handleDeleteCodes"
            >
              删除
            </a-button>
          </div>
          <Divider class="my-2" />
          <Checkbox.Group v-model:value="selected" style="width: 100%">
            <Flex gap="middle" vertical>
              <template v-for="code in getBarcodes" :key="code">
                <Checkbox :value="code.id">{{ code.barcode }}</Checkbox>
              </template>
            </Flex>
          </Checkbox.Group>
        </Card>
      </div>
    </div>

    <template #rightFooter>
      <Space>
        <ApiButton type="primary" :api="handleSubmit"> 确定 </ApiButton>
        <a-button @click="handleCancel"> 取消 </a-button>
      </Space>
    </template>
    <PrintDrawer @register="registerDrawer" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { computed, onMounted, reactive, ref, watch } from 'vue';
  import { getFormSchema } from './data';
  import { Space, Input, Card, Checkbox, Flex, Divider } from 'ant-design-vue';
  import { useForm, BasicForm, ApiSelect } from '@/components/Form';
  import { useTabs } from '@/hooks/web/useTabs';
  import ApiButton from '@/components/Button/src/ApiButton.vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { batchCreateProduct, getProductSerialNum } from '@/api/warehouse/product';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { useDrawer } from '@/components/Drawer';
  import { PageWrapper } from '@/components/Page';
  import { getPda } from '@/api/configuration/pda';
  import { deleteScanCode, getLastScanCode, getScanCode } from '@/api/warehouse/scan';
  import { useGo } from '@/hooks/web/usePage';
  import { HxScanCode } from '@/ApiModel/warehouse/scan';

  defineOptions({ name: 'BoxCodeBind' });

  const PrintDrawer = createAsyncComponent(() => import('./Popup/PrintDrawer.vue'));

  const codes = ref<HxScanCode[]>([]);
  const search = ref<string>();
  const pdaCode = ref<string>();
  const selected = ref<number[]>([]);

  const state = reactive({
    indeterminate: false,
    checkAll: false,
  });

  const onCheckAllChange = (e: any) => {
    selected.value = e.target.checked ? getBarcodes.value.map((item) => item.id) : [];
    state.indeterminate = false;
  };

  watch(
    () => selected.value,
    (val) => {
      state.indeterminate = !!val.length && val.length < getBarcodes.value.length;
      state.checkAll = val.length === 0 ? false : val.length === getBarcodes.value.length;
    },
  );

  const go = useGo();
  const { getCurrentTab, close } = useTabs();
  const { createMessage: message, createConfirm } = useMessage();
  const [registerDrawer] = useDrawer();
  const [registerForm, { setFieldsValue, validate, resetSchema }] = useForm({
    layout: 'vertical',
    rowProps: { gutter: 24 },
    // labelWidth: 100,
    showActionButtonGroup: false,
  });
  // const route = useRoute();

  onMounted(async () => {
    resetSchema(getFormSchema('bind'));
    const data = await getLastScanCode();
    pdaCode.value = data?.pdaCode ?? pdaCode.value;
  });

  const hanldeChangeOptions = async (options: any[]) => {
    if (options.length === 0) return;
    if (pdaCode.value) return;
    const { value } = options[0];
    pdaCode.value = value;
  };

  watch(
    () => pdaCode.value,
    async (value) => {
      if (!value) return;
      reset();
    },
  );

  const getBarcodes = computed(() => {
    const value = search.value;
    if (!value) {
      return codes.value;
    } else {
      return codes.value.filter((item) => item.barcode.indexOf(value) > -1);
    }
  });

  const reset = async () => {
    //刷新条码
    selected.value = [];
    const data = await getScanCode({ pdaCode: pdaCode.value });
    codes.value = data;
  };

  const handleDeleteCodes = () => {
    if (selected.value.length === 0) {
      message.warning('请选择要删除的条码');
      return;
    }
    createConfirm({
      iconType: 'warning',
      title: '提示',
      content: '是否确认删除选中条码？',
      onOk: async () => {
        await deleteScanCode(selected.value);
        message.success('删除成功');
        reset();
      },
    });
  };

  async function handleSubmit() {
    try {
      const values = await validate();
      const selectCodes = codes.value
        .filter((item) => selected.value.includes(item.id))
        .map((item) => item.barcode);

      await batchCreateProduct(selectCodes, { serialLen: 4, ...values });
      message.success(`新建${'盒码'}成功！`);

      const serialNum = await getProductSerialNum(values.serialLen);
      setFieldsValue({ serialNum });

      reset();

      // closeCurrent();
    } finally {
      //
    }
  }

  const handleCancel = () => {
    createConfirm({
      iconType: 'warning',
      title: '提示',
      content: '这将关闭当前页面，是否继续？',
      onOk: () => {
        const currentTab = getCurrentTab();
        go({ path: '/warehouse/box_code' });
        setTimeout(() => {
          close(currentTab);
        }, 100);
      },
    });
  };
</script>
<style lang="less" scoped>
  .form-bottom {
    position: absolute;
    right: 16px;
    bottom: 0;
    width: calc(100% - 32px);
    padding: 8px 16px;
    // border-top: 1px solid #e8e8e8;
    background-color: white;
  }
</style>
