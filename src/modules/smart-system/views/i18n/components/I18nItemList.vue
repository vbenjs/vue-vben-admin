<template>
  <div class="full-height">
    <SmartTable @register="registerTable" :size="getTableSize">
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getTableActions(row)" />
      </template>
    </SmartTable>
  </div>
</template>

<script setup lang="ts">
  import {
    useSmartTable,
    SmartTable,
    SmartVxeTableAction,
    type ActionItem,
  } from '@/components/SmartTable';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';

  import { getI18nItemListTableColumn, getI18nItemListAddEditFormSchema } from './i18n.config';
  import {
    listI18nItemApi,
    batchDeleteI18nItemByIdApi,
    saveUpdateI18nItemApi,
    getI18nItemByIdApi,
  } from './i18n.api';
  import { propTypes } from '@/utils/propTypes';
  import { SystemPermissions } from '@/modules/smart-system/constants/SystemConstants';
  import { useI18n } from '@/hooks/web/useI18n';
  import { watch } from 'vue';

  const props = defineProps({
    i18nId: propTypes.number,
  });

  const { t } = useI18n();
  const { getTableSize } = useSizeSetting();

  const getTableActions = (row): ActionItem[] => {
    return [
      {
        auth: SystemPermissions.i18n.update,
        label: t('common.button.edit'),
        onClick: () => {
          editByRowModal(row);
        },
      },
    ];
  };

  watch(
    () => props.i18nId,
    () => query(),
  );

  const [registerTable, { editByRowModal, query }] = useSmartTable({
    id: 'smart-system-i18n-i18nItemList',
    height: 'auto',
    stripe: true,
    border: true,
    columns: getI18nItemListTableColumn(),
    columnConfig: {
      resizable: true,
    },
    rowConfig: {
      isCurrent: true,
    },
    customConfig: { storage: true },
    addEditConfig: {
      formConfig: {
        schemas: getI18nItemListAddEditFormSchema(t),
      },
    },
    proxyConfig: {
      ajax: {
        query: async ({ ajaxParameter }) => {
          if (!props.i18nId) {
            return [];
          }
          return listI18nItemApi({
            ...ajaxParameter,
            parameter: {
              ...ajaxParameter?.parameter,
              'i18nId@=': props.i18nId,
            },
          });
        },
        delete: ({ body: { removeRecords } }) =>
          batchDeleteI18nItemByIdApi(removeRecords.map((item) => item.i18nItemId)),
        getById: ({ i18nItemId }) => getI18nItemByIdApi(i18nItemId),
        save: ({ body: { insertRecords, updateRecords } }) => {
          const model = [...insertRecords, ...updateRecords][0];
          return saveUpdateI18nItemApi({
            ...model,
            i18nId: props.i18nId,
          });
        },
      },
    },
    toolbarConfig: {
      refresh: true,
      resizable: true,
      zoom: true,
      column: {
        columnOrder: true,
      },
      buttons: [{ code: 'ModalAdd' }, { code: 'delete' }],
    },
  });
</script>

<style scoped lang="less"></style>
