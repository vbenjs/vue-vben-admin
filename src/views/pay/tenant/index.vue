<template>
  <div>
    <BasicTable @register="registerTable" ref="tableRef">
      <template #toolbar>
        <a-button type="primary" @click="handleDisableBatch">批量禁用</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                tooltip: '编辑',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '删除',
                popConfirm: {
                  title: `${t('common.isDelete')}`,
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <NoticeDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';

  import { BasicTable, TableAction, TableActionType, useTable } from '@/components/Table';
  import { useDrawer } from '@/components/Drawer';
  import { columns, searchFormSchema } from './tenant';
  import { getNoticeList, actionNoticeBatchOptions } from '@/api/demo/system';
  import NoticeDrawer from '@/views/demo/system/notice/NoticeDrawer.vue';
  import { Nullable } from '@vben/types';
  import type { Key } from 'ant-design-vue/lib/table/interface';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';

  const { notification } = useMessage();

  export default defineComponent({
    name: 'PayTenantManagement',
    components: { NoticeDrawer, TableAction, BasicTable },
    setup() {
      const { t } = useI18n();
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload }] = useTable({
        title: `${t('pay.payTenant.name')}`,
        api: getNoticeList,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        defSort: {
          field: 'createTime',
          order: 'ascend',
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 200,
          title: `${t('common.options')}`,
          dataIndex: 'action',
          // slots: { customRender: 'action' },
          fixed: 'right',
        },

        rowKey: 'id',
        rowSelection: { type: 'checkbox' },
        showSelectionBar: true,
      });
      const tableRef = ref<Nullable<TableActionType>>(null);

      function getTableAction() {
        const tableAction = unref(tableRef);
        if (!tableAction) {
          throw new Error('tableAction is null');
        }
        return tableAction;
      }

      function handleSuccess() {
        reload();
      }

      function handleCreate(record: Recordable) {
        console.log(record);
        openDrawer(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        openDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      function handleDelete(record: Recordable) {
        actionNoticeBatchOptions({
          type: 'delete',
          targetIds: [record.id],
          values: new Map<string, any>(),
        }).then(() => {
          clearSelect();
          handleSuccess();
        });
      }

      function _get_select_row(): Array<String> {
        const ids: Array<Key> = getTableAction().getSelectRowKeys();
        console.log(ids);
        if (ids.length <= 0) {
          notification.error({
            message: '请选择行',
          });
          return [];
        }
        const new_ids: Array<String> = [];
        ids.forEach((x) => {
          new_ids.push(x.toString());
        });
        return new_ids;
      }

      function handleDeleteBatch() {
        const ids: Array<String> = _get_select_row();
        if (ids.length) {
          actionNoticeBatchOptions({
            type: 'delete',
            targetIds: ids,
            values: new Map<string, any>(),
          }).then(() => {
            clearSelect();
            handleSuccess();
          });
        }
      }

      function handleEnableBatch() {
        const ids: Array<String> = _get_select_row();
        if (ids.length) {
          actionNoticeBatchOptions({
            type: 'enable',
            targetIds: ids,
            values: new Map<string, any>(),
          }).then(() => {
            clearSelect();
            handleSuccess();
          });
        }
      }

      function handleDisableBatch() {
        const ids: Array<String> = _get_select_row();
        if (ids.length) {
          actionNoticeBatchOptions({
            type: 'disable',
            targetIds: ids,
            values: new Map<string, any>(),
          }).then(() => {
            clearSelect();
            handleSuccess();
          });
        }
      }

      function clearSelect() {
        getTableAction().clearSelectedRowKeys();
      }

      return {
        registerTable,
        registerDrawer,
        handleSuccess,
        handleEdit,
        handleDelete,
        handleCreate,
        handleDeleteBatch,
        tableRef,
        handleEnableBatch,
        handleDisableBatch,
        t,
      };
    },
  });
</script>
