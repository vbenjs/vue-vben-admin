<template>
  <div class="full-height page-container">
    <SmartTable @register="registerTable" :size="getTableSize">
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getTableActions(row)" />
      </template>
      <template #search-tenantId="{ model, field }">
        <SysTenantSelect style="width: 100px" allowClear v-model:value="model[field]" />
      </template>
    </SmartTable>
    <ExceptionDetailModal @register="registerModal" />
  </div>
</template>

<script lang="tsx" setup>
  import {
    useSmartTable,
    SmartTable,
    SmartVxeTableAction,
    ActionItem,
  } from '@/components/SmartTable';
  import { useModal } from '@/components/Modal';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { Textarea } from 'ant-design-vue';

  import { getSearchFormSchemas, getTableColumns } from './SysExceptionListView.config';
  import { listApi, markResolvedApi } from './SysExceptionListView.api';
  import ExceptionDetailModal from './components/ExceptionDetailModal.vue';
  import { createConfirm, successMessage, warnMessage } from '@/utils/message/SystemNotice';
  import { ref, unref } from 'vue';
  import { SysTenantSelect } from '@/modules/smart-system/components';
  import { storeToRefs } from 'pinia';
  import { useUserStore } from '@/store/modules/user';

  const { t } = useI18n();
  const { getTableSize } = useSizeSetting();
  const { getIsPlatformTenant } = storeToRefs(useUserStore());

  const getTableActions = (row): ActionItem[] => {
    return [
      {
        label: t('system.views.exception.title.showStackTrace'),
        onClick: () => {
          openModal(true, row.id);
        },
      },
    ];
  };

  const [registerModal, { openModal }] = useModal();

  const resolvedMessageRef = ref('');
  /**
   * 标记已处理
   */
  const handlerMarkResolved = () => {
    const selectRows = getCheckboxRecords();
    console.log(selectRows);
    if (selectRows.length === 0) {
      warnMessage(t('system.views.exception.message.noSelect'));
      return false;
    }
    resolvedMessageRef.value = '';
    createConfirm({
      iconType: 'warning',
      title: t('system.views.exception.button.markResolved'),
      content: () => {
        return (
          <Textarea
            rows={4}
            v-model={[resolvedMessageRef.value, 'value']}
            placeholder={t('system.views.exception.validate.resolvedMessage')}
          />
        );
      },
      onOk: async () => {
        await markResolvedApi({
          resolvedMessage: unref(resolvedMessageRef),
          exceptionIdList: selectRows.map((item) => item.id),
        });
        successMessage(t('system.views.exception.message.resolvedSuccess'));
        query();
      },
    });
  };

  const [registerTable, { getCheckboxRecords, query }] = useSmartTable({
    id: 'smart-system-tool-exception',
    customConfig: { storage: true },
    border: true,
    showOverflow: 'tooltip',
    height: 'auto',
    stripe: true,
    pagerConfig: true,
    useSearchForm: true,
    searchFormConfig: {
      layout: 'inline',
      searchWithSymbol: true,
      schemas: getSearchFormSchemas(t, getIsPlatformTenant),
      colon: true,
      actionColOptions: {
        span: undefined,
      },
      compact: true,
    },
    toolbarConfig: {
      refresh: true,
      zoom: true,
      column: { columnOrder: true },
      buttons: [
        {
          name: t('system.views.exception.button.markResolved'),
          customRender: 'ant',
          props: {
            type: 'primary',
            preIcon: 'ant-design:check-outlined',
            onClick: handlerMarkResolved,
          },
        },
      ],
    },
    sortConfig: {
      remote: true,
      defaultSort: {
        field: 'createTime',
        order: 'desc',
      },
    },
    columns: getTableColumns(),
    columnConfig: {
      resizable: true,
    },
    proxyConfig: {
      ajax: {
        query: ({ ajaxParameter }) =>
          listApi({
            sortName: 'createTime',
            sortOrder: 'desc',
            ...ajaxParameter,
          }),
      },
    },
  });
</script>

<style scoped></style>
