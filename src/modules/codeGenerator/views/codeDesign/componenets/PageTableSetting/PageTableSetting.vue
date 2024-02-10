<template>
  <div class="full-height">
    <vxe-grid
      v-bind="$attrs"
      ref="tableRef"
      :size="tableSizeConfig"
      :data="data"
      row-key
      align="center"
      highlight-hover-row
      stripe
      :columns="columns"
    >
      <template #table-sortable="{ row }">
        <a-checkbox v-model:checked="row.sortable" :size="formSizeConfig" />
      </template>
      <template #table-fixed="{ row }">
        <a-select v-model:value="row.fixed" :size="formSizeConfig" style="width: 100px">
          <a-select-option value="left">left</a-select-option>
          <a-select-option value="right">right</a-select-option>
        </a-select>
      </template>
      <template #table-resizable="{ row }">
        <a-checkbox v-model:checked="row.resizable" :size="formSizeConfig" />
      </template>
      <template #table-visible="{ row }">
        <a-checkbox v-model:checked="row.visible" :size="formSizeConfig" />
      </template>
      <template #table-hidden="{ row }">
        <a-checkbox v-model:checked="row.hidden" :size="formSizeConfig" />
      </template>
      <template #table-align="{ row }">
        <a-select v-model:value="row.align" :size="formSizeConfig" style="width: 100px">
          <a-select-option value="left">left</a-select-option>
          <a-select-option value="center">center</a-select-option>
          <a-select-option value="right">right</a-select-option>
        </a-select>
      </template>
      <template #table-title="{ row }">
        <a-input v-model:value="row.title" :size="formSizeConfig" />
      </template>
      <template #table-width="{ row }">
        <a-input v-model:value="row.width" :size="formSizeConfig" />
      </template>
      <template #table-format="{ row }">
        <a-input v-model:value="row.format" :size="formSizeConfig" />
      </template>
      <template #table-drop="{ rowIndex }">
        <div class="table-drop" :data-id="rowIndex">
          <MenuOutlined />
        </div>
      </template>
      <template #table-visible-header="{ column }">
        <a-checkbox v-model:checked="headerVisibleCheckboxChecked" :size="formSizeConfig" />
        {{ $t(column.title.replace('{', '').replace('}', '')) }}
      </template>
      <template #table-sortable-header="{ column }">
        <a-checkbox v-model:checked="headerSortableCheckboxChecked" :size="formSizeConfig" />
        {{ $t(column.title.replace('{', '').replace('}', '')) }}
      </template>
      <template #table-resizable-header="{ column }">
        <a-checkbox v-model:checked="headerResizableCheckboxChecked" :size="formSizeConfig" />
        {{ $t(column.title.replace('{', '').replace('}', '')) }}
      </template>
      <template #table-hidden-header="{ column }">
        <a-checkbox v-model:checked="headerHiddenCheckboxChecked" :size="formSizeConfig" />
        {{ $t(column.title.replace('{', '').replace('}', '')) }}
      </template>
      <!--   是否可编辑   -->
      <template #table-editable="{ row }">
        <a-checkbox v-model:checked="row.editable" :size="formSizeConfig" />
      </template>
      <template #table-editable-header="{ column }">
        <a-checkbox v-model:checked="headerEditableCheckboxChecked" :size="formSizeConfig" />
        {{ $t(column.title.replace('{', '').replace('}', '')) }}
      </template>
    </vxe-grid>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, watch, toRefs, onMounted, unref } from 'vue';
  import type { Ref, PropType } from 'vue';

  import { MenuOutlined } from '@ant-design/icons-vue';

  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { useVxeTableSortable } from '@/components/SmartTable';
  import { vueTableHeaderCheckboxSupport } from '../PageSettingSupport';

  /**
   * copy列
   */
  const copyField = [
    'columnName',
    'javaProperty',
    'javaType',
    'typeName',
    'columnSize',
    'decimalDigits',
    'columnDef',
    'nullable',
    'remarks',
    'primaryKey',
    'indexed',
    'tableName',
    'extType',
    'simpleJavaType',
  ];

  /**
   * 创建数据
   */
  const createDataFromTableData = (
    tableData: Array<any>,
    editData: Ref<Array<any> | undefined>,
  ) => {
    if (editData && editData.value) {
      const tableDataMap: Record<string, any> = {};
      tableData.forEach((item) => {
        tableDataMap[item.javaProperty] = item;
      });
      return unref(editData)!.map((item) => {
        const itemData = {
          ...item,
        };
        const tableDataItem = tableDataMap[item.javaProperty];
        copyField.forEach((field) => {
          itemData[field] = tableDataItem[field];
        });
        return itemData;
      });
    }
    return tableData.map((item) => {
      const data: any = {};
      copyField.forEach((field) => {
        data[field] = item[field];
      });
      // 获取align
      let align = 'left';
      const typeName = item.typeName;
      if (['DATETIME', 'DATE', 'TIME'].includes(typeName)) {
        align = 'center';
      }
      if (['INT', 'NUMBER', 'NUMERIC', 'LONG', 'BIGINT'].includes(typeName)) {
        align = 'right';
      }
      return Object.assign(data, {
        title: data.remarks && data.remarks.trim() !== '' ? data.remarks : data.javaProperty,
        sortable: false,
        fixed: null,
        width: 120,
        align: align,
        resizable: false,
        visible: true,
        hidden: false,
        format: '',
        // 是否可编辑
        editable: false,
      });
    });
  };

  /**
   * 页面表格配置组件
   */
  export default defineComponent({
    name: 'PageTableSetting',
    components: {
      MenuOutlined,
    },
    props: {
      tableData: {
        type: Array as PropType<Array<any>>,
        default: () => [],
      },
      editData: {
        type: Array as PropType<Array<any> | undefined>,
      },
    },
    setup(props) {
      const tableRef = ref();
      const { tableData, editData } = toRefs(props);
      const data = ref<Array<any>>([]);
      const tableSortableVue = useVxeTableSortable(tableRef, '.table-drop', data);
      watch([tableData, editData], () => {
        data.value = createDataFromTableData(tableData.value, editData);
        console.log(data.value);
      });
      onMounted(() => {
        data.value = createDataFromTableData(tableData.value, editData);
      });
      const getData = () => {
        return data.value;
      };
      const sizeConfigHoops = useSizeSetting();
      return {
        ...sizeConfigHoops,
        ...tableSortableVue,
        data,
        getData,
        tableRef,
        headerVisibleCheckboxChecked: vueTableHeaderCheckboxSupport(data, 'visible').checked,
        headerSortableCheckboxChecked: vueTableHeaderCheckboxSupport(data, 'sortable', false)
          .checked,
        headerResizableCheckboxChecked: vueTableHeaderCheckboxSupport(data, 'resizable', false)
          .checked,
        headerHiddenCheckboxChecked: vueTableHeaderCheckboxSupport(data, 'hidden', false).checked,
        headerEditableCheckboxChecked: vueTableHeaderCheckboxSupport(data, 'editable', false)
          .checked,
      };
    },
    data() {
      return {
        columns: [
          {
            title: '#',
            field: 'drop',
            width: 80,
            slots: {
              default: 'table-drop',
            },
          },
          {
            title: '{generator.views.tableField.title.columnName}',
            field: 'columnName',
            width: 160,
            align: 'left',
            headerAlign: 'center',
          },
          {
            title: '{generator.views.tableField.title.remarks}',
            field: 'remarks',
            width: 160,
            align: 'left',
            headerAlign: 'center',
          },
          {
            title: '{generator.views.tableSetting.title.title}',
            field: 'title',
            width: 160,
            align: 'left',
            headerAlign: 'center',
            slots: {
              default: 'table-title',
            },
          },
          {
            title: '{generator.views.tableSetting.title.sortable}',
            field: 'sortable',
            width: 110,
            slots: {
              default: 'table-sortable',
              header: 'table-sortable-header',
            },
          },
          {
            title: '{generator.views.tableSetting.title.fixed}',
            field: 'fixed',
            width: 120,
            slots: {
              default: 'table-fixed',
            },
          },
          {
            title: '{generator.views.tableSetting.title.width}',
            field: 'width',
            width: 120,
            slots: {
              default: 'table-width',
            },
          },
          {
            title: '{generator.views.tableSetting.title.align}',
            field: 'align',
            width: 120,
            slots: {
              default: 'table-align',
            },
          },
          {
            title: '{generator.views.tableSetting.title.resizable}',
            field: 'resizable',
            width: 110,
            slots: {
              default: 'table-resizable',
              header: 'table-resizable-header',
            },
          },
          {
            title: '{generator.views.tableSetting.title.visible}',
            field: 'visible',
            width: 110,
            slots: {
              default: 'table-visible',
              header: 'table-visible-header',
            },
          },
          {
            title: '{generator.views.tableSetting.title.hidden}',
            field: 'hidden',
            width: 110,
            slots: {
              default: 'table-hidden',
              header: 'table-hidden-header',
            },
          },
          {
            title: '{generator.views.tableSetting.title.editable}',
            field: 'editable',
            width: 110,
            slots: {
              default: 'table-editable',
              header: 'table-editable-header',
            },
          },
          // {
          //   title: '{generator.views.tableSetting.title.format}',
          //   field: 'format',
          //   width: 120,
          //   slots: {
          //     default: 'table-format'
          //   }
          // }
        ],
      };
    },
  });
</script>

<style scoped></style>
