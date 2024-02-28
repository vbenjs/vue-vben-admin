<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    :width="578"
    destroyOnClose
    showFooter
    :maskClosable="!printerId"
    cancelText="关闭"
    @close="handleClose"
    :showCancelBtn="!allowPrint || current === total"
    @ok="handleOk"
    :okText="okBtnText"
    :showOkBtn="!!printerId && current !== total"
    :ok-button-props="{ disabled: !allowPrint && printing }"
  >
    <template v-if="printerId">
      <div class="mt-20 mb-20">
        <div class="flex flex-col justify-center items-center">
          <Progress
            type="circle"
            :percent="Number(current / total) * 100"
            :format="() => `${current}/${total}`"
          />
          <template v-if="allowPrint">
            <div class="mt-6 font-[PingFangSC] font-500 text-32px text-[#393939]">
              {{ current === total ? '打印完成' : '正在打印...' }}
            </div>
          </template>
          <template v-else>
            <template v-if="errorText">
              <div class="mt-6 font-[PingFangSC] font-500 text-32px text-red">
                {{ errorText }}
              </div>
            </template>
            <div v-else class="mt-6 font-[PingFangSC] font-500 text-32px text-[#393939]"
              >打印取消</div
            >
          </template>
        </div>
      </div>
    </template>
    <template v-else>
      <BasicForm @register="registerForm" validateTrigger="blur" />
      <div class="flex justify-end">
        <Space>
          <a-button @click="resetFunc">预览</a-button>
          <a-button type="primary" @click="submitFunc">确定</a-button>
        </Space>
      </div>
    </template>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import {
    getPrintTemplate,
    getPrintTemplateById,
    printTemplate,
  } from '@/api/configuration/printTemplate';
  import { getPrinter } from '@/api/configuration/printer';
  import { useDrawerInner, BasicDrawer } from '@/components/Drawer';
  import { useForm, BasicForm } from '@/components/Form';
  import { showPrintPreview } from '@/components/PrintDesign';
  import { sleep } from '@/utils/sleep';

  import { Progress, Space, message } from 'ant-design-vue';
  import { hiprint, disAutoConnect } from 'vue-plugin-hiprint';
  import { computed, ref, watch } from 'vue';
  import { getBillPreview } from '@/api/warehouse/bill';
  import { getProductPrintPreview } from '@/api/warehouse/product';
  import { createLocalStorage } from '@/utils/cache';

  disAutoConnect();
  const total = ref(0);
  const current = ref(0);
  const allowPrint = ref(true);
  const printerId = ref(0);
  const printRows = ref<any[]>([]);
  const printing = ref(false);

  const errorText = ref();
  const formDataTemp = ref();

  const templateType = ref<string[]>([]);

  interface Props {
    templateType?: string | string[];
    isBill?: boolean;
    storageKey: string;
  }
  const props = withDefaults(defineProps<Props>(), {
    templateType: () => [] as string[],
    isBill: false,
  });

  const ls = createLocalStorage();

  watch(
    () => props.templateType,
    (val) => {
      templateType.value = typeof val === 'string' ? [val] : val;
    },
    { immediate: true },
  );

  const emit = defineEmits(['register', 'success']);

  const [registerForm, { validate, getFieldsValue, setFieldsValue }] = useForm({
    // layout: 'vertical',
    labelWidth: 100,
    rowProps: {
      gutter: [12, 8],
    },
    compact: true,
    showActionButtonGroup: false,
    // showResetButton: false,
    actionColOptions: { span: 24 },
    schemas: [
      {
        field: 'printerId',
        component: 'ApiSelect',
        label: '打印机',
        componentProps: {
          api: getPrinter,
          valueField: 'id',
          labelField: 'name',
          onChange: (val) => {
            ls.set(props.storageKey + '_PRINTER', val);
          },
        },
        required: true,
        colProps: { span: 24 },
      },
      {
        field: 'templateId',
        component: 'ApiSelect',
        helpMessage:
          '勾选覆盖，表示全部使用选择的打印模板；不勾选则优先使用数据本身带的模板，没有再使用选择的模板',
        label: '打印模板',
        componentProps: {
          api: (where) => {
            where.templateType = templateType.value;
            return getPrintTemplate(where);
          },
          valueField: 'id',
          labelField: 'name',
          params: {
            templateType: templateType.value,
          },
          onChange: (val) => {
            ls.set(props.storageKey + '_TEMPLATE', val);
          },
        },
        required: true,
        colProps: { span: 20 },
      },
      {
        field: 'cover',
        component: 'Checkbox',
        renderComponentContent: '覆盖',
        defaultValue: true,

        colProps: { span: 4 },
      },
      {
        label: '连续打印',
        helpMessage: '连续打印只打印1次',
        field: 'ids',
        component: 'Checkbox',
        // renderComponentContent: '连续打印',
        defaultValue: true,
        colProps: { span: 24 },
      },
    ],
  });

  const [registerDrawer, { setDrawerProps, changeLoading, closeDrawer }] = useDrawerInner(
    async (data) => {
      try {
        printerId.value = 0;
        allowPrint.value = true;
        setDrawerProps({ confirmLoading: false });
        total.value = data.rows.length;
        current.value = 0;
        printRows.value = data.rows;
        formDataTemp.value = null;

        const defaultValue = {};
        const template = ls.get(props.storageKey + '_TEMPLATE');
        if (template) defaultValue['templateId'] = template;
        const printer = ls.get(props.storageKey + '_PRINTER');
        if (printer) defaultValue['printerId'] = printer;
        setFieldsValue(defaultValue);

        emit('success');
      } finally {
        changeLoading(false);
      }
    },
  );

  const getTitle = '打印';
  const okBtnText = computed(() => {
    if (errorText.value) return '继续打印';
    if (!allowPrint.value) return '继续打印';
    return '取消打印';
  });

  const handleClose = () => {
    allowPrint.value = false;
    closeDrawer();
  };

  const handleOk = () => {
    if (allowPrint.value) {
      allowPrint.value = false;
    } else {
      allowPrint.value = true;
      errorText.value = '';
      printTemplate1();
    }
  };

  async function resetFunc() {
    const values = getFieldsValue();
    const templateId = values.templateId;
    if (!templateId) return message.warning('请选择模板！');

    const { content } = await getPrintTemplateById(templateId);
    const template = JSON.parse(content || '{}');

    const hiprintTemplate = new hiprint.PrintTemplate({
      template: template,
    });

    let hiprintData;
    const printRowIds = printRows.value.map((item) => item.id);

    if (!props.isBill) {
      hiprintData = await getProductPrintPreview(printRowIds, templateId);
    } else {
      hiprintData = await getBillPreview(printRowIds, templateId);
    }

    showPrintPreview({
      template: hiprintTemplate,
      width: template.panels?.[0]?.width,
      hiprintData: hiprintData,
      showPdfBtn: true,
      showPrintBtn: false,
    });
  }
  async function submitFunc() {
    const values = await validate();

    const ids = values.ids;
    delete values.ids;

    formDataTemp.value = values;
    if (ids) {
      printTemplate2(values.printerId);
    } else {
      printerId.value = values.printerId;
      printTemplate1();
    }
  }

  const printTemplate1 = async () => {
    try {
      for (const item of printRows.value.slice(current.value, printRows.value.length)) {
        if (!allowPrint.value) return;
        current.value++;
        const templateId = formDataTemp.value.cover
          ? formDataTemp.value.templateId
          : item.templateId ?? formDataTemp.value.templateId;
        printing.value = true;
        await printTemplate({
          dataIds: [item.id],
          templateId,
          printerId: printerId.value,
          errorMessageMode: 'none',
        });
        await sleep(50);
      }
    } catch (err) {
      errorText.value = err.toString();
      current.value--;
      allowPrint.value = false;
    } finally {
      printing.value = false;
    }
  };

  const printTemplate2 = async (printerId: number) => {
    const dataIds = printRows.value.map((item) => item.id);
    await printTemplate({
      dataIds,
      templateId: formDataTemp.value.templateId,
      printerId: printerId,
    });

    message.success('打印成功！');
  };
</script>
