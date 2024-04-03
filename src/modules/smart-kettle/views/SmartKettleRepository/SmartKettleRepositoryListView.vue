<template>
  <SmartPageProvider :class="prefixCls">
    <div class="full-height page-container">
      <SmartTable @register="registerTable" :size="getTableSize" />
    </div>
  </SmartPageProvider>
</template>

<script lang="ts" setup>
  import { useI18n } from '@/hooks/web/useI18n';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';

  import { SmartTable, useSmartTable } from '@/components/SmartTable';

  import {
    getTableColumns,
    getFormSchemas,
    getSearchFormSchemas,
  } from './SmartKettleRepositoryListView.config';
  import {
    listApi,
    deleteApi,
    getByIdApi,
    batchSaveUpdateApi,
    setUseYnApi,
  } from './SmartKettleRepositoryListView.api';
  import { SmartPageProvider } from '@/components/SmartPageProvider';
  import { useDesign } from '@/hooks/web/useDesign';

  const { t } = useI18n();
  const { getTableSize } = useSizeSetting();

  const { prefixCls } = useDesign('smart-kettle-repository');
  const { prefixCls: modalPrefixCls } = useDesign('smart-kettle-repository-addEditModal');

  const [registerTable] = useSmartTable({
    id: 'smart-kettle-repository',
    columns: getTableColumns(),
    height: 'auto',
    border: true,
    sortConfig: {
      remote: true,
    },
    showOverflow: 'tooltip',
    rowConfig: {
      isHover: true,
      isCurrent: true,
    },
    pagerConfig: true,
    useSearchForm: true,
    searchFormConfig: {
      schemas: getSearchFormSchemas(t),
      searchWithSymbol: true,
      colon: true,
      compact: true,
      layout: 'inline',
      actionColOptions: {
        span: undefined,
      },
    },
    addEditConfig: {
      modalConfig: {
        width: 900,
        wrapClassName: modalPrefixCls,
      },
      formConfig: {
        schemas: getFormSchemas(t),
        colon: true,
        baseColProps: { span: 12 },
        labelCol: { style: { width: '120px' } },
        wrapperCol: { span: 17 },
      },
    },
    proxyConfig: {
      ajax: {
        query: (params) => listApi(params.ajaxParameter),
        save: ({ body: { insertRecords, updateRecords } }) =>
          batchSaveUpdateApi([...insertRecords, ...updateRecords]),
        delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
        getById: (params) => getByIdApi(params.id),
        useYn: setUseYnApi,
      },
    },
    toolbarConfig: {
      zoom: true,
      refresh: true,
      custom: true,
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
        {
          code: 'useYnFalse',
        },
        {
          code: 'useYnTrue',
        },
      ],
    },
  });
</script>

<style lang="less">
  @prefix-cls-modal: ~'@{namespace}-smart-kettle-repository-addEditModal';

  .@{prefix-cls-modal} {
    .ant-divider-horizontal {
      margin: 0;
      padding: 0 0 15px;
    }
  }
</style>
