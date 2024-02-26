<template>
  <div>
    <vxe-grid
      align="center"
      stripe
      v-bind="$attrs"
      :size="tableSizeConfig"
      border
      :columns="columns"
    >
      <template #table-nullable="{ row }">
        <a-switch :size="formSizeConfig" disabled :checked="row.nullable === 1" />
      </template>
      <template #table-primaryKey="{ row }">
        <a-switch :size="formSizeConfig" disabled :checked="row.primaryKey" />
      </template>
      <template #table-indexed="{ row }">
        <a-switch :size="formSizeConfig" disabled :checked="row.indexed" />
      </template>
    </vxe-grid>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';

  /**
   * 数据库字段信息
   */
  export default defineComponent({
    name: 'TableFieldTable',
    setup() {
      const sizeConfigHoops = useSizeSetting();
      return {
        ...sizeConfigHoops,
      };
    },
    data() {
      return {
        columns: [
          {
            field: 'columnName',
            title: '{generator.views.tableField.title.columnName}',
            width: 160,
            align: 'left',
            headerAlign: 'center',
          },
          {
            field: 'typeName',
            title: '{generator.views.tableField.title.typeName}',
            width: 120,
          },
          {
            field: 'columnSize',
            title: '{generator.views.tableField.title.columnSize}',
            width: 120,
          },
          {
            field: 'decimalDigits',
            title: '{generator.views.tableField.title.decimalDigits}',
            width: 120,
          },
          {
            field: 'columnDef',
            title: '{generator.views.tableField.title.columnDef}',
            width: 120,
          },
          {
            field: 'nullable',
            title: '{generator.views.tableField.title.nullable}',
            width: 120,
            slots: {
              default: 'table-nullable',
            },
          },
          {
            field: 'remarks',
            title: '{generator.views.tableField.title.remarks}',
            minWidth: 120,
            align: 'left',
            headerAlign: 'center',
          },
          {
            field: 'primaryKey',
            title: '{generator.views.tableField.title.primaryKey}',
            width: 120,
            slots: {
              default: 'table-primaryKey',
            },
          },
          {
            field: 'indexed',
            title: '{generator.views.tableField.title.indexed}',
            width: 120,
            slots: {
              default: 'table-indexed',
            },
          },
        ],
      };
    },
  });
</script>

<style scoped></style>
