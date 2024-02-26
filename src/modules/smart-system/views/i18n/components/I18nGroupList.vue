<template>
  <div class="full-height" :class="prefixCls">
    <div class="table-container">
      <SmartTable @register="registerTable" v-bind="$attrs" @cell-click="handleCellClick">
        <template #table-groupName="{ row }">
          <div @contextmenu="(e) => handleContext(e, row)">{{ row.text }}</div>
        </template>
      </SmartTable>
    </div>
    <div class="button-container">
      <a-button
        v-permission="SystemPermissions.i18n.add"
        class="button"
        block
        type="primary"
        @click="handleAdd"
      >
        {{ t('common.button.add') }}
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { SmartTable, useSmartTable } from '@/components/SmartTable';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useContextMenu } from '@/hooks/web/useContextMenu';
  import { useI18n } from '@/hooks/web/useI18n';
  import {
    listGroupTreeApi,
    getGroupByIdApi,
    saveUpdateGroupApi,
    deleteGroupApi,
  } from './i18n.api';
  import { SystemPermissions } from '@/modules/smart-system/constants/SystemConstants';
  import { nextTick, ref, unref, watch } from 'vue';

  const emit = defineEmits(['change']);

  const { t } = useI18n();

  const { prefixCls } = useDesign('smart-system-i18nGroup');

  const [createContextMenu] = useContextMenu();
  const handleContext = (e: MouseEvent, row: Recordable) => {
    createContextMenu({
      event: e,
      items: [
        {
          label: t('common.button.edit'),
          icon: 'ant-design:edit-outlined',
          handler: () => {
            editByRowModal(row.data);
          },
        },
        {
          label: t('common.button.delete'),
          icon: 'ant-design:delete-outlined',
          handler: () => {
            deleteByRow(row.data);
          },
        },
      ],
    });
  };

  const currentRowRef = ref<any | null>(null);
  const handleCellClick = ({ row }) => {
    if (unref(currentRowRef)?.id === row.id) {
      currentRowRef.value = null;
    } else {
      currentRowRef.value = row;
    }
    nextTick(() => {
      if (unref(currentRowRef) == null) {
        getTableInstance().clearCurrentRow();
      } else {
        getTableInstance().setCurrentRow(row);
      }
    });
  };
  watch(currentRowRef, () => emit('change', unref(currentRowRef)?.id));

  /**
   * 添加时间
   */
  const handleAdd = () => {
    const currentRow = unref(currentRowRef);
    const parentData =
      currentRow == null
        ? { parentId: 0, parentName: '根节点' }
        : { parentId: currentRow.id, parentName: currentRow.text };
    showAddModal(parentData);
  };

  const [registerTable, { editByRowModal, deleteByRow, showAddModal, getTableInstance }] =
    useSmartTable({
      size: 'small',
      stripe: true,
      rowConfig: { keyField: 'id', isCurrent: true },
      height: 'auto',
      treeConfig: {
        reserve: true,
        expandAll: true,
      },
      cellClassName: 'cursor-pointer',
      columns: [
        {
          title: '{system.views.i18n.group.groupName}',
          field: 'text',
          treeNode: true,
          slots: {
            default: 'table-groupName',
          },
        },
      ],
      addEditConfig: {
        formConfig: {
          autoSubmitOnEnter: true,
          baseColProps: { span: 24 },
          colon: true,
          schemas: [
            {
              label: '',
              component: 'Input',
              field: 'parentId',
              show: false,
            },
            {
              label: '上级',
              component: 'Input',
              field: 'parentName',
              dynamicDisabled: true,
            },
            {
              label: '',
              component: 'Input',
              field: 'groupId',
              show: false,
            },
            {
              label: t('system.views.i18n.group.groupName'),
              component: 'Input',
              field: 'groupName',
              required: true,
            },
            {
              label: t('system.views.i18n.group.seq'),
              component: 'InputNumber',
              field: 'seq',
              defaultValue: 1,
              required: true,
            },
          ],
        },
      },
      proxyConfig: {
        ajax: {
          query: listGroupTreeApi,
          getById: (row) => getGroupByIdApi(row.groupId),
          save: ({ body: { insertRecords, updateRecords } }) =>
            saveUpdateGroupApi([...insertRecords, ...updateRecords][0]),
          delete: ({ body: { removeRecords } }) => {
            return deleteGroupApi(removeRecords.map((item) => item.groupId));
          },
        },
      },
    });
</script>

<style lang="less">
  @buttonContainerHeight: 60px;
  @prefix-cls: ~'@{namespace}-smart-system-i18nGroup';
  .@{prefix-cls} {
    .smart-table-container {
      padding: 0;
    }

    .table-container {
      height: calc(100% - @buttonContainerHeight);
    }

    .button-container {
      height: @buttonContainerHeight;
      line-height: @buttonContainerHeight;
      text-align: center;

      .button {
        width: 90%;
      }
    }
  }
</style>
