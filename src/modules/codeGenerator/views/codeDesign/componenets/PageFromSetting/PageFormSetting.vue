<template>
  <div class="full-height">
    <vxe-grid
      v-bind="$attrs"
      ref="tableRef"
      :size="tableSizeConfig"
      :columns="columns"
      row-key
      highlight-hover-row
      stripe
      :data="data"
      align="center"
    >
      <template #table-drop="{ rowIndex }">
        <div class="table-drop" :data-id="rowIndex">
          <MenuOutlined />
        </div>
      </template>
      <template #table-title="{ row }">
        <a-input v-model:value="row.title" :size="formSizeConfig" />
      </template>
      <template #table-visible="{ row }">
        <a-checkbox v-model:checked="row.visible" :size="formSizeConfig" />
      </template>
      <template #table-hidden="{ row }">
        <a-checkbox v-model:checked="row.hidden" :size="formSizeConfig" />
      </template>
      <template #table-readonly="{ row }">
        <a-checkbox v-model:checked="row.readonly" :size="formSizeConfig" />
      </template>
      <template #table-useTableSearch="{ row }">
        <a-checkbox v-model:checked="row.useTableSearch" :size="formSizeConfig" />
      </template>
      <template #table-tableName="{ row }">
        <a-input
          v-model:value="row.tableName"
          :disabled="!row.useTableSearch"
          :size="formSizeConfig"
        />
      </template>
      <template #table-keyColumnName="{ row }">
        <a-input
          v-model:value="row.keyColumnName"
          :disabled="!row.useTableSearch"
          :size="formSizeConfig"
        />
      </template>
      <template #table-valueColumnName="{ row }">
        <a-input
          v-model:value="row.valueColumnName"
          :disabled="!row.useTableSearch"
          :size="formSizeConfig"
        />
      </template>
      <template #table-tableWhere="{ row }">
        <a-input v-model:value="row.tableWhere" :size="formSizeConfig" />
      </template>
      <template #table-controlType="{ row }">
        <a-select v-model:value="row.controlType" :size="formSizeConfig" style="width: 100px">
          <a-select-option v-for="item in controlList" :key="item.key" :value="item.key">
            {{ $t(item.value) }}
          </a-select-option>
        </a-select>
        <a-tooltip v-if="row.controlType === 'SELECT_TABLE'" placement="top">
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
        <Icon
          v-if="row.autoValidate === true || (row.ruleList && row.ruleList.length > 0)"
          color="red"
          icon="ant-design:info-circle-outlined"
        />
        <a-button :size="tableButtonSizeConfig" @click="() => openRuleSetModal(true, row)">
          设置规则
        </a-button>
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
      <template #table-used="{ row }">
        <a-checkbox v-model:checked="row.used" :disabled="!row.visible" :size="formSizeConfig" />
      </template>
    </vxe-grid>
    <!--  下拉表格设置  -->
    <PageAddendumTableChoseModal
      @ok="handleChoseTable"
      :select-table-list="currentRow.selectTableList === null ? [] : currentRow.selectTableList"
      @register="registerSelectTableModal"
    />
    <!--  验证规则  -->
    <FormRuleSetModal @register="registerFormRuleSetModal" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted, watch, toRefs } from 'vue';
  import type { Ref, PropType } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';

  import { MenuOutlined, PlusOutlined } from '@ant-design/icons-vue';

  import FormRuleSetModal from './FormRuleSetModal.vue';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { useModal } from '@/components/Modal';
  import PageAddendumTableChoseModal from '../PageAddendumTableChoseModal.vue';

  import { useVxeTableSortable } from '@/components/SmartTable';
  import {
    controlList,
    getRuleList,
    vueTableHeaderCheckboxSupport,
    vueChoseSelectTableSupport,
  } from '../PageSettingSupport';
  import Icon from '@/components/Icon/src/Icon.vue';

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
        rules: [],
        useTableSearch: false,
      });
    });
  };

  export default defineComponent({
    name: 'PageFormSetting',
    components: {
      Icon,
      MenuOutlined,
      PlusOutlined,
      FormRuleSetModal,
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
      const sizeConfigHoops = useSizeSetting();
      const { t } = useI18n();
      const { tableData, editData } = toRefs(props);
      const tableRef = ref();
      const data = ref<Array<any>>([]);
      const currentRow = ref<any>({});

      const [registerFormRuleSetModal, { openModal: openRuleSetModal }] = useModal();

      watch(tableData, () => {
        data.value = createDataFromTableData(tableData.value, editData);
      });
      onMounted(() => {
        data.value = createDataFromTableData(tableData.value, editData);
      });
      const getData = () => {
        return data.value;
      };

      const { checked } = vueTableHeaderCheckboxSupport(data, 'visible');
      return {
        data,
        getData,
        tableRef,
        currentRow,
        ...sizeConfigHoops,
        openRuleSetModal,
        registerFormRuleSetModal,
        ...vueChoseSelectTableSupport(currentRow),
        ...useVxeTableSortable(tableRef, '.table-drop', data),
        ruleList: ref(getRuleList(t)),
        controlList: ref(controlList),
        headerVisibleCheckboxChecked: checked,
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
            title: '{generator.views.formSetting.title.useTableSearch}',
            field: 'useTableSearch',
            width: 110,
            slots: {
              default: 'table-useTableSearch',
            },
          },
          {
            title: '{generator.views.design.formSetting.title.tableName}',
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
            title: '{generator.views.formSetting.title.rules}',
            field: 'rules',
            width: 180,
            slots: {
              default: 'table-rules',
            },
          },
          {
            title: '{generator.views.code.table.remarks}',
            field: 'remarks',
            width: 160,
            align: 'left',
            headerAlign: 'center',
          },
        ],
      };
    },
  });
</script>

<style scoped></style>
