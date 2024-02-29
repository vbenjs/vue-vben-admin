<template>
  <ConfigProvider :locale="zhCN">
    <Modal
      v-model:open="open"
      :title="title"
      @ok="handleSubmit"
      :destroyOnClose="true"
      :width="width"
      okText="确定"
      cancelText="取消"
    >
      <div class="px-4 mb-[-10px]">
        <BasicTable @register="registerTable" />
      </div>
    </Modal>
  </ConfigProvider>
</template>

<script setup lang="ts">
  import { Modal, ConfigProvider } from 'ant-design-vue';
  import { onMounted, ref } from 'vue';
  import { BasicTable, useTable } from '@/components/Table';
  import { SelectModalProps } from './state';
  import zhCN from 'ant-design-vue/es/locale/zh_CN';
  import dayjs from 'dayjs';
  import 'dayjs/locale/zh-cn';

  dayjs.locale('zh-cn');
  // const emit = defineEmits(['register']);
  const open = ref<boolean>(true);

  const props = withDefaults(defineProps<SelectModalProps>(), {
    title: '选择',
    rowKey: 'id',
    width: '1000px',
    formConfig: () => ({
      labelWidth: 120,
      autoSubmitOnEnter: true,
      autoSetPlaceHolder: false,
    }),
  });

  const [registerTable, { setProps, getSelectRows }] = useTable();

  onMounted(() => {
    const { api, columns, multiple, formConfig, rowKey } = props;
    formConfig.schemas?.forEach((item) => {
      item.colProps = { span: 6 };
    });
    formConfig.compact = true;
    setProps({
      api: api!,
      columns,
      size: 'small',
      rowKey,
      loading: true,
      showIndexColumn: false,
      useSearchForm: true,
      formConfig: formConfig,
      // showTableSetting: true,
      rowSelection: multiple ? { type: 'checkbox' } : { type: 'radio' },
      canResize: false,
      isCanResizeParent: false,
      resizeHeightOffset: -100,
    });
  });

  async function handleSubmit() {
    try {
      const selectRows = getSelectRows();
      props.onOK && (await props.onOK(selectRows));
    } finally {
      open.value = false;
    }
  }
</script>

<style scoped></style>
