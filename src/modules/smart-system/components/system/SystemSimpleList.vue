<template>
  <SmartTable
    class="system-table"
    v-bind="$attrs"
    @register="registerTable"
    @cell-click="handleCellClick"
    @proxy-query="handleAfterLoad"
  />
</template>

<script lang="ts" setup>
  import { ref, unref, watch } from 'vue';
  import { propTypes } from '@/utils/propTypes';

  import { listSystemApi } from '@/api/sys/SystemApi';

  import { SmartTable, useSmartTable } from '@/components/SmartTable';

  const props = defineProps({
    // 是否自动选中第一行
    autoSelected: propTypes.bool.def(true),
    // 是否支持点击取消
    clickCancel: propTypes.bool,
  });

  const emit = defineEmits(['current-change']);

  const currentRef = ref<any>({});

  /**
   * 数据加载完成时间
   */
  const handleAfterLoad = () => {
    if (props.autoSelected) {
      const dataList = getData();
      if (dataList.length > 0) {
        currentRef.value = dataList[0];
      }
    }
  };

  watch(currentRef, (value) => {
    if (value.id) {
      getTableInstance().setCurrentRow(value);
    } else {
      getTableInstance().clearCurrentRow();
    }
    emit('current-change', value);
  });

  const handleCellClick = ({ row }) => {
    if (unref(currentRef).id === row.id && props.clickCancel) {
      currentRef.value = {};
    } else {
      currentRef.value = row;
    }
  };

  const [registerTable, { getTableInstance, getData }] = useSmartTable({
    rowConfig: {
      isHover: true,
      isCurrent: true,
      keyField: 'id',
    },
    toolbarConfig: {
      refresh: true,
    },
    proxyConfig: {
      ajax: {
        query: (params) => {
          return listSystemApi(
            {
              ...params.ajaxParameter,
              sortName: 'seq',
            },
            true,
          );
        },
      },
    },
    columns: [
      {
        field: 'name',
        title: '{system.views.system.title.name}',
        minWidth: 160,
        formatter: ({ row }) => {
          return `${row.name}(${row.code})`;
        },
      },
    ],
  });
</script>

<style lang="less" scoped>
  .system-table {
    :deep(.vxe-body--row) {
      cursor: pointer;
    }
  }
</style>
