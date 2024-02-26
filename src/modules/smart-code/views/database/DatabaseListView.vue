<!--
数据列表页面
@author zhongming4762
-->
<template>
  <div class="full-height page-container">
    <LayoutSeparate first-size="240px" :show-line="false" class="full-height layout-container">
      <template #first>
        <div class="full-height system-container">
          <SystemSimpleList
            @current-change="handleSelectSystemChange"
            :row-config="{ isHover: true, isCurrent: true }"
            height="auto"
          />
        </div>
      </template>
      <template #second>
        <SmartTable :size="getTableSize" @register="registerTable">
          <template #table-operation="{ row }">
            <SmartVxeTableAction
              :actions="getTableAction(row)"
              :drop-down-actions="getDropDownAction(row)"
            />
          </template>
        </SmartTable>
      </template>
    </LayoutSeparate>
    <TemplateSelectedModal template-type="template_db_dict" @register="registerModal" />
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from '@/hooks/web/useI18n';

  import {
    ActionItem,
    SmartVxeTableAction,
    SmartTable,
    useSmartTable,
  } from '@/components/SmartTable';

  import TemplateSelectedModal from './components/TemplateSelectedModal.vue';
  import { useModal } from '@/components/Modal';
  import { LayoutSeparate } from '@/components/LayoutSeparate';
  import SystemSimpleList from '@/modules/smart-system/components/system/SystemSimpleList.vue';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';

  import { addEditForm, searchForm, tableColumns } from './DatabaseListView.data';
  import { listApi, deleteApi, getByIdApi, saveUpdateApi } from './DatabaseListView.api';
  import { handleTestConnected } from './DatabaseListHooks';

  const { t } = useI18n();
  const { getTableSize } = useSizeSetting();

  const [registerModal, { openModal }] = useModal();
  let currentSystem: Recordable = {};

  const handleSelectSystemChange = (row) => {
    currentSystem = row;
    query();
  };

  const getTableAction = (row): ActionItem[] => {
    return [
      {
        label: t('common.button.edit'),
        onClick: () => editByRowModal(row),
      },
    ];
  };

  const getDropDownAction = (row): ActionItem[] => {
    return [
      {
        label: t('generator.views.database.button.testConnected'),
        onClick: () => handleTestConnected(row, t, setLoading),
      },
      {
        label: t('generator.views.database.button.createDic'),
        onClick: () => openModal(true, row),
        auth: 'db:connection:createDic',
      },
    ];
  };

  const [registerTable, { editByRowModal, setLoading, query, showAddModal }] = useSmartTable({
    id: 'smart-tool-code-databaseList',
    customConfig: { storage: true },
    searchFormConfig: {
      searchWithSymbol: true,
      schemas: searchForm(t),
      layout: 'inline',
      compact: true,
      actionColOptions: {
        span: undefined,
      },
    },
    addEditConfig: {
      modalConfig: {
        width: 600,
      },
      formConfig: {
        schemas: addEditForm(t),
        baseColProps: {
          span: 24,
        },
      },
    },
    columnConfig: {
      resizable: true,
    },
    border: true,
    height: 'auto',
    columns: tableColumns,
    useSearchForm: true,
    pagerConfig: true,
    sortConfig: {
      remote: true,
    },
    proxyConfig: {
      autoLoad: false,
      ajax: {
        query: (params) => {
          const queryParameter = {
            ...params.ajaxParameter,
            systemId: currentSystem.id,
          };
          return listApi(queryParameter);
        },
        delete: async ({ body }) => {
          await deleteApi(body.removeRecords);
        },
        getById: async (row) => {
          return getByIdApi(row.id);
        },
        save: async ({ body }) => {
          const { insertRecords, updateRecords } = body;
          const data = [...insertRecords, ...updateRecords][0];
          return saveUpdateApi(data);
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      refresh: true,
      column: { columnOrder: true },
      zoom: true,
      buttons: [
        {
          // name: t('common.button.add'),
          code: 'ModalAdd',
          props: {
            onClick: () =>
              showAddModal({
                systemId: currentSystem.id,
              }),
          },
        },
        {
          code: 'ModalEdit',
        },
        {
          code: 'delete',
        },
      ],
    },
  });
</script>

<style scoped lang="less">
  .system-container {
    margin-right: 5px;
    background: white;
  }
</style>
