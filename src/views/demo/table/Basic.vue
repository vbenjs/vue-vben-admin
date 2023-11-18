<template>
  <div class="p-4">
    <BasicTable
      title="基础示例"
      titleHelpMessage="温馨提醒"
      :columns="columns"
      :dataSource="data"
      :canResize="canResize"
      :loading="loading"
      :striped="striped"
      :bordered="border"
      showTableSetting
      :pagination="pagination"
      @columns-change="handleColumnChange"
    >
      <template #toolbar>
        <a-button type="primary" @click="toggleCanResize">
          {{ !canResize ? '自适应高度' : '取消自适应' }}
        </a-button>
        <a-button type="primary" @click="toggleBorder">
          {{ !border ? '显示边框' : '隐藏边框' }}
        </a-button>
        <a-button type="primary" @click="toggleLoading"> 开启loading </a-button>
        <a-button type="primary" @click="toggleStriped">
          {{ !striped ? '显示斑马纹' : '隐藏斑马纹' }}
        </a-button>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicTable, ColumnChangeParam } from '@/components/Table';
  import { getBasicColumns, getBasicData } from './tableData';

  const canResize = ref(false);
  const loading = ref(false);
  const striped = ref(true);
  const border = ref(true);
  const pagination = ref<any>(false);

  const columns = getBasicColumns();
  const data = getBasicData();

  function toggleCanResize() {
    canResize.value = !canResize.value;
  }
  function toggleStriped() {
    striped.value = !striped.value;
  }
  function toggleLoading() {
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
      pagination.value = { pageSize: 20 };
    }, 3000);
  }
  function toggleBorder() {
    border.value = !border.value;
  }

  function handleColumnChange(data: ColumnChangeParam[]) {
    console.log('ColumnChanged', data);
  }
</script>
