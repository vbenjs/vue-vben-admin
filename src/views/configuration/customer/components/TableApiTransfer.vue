<template>
  <div class="flex w-full">
    <BasicTable
      class="w-[calc(50%-30px)] !p-0"
      title="列表"
      ref="listTable"
      :columns="columns"
      :search-info="{
        notInCustomerId: customerId,
      }"
      :api="api"
      size="small"
      :use-search-form="true"
      :formConfig="getFormConfig('left')"
      :canResize="true"
      :isCanResizeParent="false"
      :resize-height-offset="15"
      :show-index-column="false"
      :scroll="{ x: true }"
      :rowSelection="{ type: 'checkbox' }"
    />
    <div class="w-15 mt-30% flex flex-col items-center">
      <a-button class="mb-2 px-1.5 py-1" @click="handleCreate">
        <Icon icon="ant-design:right-outlined" />
      </a-button>
      <a-button class="px-1.5 py-1" @click="handleDelete">
        <Icon icon="ant-design:left-outlined" />
      </a-button>
    </div>
    <BasicTable
      class="w-[calc(50%-30px)] !p-0"
      title="已关联"
      ref="selectedTable"
      :columns="columns"
      size="small"
      :use-search-form="true"
      :formConfig="getFormConfig('right')"
      :canResize="true"
      :isCanResizeParent="false"
      :pagination="false"
      :resize-height-offset="15"
      :show-index-column="false"
      :scroll="{ x: true }"
      :rowSelection="{ type: 'checkbox' }"
      :handleSearchInfoFn="({ name }) => init(name)"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref, PropType, unref, onMounted } from 'vue';
  import { BasicTable, FormProps, TableActionType } from '@/components/Table';
  import { Icon } from '@/components/Icon';
  import { SysDataRelation } from '@/ApiModel/configuration/customer';

  defineOptions({ name: 'TableApiTransfer' });

  const props = defineProps({
    api: {
      type: Function as PropType<(arg) => Promise<any>>,
      default: null,
    },
    params: { type: Object },
    disabled: { type: Boolean, default: false },
    columns: {
      type: Array as PropType<Array<any>>,
      default: () => [],
    },
    createApi: {
      type: Function as PropType<(data: SysDataRelation) => Promise<void>>,
      required: true,
    },
    deleteApi: {
      type: Function as PropType<(data: SysDataRelation) => Promise<void>>,
      required: true,
    },
    initApi: {
      type: Function as PropType<(arg) => Promise<any[]>>,
      required: true,
    },
    customerId: {
      type: Number,
      required: true,
    },
  });

  const emit = defineEmits(['options-change', 'change', 'update:value']);

  const listTable = ref();
  const selectedTable = ref();

  const getFormConfig = (dire: 'left' | 'right') => {
    return {
      autoSubmitOnEnter: true,
      submitOnChange: true,
      showActionButtonGroup: false,
      compact: true,
      schemas: [
        {
          label: '名称',
          field: dire === 'left' ? `info` : 'name',
          component: 'Input',
          colProps: { span: 24 },
        },
      ],
    } as Partial<FormProps>;
  };

  function getListTable() {
    const tableAction = unref(listTable);
    if (!tableAction) {
      throw new Error('listTable is null');
    }
    return tableAction as TableActionType;
  }

  function getSelectedTable() {
    const tableAction = unref(selectedTable);
    if (!tableAction) {
      throw new Error('selectedTable is null');
    }
    return tableAction as TableActionType;
  }

  const init = async (value?: string) => {
    const selected = await props.initApi(props.customerId);
    const tableData = value
      ? selected.filter((item) => item.name?.indexOf(value) !== -1)
      : selected;
    getSelectedTable().setTableData(tableData);
  };

  const reload = async () => {
    getSelectedTable().clearSelectedRowKeys();
    getListTable().clearSelectedRowKeys();
    getListTable().reload();
    init();
  };

  const handleCreate = async () => {
    const rows = getListTable().getSelectRows();
    if (rows.length === 0) {
      return;
    }
    await props.createApi({ mainId: props.customerId, subIds: rows.map((item) => item.id) });
    reload();
  };

  const handleDelete = async () => {
    const rows = getSelectedTable().getSelectRows();
    if (rows.length === 0) {
      return;
    }
    await props.deleteApi({ mainId: props.customerId, subIds: rows.map((item) => item.id) });
    reload();
  };

  onMounted(async () => {
    await init();
  });
</script>
<style lang="less" scoped>
  // table组件
  :deep .ant-table {
    width: 100% !important;
    .ant-table-body {
      overflow: auto !important;
      th,
      tr,
      td {
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-word;
        overflow: hidden;
        min-width: 100px;
      }
    }
    .ant-table-tbody {
      th,
      tr,
      td {
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-word;
        overflow: hidden;
        min-width: 100px;
      }
    }
  }
</style>
