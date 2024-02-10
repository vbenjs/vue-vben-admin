<template>
  <div class="full-height code-container" id="codeTemplateContainer" style="padding: 10px">
    <LayoutSeparate :show-line="false" first-size="240px" class="full-height">
      <template #first>
        <div class="full-height" style=" margin-right: 5px;background: white">
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
              <CodeEditor
                :read-only="isReadonly"
                v-model:value="model.template"
                :mode="model.language"
              />
            </div>
          </template>
        </SmartTable>
      </template>
    </LayoutSeparate>
  </div>
</template>

<script lang="ts" setup>
  import type { ActionItem, SmartTableAddEditConfig } from '@/components/SmartTable';

  import { computed, ref, unref } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { merge } from 'lodash-es';
  import { message } from 'ant-design-vue';

  import { SmartTable, SmartVxeTableAction, useSmartTable } from '@/components/SmartTable';
  import { LayoutSeparate } from '@/components/LayoutSeparate';
  import TemplateGroup from './components/TemplateGroup.vue';
  import { CodeEditor } from '@/components/CodeEditor';

  import {
    getTableColumns,
    getSearchSchemas,
    getAddEditFormSchemas,
  } from './CodeTemplateList.config';
  import { listApi, getByIdApi, deleteApi, saveUpdateApi } from './CodeTemplateList.api';

  const { t } = useI18n();

  const currentGroupIdRef = ref<number | undefined>();

  const handleGroupChange = (id: number | undefined) => {
    currentGroupIdRef.value = id;
    reload();
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

  const [registerTable, { editByRowModal, showAddModal, reload }] = useSmartTable({
    height: 'auto',
    highlightHoverRow: true,
    stripe: true,
    columns: getTableColumns(t),
    useSearchForm: true,
    searchFormConfig: {
      schemas: getSearchSchemas(t),
      searchWithSymbol: true,
      colon: true,
      layout: 'inline',
      actionColOptions: {
        span: undefined,
      },
    },
    toolbarConfig: {
      refresh: true,
      resizable: true,
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
        query: (params) => {
          const parameter = merge(params.ajaxParameter, {
            parameter: {
              'groupId@=': unref(currentGroupIdRef),
            },
          });
          return listApi(parameter);
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
