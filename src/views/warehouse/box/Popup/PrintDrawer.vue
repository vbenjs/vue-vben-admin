<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    :width="578"
    destroyOnClose
    showFooter
    :maskClosable="false"
    cancelText="关闭"
    @close="handleClose"
    :showCancelBtn="!allowPrint || current === total"
    @ok="handleOk"
    :okText="okBtnText"
    :showOkBtn="current !== total"
    :ok-button-props="{ disabled: !allowPrint && printing }"
  >
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

    <div id="printElement"></div>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { getPrintTemplateById, printTemplate } from '@/api/configuration/printTemplate';
  import { createProduct } from '@/api/warehouse/product';
  import { useDrawerInner, BasicDrawer } from '@/components/Drawer';
  import { sleep } from '@/utils/sleep';

  import { Progress } from 'ant-design-vue';
  import { computed, ref } from 'vue';
  import { hiprint, disAutoConnect } from 'vue-plugin-hiprint';

  disAutoConnect();
  const total = ref(0);
  const current = ref(0);
  const allowPrint = ref(true);
  const errorText = ref();
  const pageData = ref();
  const printing = ref(false);

  const printDataTmp = ref();
  const dataIds = ref<number[]>([]);

  const emit = defineEmits(['register', 'success']);

  const [registerDrawer, { setDrawerProps, changeLoading, closeDrawer }] = useDrawerInner(
    async (data) => {
      allowPrint.value = true;

      setDrawerProps({ confirmLoading: false });
      current.value = 0;
      pageData.value = data;
      total.value = data.batchPrint ? 1 : data.times;
      data.batchPrint ? startPrint2() : startPrint();
    },
  );

  const startPrint = async () => {
    try {
      changeLoading(true);
      const { content } = await getPrintTemplateById(pageData.value.templateId);
      changeLoading(false);
      const hiprintTemplate = new hiprint.PrintTemplate({
        template: JSON.parse(content || '{}'),
      });

      for (const _ of Array(total.value - current.value).fill(0)) {
        if (!allowPrint.value) {
          break;
        }
        current.value++;
        printing.value = true;

        //暂存打印数据，
        if (!printDataTmp.value) {
          printDataTmp.value = await createProduct(pageData.value.formData);
        }

        const htmlData = hiprintTemplate.getHtml(printDataTmp.value);
        $('#printElement').html(htmlData);
        await printTemplate({
          printerId: pageData.value.printerId,
          templateId: pageData.value.templateId,
          dataIds: [printDataTmp.value.id],
          errorMessageMode: 'none',
        });
        printDataTmp.value = null;
        await sleep(50);
      }
    } catch (err) {
      console.log(err.toString());
      errorText.value = err.toString();
      current.value--;
      allowPrint.value = false;
      //
    } finally {
      changeLoading(false);
      printing.value = false;
    }
  };

  //连续打印
  const startPrint2 = async () => {
    try {
      current.value++;

      if (dataIds.value.length !== pageData.value.times) {
        const ids: number[] = [];

        for (const _ of Array(pageData.value.times - dataIds.value.length).fill(0)) {
          const { id } = await createProduct(pageData.value.formData);
          ids.push(id);
        }
        dataIds.value = ids;
      }
      await printTemplate({
        printerId: pageData.value.printerId,
        templateId: pageData.value.templateId,
        dataIds: dataIds.value,
        errorMessageMode: 'none',
      });
      dataIds.value = [];
      emit('success');
    } catch (err) {
      console.log(err.toString());
      errorText.value = err.toString();
      current.value--;
      allowPrint.value = false;
      //
    } finally {
      //
    }
  };

  const getTitle = '打印盒码';
  const okBtnText = computed(() => {
    if (errorText.value) {
      if (!pageData.value.batchPrint) return '继续打印';
      return '重新打印';
    }
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
      pageData.value.batchPrint ? startPrint2() : startPrint();
    }
  };
</script>
