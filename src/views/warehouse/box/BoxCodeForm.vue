<template>
  <PageWrapper contentFullHeight>
    <Card>
      <BasicForm @register="registerForm" />
    </Card>
    <div class="h-10"></div>

    <template #leftFooter>
      <div class="flex justify-between items-center">
        <div> 条码：{{ pageData.barCode }} </div>

        <Space>
          <Checkbox v-model:checked="pageData.autoPrint">自动打印</Checkbox>
          <Checkbox v-model:checked="pageData.batchPrint" :disabled="!pageData.autoPrint"
            >连续打印</Checkbox
          >
          <div class="w-10"></div>
          <div class="flex items-center mr-6">
            <div class="text-[#000000BF]">打印数量：</div>
            <div class="w-30 mt-[-8px]">
              <InputNumber
                min="1"
                :controls="false"
                :precision="0"
                v-model:value="pageData.batchCount"
              />
            </div>
          </div>
          <a-button @click="handlePerview"> 预览 </a-button>
          <ApiButton type="primary" :api="handleSubmit"> 打印 </ApiButton>
          <a-button type="primary" @click="handlePrint"> 匹配创建 </a-button>
        </Space>
      </div>
    </template>
    <PrintDrawer @register="registerDrawer" @success="updateSerialNum" />
    <MatchCreatePrintDrawer @register="registerMatch" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { onMounted, reactive } from 'vue';
  import { getFormSchema } from './data';
  import { Checkbox, InputNumber, Space, Card } from 'ant-design-vue';
  import { useForm, BasicForm } from '@/components/Form';
  import ApiButton from '@/components/Button/src/ApiButton.vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { createProduct, getProductPreview, getProductSerialNum } from '@/api/warehouse/product';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { useDrawer } from '@/components/Drawer';
  // import { sleep } from '@/utils/sleep';
  import { PageWrapper } from '@/components/Page';
  import { showPrintPreview } from '@/components/PrintDesign';
  import { hiprint, disAutoConnect } from 'vue-plugin-hiprint';
  import { getPrintTemplateById } from '@/api/configuration/printTemplate';

  disAutoConnect();

  defineOptions({ name: 'BoxCodeForm' });

  const PrintDrawer = createAsyncComponent(() => import('./Popup/PrintDrawer.vue'));
  const MatchCreatePrintDrawer = createAsyncComponent(
    () => import('./Popup/MatchCreatePrintDrawer.vue'),
  );

  const pageData = reactive({
    preview: false,
    autoPrint: true,
    batchPrint: false,
    batchCount: 1,
    barCode: '',
  });

  const { createMessage: message } = useMessage();
  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerMatch, { openDrawer: openMatchDrawer }] = useDrawer();
  const [registerForm, { setFieldsValue, validate, resetSchema, getFieldsValue }] = useForm({
    layout: 'vertical',
    rowProps: { gutter: 24 },
    // labelWidth: 100,
    showActionButtonGroup: false,
    submitOnChange: true,
    submitFunc: async () => {
      const { printRuleId } = getFieldsValue();
      if (!printRuleId) return;
      pageData.barCode = '';
      const values = await validate();
      const { _printerId, ...rest } = values;
      const { barCode } = await getProductPreview(rest);
      pageData.barCode = barCode;
    },
  });

  onMounted(async () => {
    resetSchema(getFormSchema());
  });

  async function handleSubmit() {
    let values: any = {};
    try {
      values = await validate();
    } catch (error) {
      message.warning('请先完成表单填写！');
      return;
    }
    try {
      const { printerId, ...rest } = values;
      const { barCode } = await getProductPreview(rest);
      pageData.barCode = barCode;

      if (pageData.autoPrint) {
        openDrawer(true, {
          formData: values,
          times: pageData.batchCount,
          batchPrint: pageData.batchPrint,
          templateId: values.templateId,
          printerId,
        });
        return Promise.resolve();
      }
      console.log('rest', rest);

      for (const _ of Array(pageData.batchCount).fill(0)) {
        await createProduct(rest);
      }
      message.success(`新建${'盒码'}成功！`);
      updateSerialNum();
      // closeCurrent();
    } finally {
      //
    }
  }

  const updateSerialNum = async () => {
    const values = getFieldsValue();
    const serialNum = await getProductSerialNum(values.serialLen);
    setFieldsValue({ serialNum });
  };

  const handlePerview = async () => {
    let data: Recordable = {};
    try {
      data = await validate();
    } catch (error) {
      message.warning('请先完成表单填写！');
      return;
    }
    if (!data.templateId) return message.warning('请选择打印模板');
    const { content } = await getPrintTemplateById(data.templateId);
    const { _printerId, ...rest } = data;
    const printData = await getProductPreview(rest);
    const template = JSON.parse(content || '{}');

    const hiprintTemplate = new hiprint.PrintTemplate({
      template: template,
    });

    showPrintPreview({
      template: hiprintTemplate,
      width: template.panels?.[0]?.width,
      hiprintData: printData,
      showPdfBtn: true,
      showPrintBtn: false,
    });
  };

  const handlePrint = async () => {
    let values: any = {};
    try {
      values = await validate();
    } catch (error) {
      message.warning('请先完成表单填写！');
      return;
    }
    const { _printerId, ...rest } = values;

    openMatchDrawer(true, {
      product: rest,
      batchCount: pageData.batchCount,
      batchPrint: pageData.batchPrint,
      isPrint: pageData.autoPrint,
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
