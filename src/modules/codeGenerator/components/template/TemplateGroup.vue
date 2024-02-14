<template>
  <div class="full-height" :class="prefixCls">
    <SmartTable
      @register="registerTable"
      v-bind="getTableProps"
      class="table-container"
      :size="getTableSize"
      @cell-click="handleCellClick"
    >
      <template #table-groupName="{ row }">
        <div style="cursor: pointer" @contextmenu="(e) => handleContext(e, row)">
          {{ row.groupName }}
        </div>
      </template>
    </SmartTable>
    <div class="button-container">
      <a-button class="button" block type="primary" @click="() => showAddModal()">
        {{ $t('common.button.add') }}
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { SmartTableProps } from '@/components/SmartTable';

  import { computed, ref, unref, watch } from 'vue';

  import { SmartTable, useSmartTable } from '@/components/SmartTable';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { useI18n } from '@/hooks/web/useI18n';
  import { createContextMenu } from '@/components/ContextMenu';
  import { useDesign } from '@/hooks/web/useDesign';

  import {
    listGroupApi,
    saveUpdateGroupApi,
    deleteGroupByIdApi,
    getGroupByIdApi,
  } from '../../views/template/CodeTemplateList.api';

  const props = defineProps({
    tableProps: Object as PropType<SmartTableProps>,
  });

  const emit = defineEmits(['change']);
  const { t } = useI18n();
  const { prefixCls } = useDesign('smart-tool-db-templateGroup');

  const { getTableSize } = useSizeSetting();

  const currentGroupIdRef = ref<number | null>(null);
  const handleCellClick = ({ row }) => {
    if (unref(currentGroupIdRef) === row.groupId) {
      currentGroupIdRef.value = null;
    } else {
      currentGroupIdRef.value = row.groupId;
    }
  };
  watch(currentGroupIdRef, (value) => {
    const tableInstance = getTableInstance();
    if (value === null) {
      tableInstance.clearCurrentRow();
    } else {
      tableInstance.setCurrentRow({ groupId: value });
    }
    emit('change', value);
  });

  const handleContext = (e: MouseEvent, row: any) => {
    return createContextMenu({
      event: e,
      items: [
        {
          label: t('common.button.edit'),
          icon: 'ant-design:edit-outlined',
          handler: () => editByRowModal(row),
        },
        {
          label: t('common.button.delete'),
          icon: 'ant-design:delete-outlined',
          handler: () => deleteByRow(row),
        },
      ],
    });
  };

  const getTableProps = computed<SmartTableProps>(() => {
    return {
      rowConfig: {
        isHover: true,
        isCurrent: true,
      },
      columns: [
        {
          title: '{generator.views.template.title.templateGroup}',
          field: 'groupName',
        },
      ],
      height: 'auto',
      proxyConfig: {
        ajax: {
          query: (params) => {
            return listGroupApi({
              ...params.ajaxParameter,
              sortName: 'seq',
            });
          },
          save: ({ body: { insertRecords, updateRecords } }) =>
            saveUpdateGroupApi([...insertRecords, ...updateRecords][0]),
          getById: (row) => getGroupByIdApi(row.groupId),
          delete: ({ body: { removeRecords } }) =>
            deleteGroupByIdApi(removeRecords.map((item) => item.groupId)),
        },
      },
      ...props.tableProps,
    };
  });

  const [registerTable, { showAddModal, editByRowModal, deleteByRow, getTableInstance }] =
    useSmartTable({
      id: 'smart-tool-code-templateGroup',
      stripe: true,
      height: 'auto',
      rowConfig: {
        isHover: true,
        isCurrent: true,
        keyField: 'groupId',
      },
      columns: [
        {
          title: '{generator.views.template.title.templateGroup}',
          field: 'groupName',
          slots: {
            default: 'table-groupName',
          },
        },
      ],
      addEditConfig: {
        formConfig: {
          schemas: [
            {
              field: 'groupId',
              label: '',
              show: false,
              component: 'Input',
            },
            {
              field: 'groupName',
              label: t('generator.views.template.title.templateGroup'),
              component: 'Input',
              required: true,
            },
            {
              field: 'seq',
              label: t('generator.views.template.title.seq'),
              component: 'InputNumber',
              required: true,
            },
          ],
        },
      },
    });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-smart-tool-db-templateGroup';
  @buttonContainerHeight: 50px;
  .@{prefix-cls} {
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

    .smart-table-container {
      padding: 0;
    }
  }
</style>
