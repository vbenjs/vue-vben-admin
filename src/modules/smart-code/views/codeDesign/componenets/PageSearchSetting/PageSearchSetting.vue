<template>
  <div class="full-height">
    <SmartTable
      v-bind="$attrs"
      :data="dataList"
      @register="registerTable"
      :size="tableSizeConfig"
    />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, PropType, ref, watch } from 'vue';

  import { SmartTable, useSmartTable } from '@/components/SmartTable';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { useI18n } from 'vue-i18n';

  import { getPageSearchSettingColumn } from '../../CodeDesignPage.config';

  const props = defineProps({
    tableData: {
      type: Array as PropType<Array<any>>,
      default: () => [],
    },
    editData: {
      type: Array as PropType<Array<any>>,
    },
  });

  const { t } = useI18n();
  const { tableSizeConfig } = useSizeSetting();

  const dataList = ref<Array<any>>([]);

  watch(
    () => props.tableData,
    () => {
      dataList.value = createDataFromTableData(props.tableData, props.editData);
    },
  );
  onMounted(() => {
    dataList.value = createDataFromTableData(props.tableData, props.editData);
  });

  const [registerTable] = useSmartTable({
    columns: getPageSearchSettingColumn(t),
    rowConfig: {
      isHover: true,
      useKey: true,
      dragConfig: true,
      keyField: 'javaProperty',
    },
    editConfig: {
      trigger: 'click',
      mode: 'cell',
      showStatus: true,
      showUpdateStatus: true,
      showInsertStatus: true,
    },
    keepSource: true,
    border: true,
    stripe: true,
    align: 'center',
    columnConfig: {
      resizable: true,
    },
    mouseConfig: { selected: true },
    keyboardConfig: {
      isArrow: true,
      isDel: true,
      isEnter: true,
      isTab: true,
      isEdit: true,
      isChecked: true,
    },
  });

  const copyField = [
    'columnName',
    'remarks',
    'nullable',
    'javaProperty',
    'extType',
    'javaType',
    'simpleJavaType',
  ];

  const createDataFromTableData = (tableData: Array<any>, editData: any[] | undefined) => {
    if (editData) {
      return editData;
    }
    return tableData.map((item) => {
      const data: any = {};
      copyField.forEach((field) => {
        data[field] = item[field];
      });
      return Object.assign(data, {
        title: data.remarks || data.javaProperty,
        readonly: false,
        visible: true,
        hidden: false,
        used: true,
        controlType: 'INPUT',
        searchSymbol: '=',
        rules: [],
        useTableSearch: false,
      });
    });
  };
</script>
<style scoped></style>
