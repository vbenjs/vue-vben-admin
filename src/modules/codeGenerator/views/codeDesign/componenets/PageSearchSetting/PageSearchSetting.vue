<template>
  <div class="full-height">
    <vxe-grid
      ref="tableRef"
      row-key
      :size="tableSizeConfig"
      :columns="columns"
      :data="data"
      align="center"
      highlight-hover-row
      stripe
      v-bind="$attrs"
    >
      <template #table-drop="{ rowIndex }">
        <div class="table-drop" :data-id="rowIndex">
          <MenuOutlined />
        </div>
      </template>
      <template #table-title="{ row }">
        <a-input v-model:value="row.title" :disabled="!row.visible" :size="formSizeConfig" />
      </template>
      <template #table-visible="{ row }">
        <a-checkbox v-model:checked="row.visible" :size="formSizeConfig" />
      </template>
      <template #table-hidden="{ row }">
        <a-checkbox v-model:checked="row.hidden" :disabled="!row.visible" :size="formSizeConfig" />
      </template>
      <template #table-readonly="{ row }">
        <a-checkbox
          v-model:checked="row.readonly"
          :disabled="!row.visible"
          :size="formSizeConfig"
        />
      </template>
      <template #table-used="{ row }">
        <a-checkbox v-model:checked="row.used" :disabled="!row.visible" :size="formSizeConfig" />
      </template>
      <template #table-searchSymbol="{ row }">
        <a-select
          v-model:value="row.searchSymbol"
          :disabled="!row.visible"
          :size="formSizeConfig"
          style="width: 100px"
        >
          <a-select-option v-for="item in searchSymbolList" :key="item" :value="item">
            {{ item }}
          </a-select-option>
        </a-select>
      </template>
      <template #table-useTableSearch="{ row }">
        <a-checkbox
          v-model:checked="row.useTableSearch"
          :disabled="!row.visible"
          :size="formSizeConfig"
        />
      </template>
      <template #table-tableName="{ row }">
        <a-input
          v-model:value="row.tableName"
          :disabled="!(row.useTableSearch && row.visible)"
          :size="formSizeConfig"
        />
      </template>
      <template #table-keyColumnName="{ row }">
        <a-input
          v-model:value="row.keyColumnName"
          :disabled="!(row.useTableSearch && row.visible)"
          :size="formSizeConfig"
        />
      </template>
      <template #table-valueColumnName="{ row }">
        <a-input
          v-model:value="row.valueColumnName"
          :disabled="!(row.useTableSearch && row.visible)"
          :size="formSizeConfig"
        />
      </template>
      <template #table-tableWhere="{ row }">
        <a-input v-model:value="row.tableWhere" :size="formSizeConfig" />
      </template>
      <template #table-controlType="{ row }">
        <a-select
          v-model:value="row.controlType"
          :disabled="!row.visible"
          style="width: 100px"
          :size="formSizeConfig"
        >
          <a-select-option v-for="item in controlList" :key="item.key" :value="item.key">
            {{ $t(item.value) }}
          </a-select-option>
        </a-select>
        <a-tooltip v-if="row.controlType === 'selectTable'" placement="top">
          <template #title>
            <span>选择表格</span>
          </template>
          <PlusOutlined
            :style="{ cursor: 'pointer', 'margin-left': '5px' }"
            @click="() => handleShowChoseSelectTable(row)"
          />
        </a-tooltip>
      </template>
      <template #table-rules="{ row }">
        <a-select
          v-model:value="row.rules"
          :disabled="!row.visible"
          mode="multiple"
          :size="formSizeConfig"
          style="width: 160px"
        >
          <a-select-option v-for="item in ruleList" :key="item.key" :value="item.key">
            {{ item.value }}
          </a-select-option>
        </a-select>
      </template>
      <template #table-visible-header="{ column }">
        <a-checkbox v-model:checked="headerVisibleCheckboxChecked" :size="formSizeConfig" />
        {{ $t(column.title.replace('{', '').replace('}', '')) }}
      </template>
      <template #table-hidden-header="{ column }">
        <a-checkbox v-model:checked="headerHiddenCheckboxChecked" :size="formSizeConfig" />
        {{ $t(column.title.replace('{', '').replace('}', '')) }}
      </template>
      <template #table-readonly-header="{ column }">
        <a-checkbox v-model:checked="headerReadonlyCheckboxChecked" :size="formSizeConfig" />
        {{ $t(column.title.replace('{', '').replace('}', '')) }}
      </template>
      <template #table-used-header="{ column }">
        <a-checkbox v-model:checked="headerUseCheckboxChecked" :size="formSizeConfig" />
        {{ $t(column.title.replace('{', '').replace('}', '')) }}
      </template>
    </vxe-grid>
    <PageAddendumTableChoseModal
      @ok="handleChoseTable"
      :select-table-list="currentRow.selectTableList == null ? [] : currentRow.selectTableList"
      @register="registerSelectTableModal"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, toRefs, watch } from 'vue';
  import type { Ref, PropType } from 'vue';

  import { MenuOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import PageAddendumTableChoseModal from '../PageAddendumTableChoseModal.vue';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { useVxeTableSortable } from '@/components/SmartTable';

  import {
    controlList,
    getRuleList,
    searchSymbolList,
    vueTableHeaderCheckboxSupport,
    vueChoseSelectTableSupport,
  } from '../PageSettingSupport';
  import { useI18n } from '@/hooks/web/useI18n';

  const copyField = [
    'columnName',
    'remarks',
    'nullable',
    'javaProperty',
    'extType',
    'javaType',
    'simpleJavaType',
  ];

  /**
   * 创建数据
   */
  const createDataFromTableData = (tableData: Array<any>, editData: Ref | undefined) => {
    if (editData && editData.value) {
      return editData.value;
    }
    return tableData.map((item) => {
      const data: any = {};
      copyField.forEach((field) => {
        data[field] = item[field];
      });
      return Object.assign(data, {
        title: data.remarks,
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

  /**
   * 搜索配置页面
   */
  export default defineComponent({
    name: 'PageSearchSetting',
    components: {
      MenuOutlined,
      PlusOutlined,
      PageAddendumTableChoseModal,
    },
    props: {
      tableData: {
        type: Array as PropType<Array<any>>,
        default: () => [],
      },
      editData: {
        type: Array as PropType<Array<any>>,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { tableData, editData } = toRefs(props);
      const sizeConfigHoops = useSizeSetting();
      const tableRef = ref();
      const data = ref<Array<any>>([]);
      const currentRow = ref<any>({});
      watch(tableData, () => {
        data.value = createDataFromTableData(tableData.value, editData);
      });
      onMounted(() => {
        data.value = createDataFromTableData(tableData.value, editData);
      });
      const getData = () => {
        return data.value;
      };
      return {
        ...sizeConfigHoops,
        data,
        getData,
        tableRef,
        currentRow,
        ...vueChoseSelectTableSupport(currentRow),
        ...useVxeTableSortable(tableRef, '.table-drop', data),
        ruleList: ref(getRuleList(t)),
        controlList: ref(controlList),
        searchSymbolList: ref(searchSymbolList),
        headerVisibleCheckboxChecked: vueTableHeaderCheckboxSupport(data, 'visible').checked,
        headerHiddenCheckboxChecked: vueTableHeaderCheckboxSupport(data, 'hidden', false).checked,
        headerReadonlyCheckboxChecked: vueTableHeaderCheckboxSupport(data, 'readonly', false)
          .checked,
        headerUseCheckboxChecked: vueTableHeaderCheckboxSupport(data, 'used', true).checked,
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
            title: '{generator.views.formSetting.title.controlType}',
            field: 'controlType',
            width: 150,
            slots: {
              default: 'table-controlType',
            },
          },
          {
            title: '{generator.views.formSetting.title.readonly}',
            field: 'readonly',
            width: 110,
            slots: {
              default: 'table-readonly',
              header: 'table-readonly-header',
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
            title: '{generator.views.formSetting.title.used}',
            field: 'used',
            width: 110,
            slots: {
              default: 'table-used',
              header: 'table-used-header',
            },
          },
          {
            title: '{generator.views.searchSetting.title.searchSymbol}',
            field: 'searchSymbol',
            width: 120,
            slots: {
              default: 'table-searchSymbol',
            },
          },
          {
            title: '{generator.views.formSetting.title.useTableSearch}',
            field: 'useTableSearch',
            width: 110,
            slots: {
              default: 'table-useTableSearch',
            },
          },
          {
            title: '{generator.views.code.table.tableName}',
            field: 'tableName',
            width: 120,
            slots: {
              default: 'table-tableName',
            },
          },
          {
            title: '{generator.views.formSetting.title.keyColumnName}',
            field: 'keyColumnName',
            width: 120,
            slots: {
              default: 'table-keyColumnName',
            },
          },
          {
            title: '{generator.views.formSetting.title.valueColumnName}',
            field: 'valueColumnName',
            width: 120,
            slots: {
              default: 'table-valueColumnName',
            },
          },
          {
            title: '{generator.views.formSetting.title.tableWhere}',
            field: 'tableWhere',
            minWidth: 180,
            slots: {
              default: 'table-tableWhere',
            },
          },
          {
            title: '{generator.views.code.table.remarks}',
            field: 'remarks',
            minWidth: 160,
            align: 'left',
            headerAlign: 'center',
          },
        ],
      };
    },
  });
</script>

<style scoped></style>
