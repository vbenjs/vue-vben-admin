<script lang="ts" setup>
import type { OnActionClickParams, VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Button, message } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getExampleTableApi } from '#/api';

interface RowType {
  category: string;
  color: string;
  id: string;
  price: string;
  productName: string;
  releaseDate: string;
}

const gridOptions: VxeGridProps<RowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'category',
  },
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { field: 'category', sortable: true, title: 'Category' },
    { field: 'color', sortable: true, title: 'Color' },
    { field: 'productName', sortable: true, title: 'Product Name' },
    { field: 'price', sortable: true, title: 'Price' },
    { field: 'releaseDate', formatter: 'formatDateTime', title: 'DateTime' },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'category',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'view',
            text: '查看',
          },
          'edit',
        ],
      },
      field: 'operation',
      fixed: 'right',
      headerAlign: 'center',
      showOverflow: false,
      title: $t('system.menu.operation'),
      width: 200,
    },
  ],
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page, sort }) => {
        return await getExampleTableApi({
          page: page.currentPage,
          pageSize: page.pageSize,
          sortBy: sort.field,
          sortOrder: sort.order,
        });
      },
    },
    sort: true,
  },
  sortConfig: {
    defaultSort: { field: 'category', order: 'desc' },
    remote: true,
  },
  toolbarConfig: {
    custom: true,
    export: true,
    // import: true,
    refresh: true,
    zoom: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  viewedRowOptions: {
    // 触发已读的操作码
    actionCodes: ['view'],
    // 行数据中的唯一标识字段
    keyField: 'id',
    // 持久化配置（简写模式，使用内置 localStorage）
    // persist: 'viewed_rows',
    persist: {
      key: 'viewed-rows',
      type: 'indexedDB',
      ttl: 7 * 24 * 60 * 60 * 1000, // 7天过期
      maxSize: 200,
    },
  },
});

function onActionClick({ code, row }: OnActionClickParams<RowType>) {
  switch (code) {
    case 'edit': {
      onEdit(row);
      break;
    }
    case 'view': {
      onView(row);
      break;
    }
    default: {
      break;
    }
  }
}

const editRow = ref<RowType>();
const [Modal, modalApi] = useVbenModal({
  draggable: true,
  onConfirm: () => {
    modalApi.setState({ loading: true });
    editRow.value && gridApi.markRowAsViewed(editRow.value);
    modalApi.setState({ loading: false });
    modalApi.close();
  },
});

function onEdit(row: RowType) {
  editRow.value = row;
  modalApi.open();
}

function onView(row: RowType) {
  message.success({
    content: `查看${row.category}`,
    key: 'action_process_msg_id',
  });
}

const isStyle = ref(false);

function onStyleSet() {
  isStyle.value = !isStyle.value;
  gridApi.setState({
    viewedRowOptions: {
      rowStyle: () => {
        return isStyle.value ? { backgroundColor: 'gray' } : '';
      },
    },
  });
}

const isClassName = ref(false);

function onClassNameSet() {
  isClassName.value = !isClassName.value;
  gridApi.setState({
    viewedRowOptions: {
      rowClassName: () => {
        return isClassName.value
          ? 'bg-red-100 vxe-row--viewed'
          : 'vxe-row--viewed';
      },
    },
  });
}

function onCustomSet() {
  const tableData = gridApi.grid.getData();
  const keys = tableData.slice(0, 2).map((row) => row.id);
  gridApi.markKeysAsViewed(keys);
}

function onClearViewed() {
  gridApi.clearViewedRows();
}
</script>

<template>
  <Page
    auto-content-height
    description="表格行标记支持存储类型 custom | indexedDB | localStorage | memory | sessionStorage 。
    默认使用memory存储，当设置custom时需要自己实现getKeys()/setKeys()/removeKeys()。
    具体属性查看packages/effects/plugins/src/vxe-table/types.ts。可通过gridApi调用
    clearViewedRows()/getViewedKeys()/isRowViewed()/markKeysAsViewed()/markRowAsViewed()/removeViewedKeys()"
    title="表格行标记示例"
  >
    <Modal class="w-150" title="数据修改"> 数据修改完成后设置行标记</Modal>
    <Grid table-title="已查看行标记" table-title-help="提示">
      <template #toolbar-tools>
        <Button class="mr-2" type="primary" @click="onCustomSet">
          手动标记
        </Button>
        <Button class="mr-2" type="primary" @click="onStyleSet">
          设置Style
        </Button>
        <Button class="mr-2" type="primary" @click="onClassNameSet">
          设置ClassName
        </Button>
        <Button type="primary" @click="onClearViewed"> 清空缓存</Button>
      </template>
    </Grid>
  </Page>
</template>
