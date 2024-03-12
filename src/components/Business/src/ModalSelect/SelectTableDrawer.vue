<template>
  <ConfigProvider :locale="zhCN">
    <Drawer
      v-model:open="open"
      :title="title"
      @ok="handleSubmit"
      :destroyOnClose="true"
      :width="width"
      :bodyStyle="bodyStyle"
    >
      <div class="px-4 pt-4">
        <BasicTable @register="registerTable" />
      </div>

      <template #extra>
        <Space>
          <Button @click="open = false">取消</Button>
          <Button type="primary" @click="handleSubmit">确定</Button>
        </Space>
      </template>
    </Drawer>
  </ConfigProvider>
</template>

<script setup lang="ts">
  import { Drawer, ConfigProvider, Space, Button, message } from 'ant-design-vue';
  import { onMounted, ref } from 'vue';
  import { BasicTable, useTable } from '@/components/Table';
  import { SelectTableProps } from './state';
  import zhCN from 'ant-design-vue/es/locale/zh_CN';
  import dayjs from 'dayjs';
  import 'dayjs/locale/zh-cn';
  import { defaultProps } from './functional';

  dayjs.locale('zh-cn');
  // const emit = defineEmits(['register']);
  const open = ref<boolean>(true);

  const bodyStyle = {
    padding: 0,
  };

  const props = withDefaults(defineProps<SelectTableProps>(), defaultProps);

  const [registerTable, { setProps, getSelectRows, reload }] = useTable({
    immediate: false,
    api: props.api!,
    columns: props.columns,
    rowKey: props.rowKey,
    size: 'small',
    loading: true,
    showIndexColumn: false,
    canResize: true,
    isCanResizeParent: false,
    resizeHeightOffset: -5,
  });

  onMounted(() => {
    const { multiple, formConfig } = props;
    const schemas = formConfig.schemas ?? props.schemas;
    schemas?.forEach((item) => {
      item.colProps = item.colProps ?? { span: 8 };
    });
    formConfig.schemas = schemas;
    formConfig.compact = true;
    setProps({
      useSearchForm: !!formConfig.schemas,
      formConfig: formConfig,
      rowSelection: multiple ? { type: 'checkbox' } : { type: 'radio' },
    });
    reload();
  });

  async function handleSubmit() {
    const selectRows = getSelectRows();
    if (selectRows.length === 0) {
      message.warning('请选择数据');
      return;
    }
    try {
      props.onOK && (await props.onOK(selectRows));
    } finally {
      open.value = false;
    }
  }
</script>
