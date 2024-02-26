<template>
  <div class="full-height page-container">
    <LayoutSeparate first-size="240px" :show-line="false" class="full-height">
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
        <SmartTable @register="registerTable" :size="getTableSize">
          <template #table-operation="{ row }">
            <SmartVxeTableAction :actions="getActions(row)" />
          </template>
          <template #form-publicKeyFile="{ model }">
            <Upload
              v-model:fileList="model.publicKeyFileList"
              accept=".keystore"
              :max-count="1"
              :beforeUpload="() => false"
            >
              <a-button>Upload</a-button>
            </Upload>
          </template>
          <template #form-privateKeyFile="{ model }">
            <Upload
              v-model:fileList="model.privateKeyFileList"
              accept=".keystore"
              :max-count="1"
              :beforeUpload="() => false"
            >
              <a-button>Upload</a-button>
            </Upload>
          </template>
        </SmartTable>
      </template>
    </LayoutSeparate>
  </div>
</template>

<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { Upload } from 'ant-design-vue';
  import {
    ActionItem,
    SmartTable,
    SmartVxeTableAction,
    useSmartTable,
  } from '@/components/SmartTable';
  import LayoutSeparate from '@/components/LayoutSeparate/src/LayoutSeparate';
  import SystemSimpleList from '@/modules/smart-system/components/system/SystemSimpleList.vue';
  import { hasPermission } from '@/utils/auth';

  import {
    getTableColumns,
    getFormSchemas,
    getSearchFormSchemas,
  } from './SmartAuthSecretKeyListView.config';
  import {
    listApi,
    deleteApi,
    getByIdApi,
    saveUpdateApi,
    download,
  } from './SmartAuthSecretKeyListView.api';

  const { t } = useI18n();
  const { getTableSize } = useSizeSetting();

  /**
   * 系统变更时触发：更新数据
   */
  const currentSystemRef = ref<Recordable>({});
  const handleSelectSystemChange = (system) => {
    currentSystemRef.value = system;
    query();
  };

  const getActions = (row: Recordable): ActionItem[] => {
    return [
      {
        label: t('common.button.edit'),
        auth: 'auth:secret:update',
        onClick: () => {
          editByRowModal(row);
        },
      },
      {
        label: t('common.button.download'),
        auth: 'auth:secret:download',
        onClick: () => {
          download(row.id);
        },
      },
    ];
  };

  const [registerTable, { editByRowModal, query }] = useSmartTable({
    columns: getTableColumns(),
    height: 'auto',
    pagerConfig: true,
    useSearchForm: true,
    stripe: true,
    highlightHoverRow: true,
    columnConfig: {
      resizable: true,
    },
    border: true,
    authConfig: {
      authHandler: hasPermission,
      toolbar: {
        ModalAdd: 'auth:secret:save',
        delete: 'auth:secret:delete',
      },
    },
    sortConfig: {
      remote: true,
      defaultSort: {
        field: 'seq',
        order: 'asc',
      },
    },
    searchFormConfig: {
      schemas: getSearchFormSchemas(t),
      searchWithSymbol: true,
      colon: true,
      layout: 'inline',
      actionColOptions: {
        span: undefined,
      },
      compact: true,
    },
    addEditConfig: {
      formConfig: {
        schemas: getFormSchemas(t),
        baseColProps: { span: 24 },
        labelCol: { span: 6 },
        wrapperCol: { span: 17 },
        colon: true,
      },
    },
    proxyConfig: {
      ajax: {
        query: (params) => {
          const parameter = {
            ...params.ajaxParameter,
            systemId: unref(currentSystemRef)?.id,
          };
          return listApi(parameter);
        },
        save: ({ body: { insertRecords, updateRecords } }) => {
          const dataList = [...insertRecords, ...updateRecords];
          return saveUpdateApi({
            ...dataList[0],
            systemId: unref(currentSystemRef).id,
          });
        },
        delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
        getById: (params) => getByIdApi(params.id),
      },
    },
    importConfig: {},
    exportConfig: {},
    toolbarConfig: {
      zoom: true,
      refresh: true,
      column: {
        columnOrder: true,
      },
      buttons: [
        {
          code: 'ModalAdd',
        },
        {
          code: 'delete',
        },
      ],
    },
  });
</script>
<style lang="less" scoped>
  .system-container {
    margin-right: 5px;
    background: white;
  }
</style>
