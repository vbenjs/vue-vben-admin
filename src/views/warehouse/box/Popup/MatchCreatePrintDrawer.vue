<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    :width="500"
    destroyOnClose
    showFooter
    cancelText="关闭"
    @close="handleClose"
    :showCancelBtn="!allowPrint || current === total"
    @ok="handleOk"
    :okText="okBtnText"
  >
    <BasicForm @register="registerForm" validateTrigger="blur" />
    <template v-if="showProgress">
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
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { useDrawerInner, BasicDrawer } from '@/components/Drawer';
  import { useForm, BasicForm, FormSchema } from '@/components/Form';
  import { sleep } from '@/utils/sleep';

  import { computed, ref } from 'vue';
  import { getPrintRule } from '@/api/configuration/printRule';
  import { matchCreateProduct } from '@/api/warehouse/product';
  import { Progress, message } from 'ant-design-vue';
  import { printTemplate } from '@/api/configuration/printTemplate';
  import { today } from '@/utils/dateUtil';
  import { createLocalStorage } from '@/utils/cache';

  const product = ref();
  const packageListTemp = ref<any[]>([]);
  const boxTemp = ref();
  const fomrValues = ref();

  const total = ref(100);
  const current = ref(0);
  const allowPrint = ref(true);
  const errorText = ref();
  const showProgress = ref(false);
  const readonly = ref(false);
  const isPrint = ref(true);

  const emit = defineEmits(['register', 'success']);
  const ls = createLocalStorage();
  const getForm = () => {
    return [
      {
        label: '箱码打印规则',
        field: 'boxPrintRuleId',
        fields: ['boxPrintPrinterId'],
        component: 'ApiSelect',
        componentProps: ({ formModel }) => {
          return {
            api: getPrintRule,
            params: { templateType: ['BOX'] },
            placeholder: '打印规则',
            labelField: 'name',
            valueField: 'id',
            showSearch: true,
            searchField: 'name',
            onSelect: (value, option) => {
              formModel.boxPrintPrinterId = option.printerId;
              ls.set('MATCH_PRINTRULE', value);
              ls.set('MATCH_PRINTER', option.printerId);
            },
            disabled: readonly.value,
          };
        },
        rules: [{ required: true, message: '请选择箱码打印规则' }],
        colProps: { span: 24 },
      },
      {
        label: '盒箱比例',
        field: 'printRatio',
        required: true,
        helpMessage: '每打印多少个盒码后打印一个箱码',
        component: 'InputNumber',
        componentProps: {
          min: 1,
          precision: 0,
          controls: false,
          style: { width: '100%' },
          readonly: readonly.value,
        },
        defaultValue: 14,
        colProps: { span: 24 },
      },
      {
        label: '包装日期',
        field: `packingDate`,
        component: 'DatePicker',
        componentProps: {
          valueFormat: 'YYYY-MM-DD',
          style: 'width:100%',
          disabled: readonly.value,
        },
        defaultValue: today.format('YYYY-MM-DD'),
        rules: [{ required: true, message: '请选择包装日期' }],
        colProps: { span: 24 },
      },
      {
        label: '打印数量',
        field: 'times',
        required: true,
        component: 'InputNumber',
        componentProps: {
          min: 1,
          precision: 0,
          controls: false,
          style: { width: '100%' },
          readonly: readonly.value,
        },
        defaultValue: 1,
        colProps: { span: 24 },
      },
      // {
      //   label: '连续打印',
      //   field: 'batchPrint',
      //   required: true,
      //   component: 'Checkbox',
      //   colProps: { span: 24 },
      // },
    ] as FormSchema[];
  };

  const [registerForm, { validate, setFieldsValue, resetSchema }] = useForm({
    layout: 'vertical',
    labelWidth: 100,
    rowProps: {
      gutter: [12, 8],
    },
    schemas: getForm(),
    compact: true,
    showActionButtonGroup: false,
    // showResetButton: false,
    actionColOptions: { span: 24 },
  });

  const [registerDrawer, { setDrawerProps, closeDrawer, changeOkLoading }] = useDrawerInner(
    async (data) => {
      setDrawerProps({ confirmLoading: false });
      product.value = data.product;
      showProgress.value = false;
      allowPrint.value = true;
      total.value = 100;
      current.value = 0;
      errorText.value = '';
      fomrValues.value = null;
      readonly.value = false;
      isPrint.value = data.isPrint;
      resetSchema(getForm());
      const defaultValue = {
        times: Number(data.batchCount),
        batchPrint: data.batchPrint,
      };
      const rule = ls.get('MATCH_PRINTRULE');
      if (rule) defaultValue['boxPrintRuleId'] = rule;
      const printer = ls.get('MATCH_PRINTER');
      if (printer) defaultValue['boxPrintPrinterId'] = printer;
      setFieldsValue(defaultValue);
    },
  );

  const getTitle = '匹配创建';

  const defaultBtnText = computed(() => {
    return isPrint.value ? '打印' : '创建';
  });
  const okBtnText = computed(() => {
    if (current.value === total.value) return '再次打印';
    if (errorText.value) return '继续打印';
    if (!allowPrint.value) return '继续打印';
    if (showProgress.value) return '取消打印';
    return defaultBtnText.value;
  });
  const handleClose = () => {
    allowPrint.value = false;
    closeDrawer();
  };

  const handleOk = async () => {
    if (!isPrint.value) {
      try {
        changeOkLoading(true);
        const values = await validate();
        for (const _ of Array(Number(values.times))) {
          await matchCreateProduct({
            boxPrintRuleId: values.boxPrintRuleId,
            printRatio: values.printRatio,
            product: product.value,
            packingDate: values.packingDate,
          });
        }
        message.success('匹配创建成功');
      } finally {
        changeOkLoading(false);
        return;
      }
    }

    if (okBtnText.value === '打印') {
      const values = await validate();
      total.value = Number(values.times);
      showProgress.value = true;
      fomrValues.value = values;
      readonly.value = true;
      resetSchema(getForm());
      print();
      return;
    }

    if (okBtnText.value === '再次打印') {
      showProgress.value = false;
      allowPrint.value = true;
      total.value = 100;
      current.value = 0;
      errorText.value = '';
      fomrValues.value = null;
      readonly.value = false;
      resetSchema(getForm());
      return;
    }
    if (allowPrint.value) {
      allowPrint.value = false;
    } else {
      allowPrint.value = true;
      errorText.value = '';
      print();
    }
  };

  const print = async () => {
    try {
      for (const _ of Array(total.value - current.value).fill(0)) {
        if (!allowPrint.value) return;

        if (!boxTemp.value) {
          const { packageList, box } = await matchCreateProduct({
            boxPrintRuleId: fomrValues.value.boxPrintRuleId,
            printRatio: fomrValues.value.printRatio,
            product: product.value,
            packingDate: fomrValues.value.packingDate,
          });
          boxTemp.value = box;
          packageListTemp.value = packageList;
        }

        if (packageListTemp.value.length !== 0) {
          const templateId = packageListTemp.value[0].templateId;
          await printTemplate({
            printerId: product.value.printerId,
            templateId: templateId,
            dataIds: packageListTemp.value.map((item) => item.id),
            errorMessageMode: 'none',
          });
          packageListTemp.value = [];
          await sleep(50);
        }

        await printTemplate({
          printerId: fomrValues.value.boxPrintPrinterId,
          templateId: boxTemp.value.templateId,
          dataIds: [boxTemp.value.id],
          errorMessageMode: 'none',
        });
        boxTemp.value = null;
        current.value++;
        await sleep(50);
      }

      message.success('匹配创建成功');
    } catch (error) {
      errorText.value = error.toString();
      // current.value--;
      allowPrint.value = false;
    }
  };
</script>
