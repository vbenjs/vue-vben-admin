<template>
  <Tooltip placement="top">
    <template #title>
      <span>{{ t('导出Excel') }}</span>
    </template>
    <export-outlined @click="handleExport" />
  </Tooltip>
</template>
<script lang="ts" setup>
  import { Tooltip } from 'ant-design-vue';
  import { ExportOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useTableContext } from '../../hooks/useTableContext';
  import { computed, toRaw, unref } from 'vue';
  import { BasicColumn } from '../../..';
  import { jsonToSheetXlsx } from '@/components/Excel';
  import { isArray } from '@/utils/is';

  defineOptions({ name: 'ExportExcel' });

  const table = useTableContext();
  const { t } = useI18n();

  const getValues = computed(() => {
    return unref(table?.getBindValues) || {};
  });

  const exportConfig = computed(() => {
    return unref(getValues).exportConfig || {};
  });

  function getHeader(columns: BasicColumn[]) {
    const header: {
      [index: string]: string;
    } = {};
    const headerKey: (string | number | readonly (string | number)[] | undefined)[] = [];
    const headerIndex: string[] = [];
    columns.forEach((col) => {
      const colKey = col.dataIndex ?? col.key;
      const key: string = isArray(colKey) ? [...colKey].pop() : colKey;
      header[key] = col.title as string;
      headerKey.push(colKey);
      headerIndex.push(key);
    });
    return { header, headerIndex, headerKey };
  }
  const getDeepData = (arr: string[], data?: Object) => {
    if (!data) return;
    const newArr = [...arr];
    if (newArr.length > 0) {
      const key = newArr.shift() as string;
      return getDeepData(newArr, data[key]);
    } else {
      return data;
    }
  };

  function handleExport() {
    const columns = table.getColumns({ ignoreIndex: true, ignoreAction: true });
    const { header, headerIndex, headerKey } = getHeader(columns);
    const selectRow = toRaw(table.getSelectRows());
    const dataSource = selectRow.length > 0 ? selectRow : toRaw(table.getDataSource());
    const data = dataSource.map((item) => {
      const obj: { [index: string]: string | number | undefined } = {};
      headerKey.forEach((colKey) => {
        let key = '';
        let value: string | undefined;
        if (isArray(colKey)) {
          key = [...colKey].pop();
          const deepData = getDeepData(colKey, item);
          value = deepData;
        } else {
          key = colKey as string;
          value = item[colKey as string];
        }
        if (unref(exportConfig)[key]?.ifShow === false) return;
        const formatter = unref(exportConfig)[key]?.formatter;
        obj[key] = !formatter ? value : formatter({ text: value, record: item });
      });
      return obj;
    });
    jsonToSheetXlsx({
      data,
      header,
      filename: '表格.xlsx',
      json2sheetOpts: {
        header: headerIndex,
      },
    });
  }
</script>
