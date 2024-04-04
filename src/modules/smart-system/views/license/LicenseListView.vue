<!--
license管理页面
-->
<template>
  <div class="full-height page-container">
    <SmartLayoutSeparate first-size="240px" :show-line="false" class="full-height">
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
        <SmartTable class="license-view" @register="registerTable" :size="getTableSize">
          <template #table-operation="{ row }">
            <SmartVxeTableAction
              :drop-down-actions="getTableDropDownActions(row)"
              :actions="getTableActions(row)"
            />
          </template>
          <template #form-secretKey="{ model, size }">
            <SmartApiSelectTable
              v-model:value="model.secretKeyId"
              :size="size"
              model-class-name="com.smart.system.model.auth.SmartAuthSecretKeyPO"
              label-field-name="keyName"
              value-field-name="id"
              :params="getSecretSelectTableParams"
            />
          </template>
        </SmartTable>
      </template>
    </SmartLayoutSeparate>
  </div>
</template>

<script lang="ts" setup>
  import type { ActionItem } from '@/components/SmartTable';

  import { computed, ref, unref } from 'vue';
  import { SmartLayoutSeparate } from '@/components/SmartLayoutSeparate';
  import SystemSimpleList from '@/modules/smart-system/components/system/SystemSimpleList.vue';
  import { useSmartTable, SmartTable, SmartVxeTableAction } from '@/components/SmartTable';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { useAppStore } from '@/store/modules/app';
  import { useMessage } from '@/hooks/web/useMessage';

  import {
    getAddEditFormSchemas,
    getSearchFormSchemas,
    getTableColumns,
    Permissions,
  } from './LicenseListView.config';
  import {
    listApi,
    deleteApi,
    saveUpdateBatchApi,
    getByIdApi,
    generatorApi,
    downloadApi,
  } from './LicenseListView.api';
  import { buildUUID } from '@/utils/uuid';
  import dayjs from 'dayjs';
  import { SmartApiSelectTable } from '@/components/Form';

  const { t } = useI18n();
  const { getTableSize } = useSizeSetting();
  const appStore = useAppStore();
  const { createConfirm, successMessage } = useMessage();

  /**
   * 系统变更时触发：更新数据
   */
  const currentSystemRef = ref<Recordable>({});
  const handleSelectSystemChange = (system) => {
    currentSystemRef.value = system;
    query();
  };

  const getSecretSelectTableParams = computed(() => {
    return {
      sortName: 'seq',
      parameter: {
        'useYn@=': true,
        'deleteYn@=': false,
        'systemId@=': unref(currentSystemRef)?.id,
      },
    };
  });

  const getTableActions = (row): ActionItem[] => {
    return [
      {
        label: t('common.button.edit'),
        auth: Permissions.update,
        onClick: () => editByRowModal(row),
      },
    ];
  };

  const getTableDropDownActions = (row): ActionItem[] => {
    return [
      {
        label: t('smart.license.button.generator'),
        preIcon: 'ant-design:check-outlined',
        auth: Permissions.generator,
        onClick: () => {
          const message =
            row.status == 'GENERATOR'
              ? t('smart.license.message.rebuildGeneratorConfirm')
              : t('smart.license.message.generatorConfirm');
          createConfirm({
            iconType: 'warning',
            type: 'confirm',
            content: message,
            onOk: async () => {
              try {
                appStore.setPageLoading(true);
                await generatorApi(row.id);
                successMessage(t('smart.license.message.generatorSuccess'));
              } finally {
                appStore.setPageLoading(false);
              }
              query();
            },
          });
        },
      },
      {
        label: t('common.button.download'),
        preIcon: 'ant-design:download-outlined',
        auth: Permissions.download,
        disabled: row.status !== 'GENERATOR',
        onClick: async () => {
          try {
            appStore.setPageLoading(true);
            await downloadApi(row.id);
          } finally {
            appStore.setPageLoading(false);
          }
        },
      },
    ];
  };

  const [registerTable, { query, editByRowModal, showAddModal }] = useSmartTable({
    columns: getTableColumns(),
    border: true,
    height: 'auto',
    stripe: true,
    showOverflow: 'tooltip',
    highlightHoverRow: true,
    columnConfig: {
      resizable: true,
    },
    pagerConfig: true,
    sortConfig: {
      remote: true,
      defaultSort: {
        field: 'seq',
        order: 'asc',
      },
    },
    useSearchForm: true,
    searchFormConfig: {
      colon: true,
      compact: true,
      layout: 'inline',
      searchWithSymbol: true,
      // layout: 'inline',
      actionColOptions: {
        span: undefined,
      },
      schemas: getSearchFormSchemas(t),
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
          dataList.forEach((item) => {
            const times = item.times;
            Object.assign(item, {
              effectiveTime: times[0],
              expirationTime: times[1],
            });
            delete item.times;
          });
          return saveUpdateBatchApi(dataList);
        },
        delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
        getById: async (params) => {
          const result = await getByIdApi(params);
          const system = result.system;
          return {
            ...result,
            times: [dayjs(result.effectiveTime), dayjs(result.expirationTime)],
            systemName: `${system.name}(${system.code})`,
          };
        },
      },
    },
    printConfig: {},
    exportConfig: {},
    toolbarConfig: {
      refresh: true,
      zoom: true,
      column: {
        columnOrder: true,
      },
      buttons: [
        {
          code: 'ModalAdd',
          auth: Permissions.save,
          props: {
            onClick: () => {
              const currentSystem = unref(currentSystemRef);
              showAddModal({
                licenseCode: buildUUID(),
                systemId: currentSystem.id,
                systemName: `${currentSystem.name}(${currentSystem.code})`,
              });
            },
          },
        },
        {
          code: 'delete',
          auth: Permissions.delete,
        },
      ],
    },
    addEditConfig: {
      modalConfig: {
        width: '1000px',
        defaultFullscreen: true,
      },
      formConfig: {
        colon: true,
        labelCol: {
          span: 6,
        },
        wrapperCol: {
          span: 17,
        },
        schemas: getAddEditFormSchemas(t),
        baseColProps: { span: 12 },
      },
    },
  });
</script>

<style lang="less" scoped>
  .license-view {
    :deep(.smart-table-container) {
      height: calc(100% - 122px) !important;
    }
  }

  .system-container {
    margin-right: 5px;
    background: white;
  }
</style>
