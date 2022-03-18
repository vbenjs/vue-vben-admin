<template>
  <div class="p-4">
    <BasicTable @register="registerTable" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { BasicTable, useTable } from '@/components/table'
import { getMultipleHeaderColumns } from './tableData'
import { demoListApi } from '@pkg/apis/demo'

export default defineComponent({
  components: { BasicTable },
  setup() {
    const [registerTable] = useTable({
      title: '多级表头示例',
      api: demoListApi,
      columns: getMultipleHeaderColumns(),
    })

    return {
      registerTable,
    }
  },
})
</script>
