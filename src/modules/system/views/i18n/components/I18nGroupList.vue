<template>
  <div class="full-height" :class="prefixCls">
    <div class="table-container">
      <SmartTable @register="registerTable" v-bind="$attrs">
        <template #table-groupName="{ row }">
          <span @contextmenu="(e) => handleContext(e, row)">{{ row.groupName }}</span>
        </template>
      </SmartTable>
    </div>
    <div class="button-container">
      <a-button
        v-permission="SystemPermissions.i18n.add"
        class="button"
        block
        type="primary"
        @click="() => showAddModal()"
      >
        {{ $t('common.button.add') }}
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { SmartTable, useSmartTable } from '@/components/SmartTable';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useContextMenu } from '@/hooks/web/useContextMenu';
  import { useI18n } from '@/hooks/web/useI18n';
  import { listGroupApi, getGroupByIdApi, saveUpdateGroupApi, deleteGroupApi } from './i18n.api';
  import { SystemPermissions } from '@/modules/system/constants/SystemConstants';

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
            editByRowModal(row);
          },
        },
        {
          label: t('common.button.delete'),
          icon: 'ant-design:delete-outlined',
          handler: () => {
            deleteByRow(row);
          },
        },
      ],
    });
  };

  const [registerTable, { editByRowModal, deleteByRow, showAddModal }] = useSmartTable({
    size: 'small',
    stripe: true,
    rowConfig: { isCurrent: true },
    height: 'auto',
    cellClassName: 'cursor-pointer',
    columns: [
      {
        title: '{system.views.i18n.group.groupName}',
        field: 'groupName',
        slots: {
          default: 'table-groupName',
        },
      },
    ],
    addEditConfig: {
      formConfig: {
        colon: true,
        schemas: [
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
        query: listGroupApi,
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
