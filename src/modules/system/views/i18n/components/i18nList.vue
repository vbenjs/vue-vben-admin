<template>
  <div class="full-height">
    <SmartTable
      @register="registerTable"
      :size="getTableSize"
      @current-change="handleCurrentChange"
    >
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getTableActions(row)" />
      </template>
    </SmartTable>
  </div>
</template>

<script lang="ts" setup>
  import { useSmartTable, SmartTable, SmartVxeTableAction } from '@/components/SmartTable';
  import { propTypes } from '@/utils/propTypes';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { message, Modal } from 'ant-design-vue';
  import { createVNode, watch } from 'vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

  import { getI18nTableColumns, getI18nAddEditSchemas } from './i18n.config';
  import { listI18nApi, getI18nByIdApi, i18nSaveUpdateApi, i18nDeleteApi } from './i18n.api';
  import { SystemPermissions } from '@/modules/system/constants/SystemConstants';

  const props = defineProps({
    groupId: propTypes.oneOfType([propTypes.nullable, propTypes.number]),
  });
  const emit = defineEmits(['change']);

  const { t } = useI18n();
  const { getTableSize } = useSizeSetting();

  watch(
    () => props.groupId,
    async () => {
      await query();
      emit('change', null);
    },
  );

  const permissions = SystemPermissions.i18n;

  const getTableActions = (row: any) => {
    return [
      {
        label: t('common.button.edit'),
        preIcon: 'ant-design:edit-out-lined',
        auth: permissions.update,
        onClick: () => editByRowModal(row),
      },
    ];
  };

  const handleCurrentChange = ({ row }) => {
    emit('change', row.i18nId);
  };

  const [registerTable, { query, editByRowModal }] = useSmartTable({
    id: 'smart-system-i18n-i18nList',
    height: 'auto',
    stripe: true,
    columns: getI18nTableColumns(),
    useSearchForm: true,
    pagerConfig: true,
    border: true,
    showOverflow: 'tooltip',
    rowConfig: {
      isCurrent: true,
    },
    customConfig: { storage: true },
    columnConfig: {
      resizable: true,
    },
    sortConfig: {
      remote: true,
      defaultSort: { field: 'seq', order: 'asc' },
    },
    searchFormConfig: {
      searchWithSymbol: true,
      schemas: [
        {
          label: t('system.views.i18n.i18n.titleI18nCode'),
          field: 'i18nCode',
          component: 'Input',
          searchSymbol: 'like',
        },
      ],
      compact: true,
      colon: true,
      layout: 'inline',
      actionColOptions: { span: undefined },
    },
    addEditConfig: {
      formConfig: {
        baseColProps: {
          span: 24,
        },
        schemas: getI18nAddEditSchemas(t),
        labelCol: { span: 5 },
        wrapperCol: { span: 17 },
      },
    },
    toolbarConfig: {
      refresh: true,
      resizable: true,
      zoom: true,
      column: {
        columnOrder: true,
      },
      buttons: [
        {
          name: t('system.views.i18n.i18n.button.reload'),
          customRender: 'ant',
          auth: permissions.reload,
          props: {
            preIcon: 'ant-design:reload-outlined',
            type: 'primary',
            onClick: () => handleReload(),
            size: 'small',
          },
        },
        { code: 'ModalAdd' },
        { code: 'ModalEdit' },
        { code: 'delete' },
      ],
    },
    proxyConfig: {
      ajax: {
        query: ({ ajaxParameter }) => {
          let groupId = props.groupId;
          if (groupId == null) {
            groupId = undefined;
          }
          const parameter = {
            ...ajaxParameter,
            parameter: {
              ...ajaxParameter?.parameter,
              'groupId@=': groupId,
            },
          };
          return listI18nApi(parameter);
        },
        getById: (model) => getI18nByIdApi(model.i18nId),
        save: ({ body: { insertRecords, updateRecords } }) => {
          if (insertRecords?.length > 0) {
            insertRecords.forEach((item) => {
              item.groupId = props.groupId;
            });
          }
          return i18nSaveUpdateApi([...insertRecords, ...updateRecords][0]);
        },
        delete: ({ body: { removeRecords } }) => i18nDeleteApi(removeRecords),
      },
    },
  });

  /**
   * 刷新国际化信息
   */
  const handleReload = async () => {
    Modal.confirm({
      title: t('system.views.i18n.i18n.message.reloadConfirm'),
      content: t('system.views.i18n.i18n.message.reloadContent'),
      icon: createVNode(ExclamationCircleOutlined),
      onOk: async () => {
        await defHttp.post({
          service: ApiServiceEnum.SMART_SYSTEM,
          url: 'sys/i18n/reload',
        });
        message.success(t('system.views.i18n.i18n.message.reloadSuccess'));
      },
    });
  };
</script>

<style lang="less" scoped></style>
