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
            <SmartVxeTableAction :actions="getTableAction(row)" />
          </template>
        </SmartTable>
      </template>
    </LayoutSeparate>
    <CodeCreateModal @register="registerCodeCreateModal" />
  </div>
</template>

<script lang="ts" setup>
  import type { ActionItem } from '@/components/SmartTable';

  import { tableColumns, searchFormColumns } from './CodeListView.config';
  import { listBySystemApi, deleteApi } from './CodeListView.api';
  import { useRouter } from 'vue-router';
  import { buildUUID } from '@/utils/uuid';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { useModal } from '@/components/Modal';
  import { useI18n } from '@/hooks/web/useI18n';

  import { SmartVxeTableAction, SmartTable, useSmartTable } from '@/components/SmartTable';
  import CodeCreateModal from './components/CodeCreateModal.vue';
  import { LayoutSeparate } from '@/components/LayoutSeparate';
  import SystemSimpleList from '@/modules/smart-system/components/system/SystemSimpleList.vue';
  import { errorMessage } from '@/utils/message/SystemNotice';

  const { t } = useI18n();
  const router = useRouter();
  const { getTableSize } = useSizeSetting();

  const toDesign = (configId?: number) => {
    if (!currentSystem?.id) {
      errorMessage(t('generator.views.code.message.noSelectSystem'));
      return false;
    }
    router.push({
      path: '/code/codeDesign',
      query: {
        setKey: buildUUID(),
        configId,
        systemId: currentSystem.id,
      },
    });
  };

  let currentSystem: Recordable = {};
  const handleSelectSystemChange = (row) => {
    currentSystem = row;
    reload();
  };

  const getTableAction = (row): ActionItem[] => {
    return [
      {
        label: t('common.button.edit'),
        onClick: () => toDesign(row.id),
      },
      {
        label: t('generator.views.code.button.createCode'),
        onClick: () => openCodeCreateModal(true, row),
      },
    ];
  };

  // 生成代码弹窗
  const [registerCodeCreateModal, { openModal: openCodeCreateModal }] = useModal();

  const [registerTable, { reload }] = useSmartTable({
    id: 'smart-tool-code-codeList',
    customConfig: { storage: true },
    showOverflow: 'tooltip',
    border: true,
    rowConfig: {
      isHover: true,
      isCurrent: true,
    },
    stripe: true,
    searchFormConfig: {
      searchWithSymbol: true,
      layout: 'inline',
      schemas: searchFormColumns(t),
      actionColOptions: {
        span: undefined,
      },
      baseRowStyle: {
        width: '100%',
      },
      labelAlign: 'left',
      compact: true,
    },
    height: 'auto',
    columns: tableColumns(t),
    useSearchForm: true,
    pagerConfig: true,
    sortConfig: {
      remote: true,
      defaultSort: {
        field: 'createTime',
        order: 'desc',
      },
    },
    columnConfig: {
      resizable: true,
    },
    proxyConfig: {
      autoLoad: false,
      ajax: {
        query: (params) => {
          const queryParameter = {
            ...params.ajaxParameter,
            systemId: currentSystem.id,
          };
          return listBySystemApi(queryParameter);
        },
        delete: ({ body }) => deleteApi(body.removeRecords),
      },
    },
    toolbarConfig: {
      refresh: true,
      zoom: true,
      column: { columnOrder: true },
      buttons: [
        {
          code: 'ModalAdd',
          props: {
            onClick: () => toDesign(),
          },
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
  }

  .code-container {
    ::v-deep(.ant-modal-content) {
      height: 100%;
    }

    ::v-deep(.ant-modal) {
      max-width: 100%;
    }

    ::v-deep(.ant-form-item) {
      margin-bottom: 0;
    }

    ::v-deep(.ant-list-item) {
      padding: 8px 0;
    }

    ::v-deep(.ant-modal-body) {
      padding: 10px;
    }

    ::v-deep(.ant-tabs-top-content) {
      height: calc(100% - 65px);
    }

    ::v-deep(.ant-spin-nested-loading) {
      height: 100%;
    }

    ::v-deep(.ant-spin-container) {
      height: 100%;
      overflow: auto;
    }
  }
</style>
