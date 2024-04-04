<template>
  <div class="full-height page-container" id="codeTemplateContainer">
    <SmartLayoutSeparate :show-line="false" first-size="240px" class="full-height">
      <template #first>
        <div class="full-height" style="margin-right: 5px; background: white">
          <TemplateGroup @change="handleGroupChange" />
        </div>
      </template>
      <template #second>
        <SmartTable @register="registerTable" :addEditConfig="getAddEditConfig">
          <template #table-operation="{ row }">
            <SmartVxeTableAction :actions="getActions(row)" />
          </template>
          <template #addEditForm-language="{ model }">
            <div class="code-edit-container">
              <CodeEditor :readonly="isReadonly" v-model:value="model.template" />
            </div>
          </template>
        </SmartTable>
      </template>
    </SmartLayoutSeparate>
  </div>
</template>

<script lang="ts" setup>
  import type { ActionItem, SmartTableAddEditConfig } from '@/components/SmartTable';

  import { computed, ref, unref } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { message } from 'ant-design-vue';

  import { SmartTable, SmartVxeTableAction, useSmartTable } from '@/components/SmartTable';
  import { SmartLayoutSeparate } from '@/components/SmartLayoutSeparate';
  import TemplateGroup from '../../components/template/TemplateGroup.vue';
  import { CodeEditor } from '@/components/CodeEditor';

  import {
    getTableColumns,
    getSearchSchemas,
    getAddEditFormSchemas,
  } from './CodeTemplateList.config';
  import { listApi, getByIdApi, deleteApi, saveUpdateApi } from './CodeTemplateList.api';

  const { t } = useI18n();

  const currentGroupIdRef = ref<number | null>();

  const handleGroupChange = (id: number | null) => {
    currentGroupIdRef.value = id;
    query();
  };

  const getActions = (row): ActionItem[] => {
    return [
      {
        label: t('common.button.edit'),
        onClick: () => {
          isReadonly.value = false;
          editByRowModal(row);
        },
      },
      {
        label: t('common.button.look'),
        onClick: () => {
          isReadonly.value = true;
          editByRowModal(row);
        },
      },
    ];
  };

  const isReadonly = ref(false);

  const getAddEditConfig = computed<SmartTableAddEditConfig>(() => {
    return {
      modalConfig: {
        defaultFullscreen: true,
        getContainer: () => {
          return document.getElementById('codeTemplateContainer') as HTMLElement;
        },
      },
      formConfig: {
        schemas: getAddEditFormSchemas(t),
        baseColProps: {
          span: 8,
        },
        colon: true,
        disabled: unref(isReadonly),
        baseRowStyle: {
          height: '100%',
        },
      },
    };
  });

  const [registerTable, { editByRowModal, showAddModal, query }] = useSmartTable({
    id: 'smart-tool-code-templateList',
    customConfig: { storage: true },
    height: 'auto',
    stripe: true,
    showOverflow: 'tooltip',
    border: true,
    rowConfig: {
      isHover: true,
    },
    columnConfig: { resizable: true },
    columns: getTableColumns(t),
    useSearchForm: true,
    searchFormConfig: {
      autoSubmitOnEnter: true,
      schemas: getSearchSchemas(t),
      searchWithSymbol: true,
      colon: true,
      layout: 'inline',
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
          code: 'ModalAdd',
          props: {
            onClick: () => {
              isReadonly.value = false;
              const currentGroupId = unref(currentGroupIdRef);
              if (!currentGroupId) {
                message.warn(t('generator.views.template.notice.choseGroup'));
                return false;
              }
              showAddModal({
                groupId: currentGroupId,
              });
            },
          },
        },
        {
          code: 'delete',
        },
      ],
    },
    proxyConfig: {
      ajax: {
        query: ({ ajaxParameter }) => {
          const currentGroupId = unref(currentGroupIdRef);
          const groupParameter = currentGroupId ? { 'groupId@=': currentGroupId } : {};
          return listApi({
            ...ajaxParameter,
            parameter: {
              ...ajaxParameter?.parameter,
              ...groupParameter,
            },
          });
        },
        save: ({ body: { insertRecords, updateRecords } }) =>
          saveUpdateApi([...insertRecords, ...updateRecords][0]),
        delete: ({ body: { removeRecords } }) =>
          deleteApi(removeRecords.map((item) => item.templateId)),
        getById: (params) => getByIdApi(params.templateId),
      },
    },
  });
</script>

<style scoped lang="less">
  .code-container {
    :deep(.ant-form) {
      height: 100%;
    }

    :deep(.ant-col-24) {
      height: calc(100% - 106px);

      .ant-form-item {
        height: 100%;
        overflow: auto;
      }
    }
  }

  .code-edit-container {
    height: 100%;
  }
</style>
