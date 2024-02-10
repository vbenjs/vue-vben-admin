<template>
  <BasicModal
    @register="registerModal"
    width="920px"
    v-bind="$attrs"
    :title="$t('generator.views.codeCreateForm.title.choseAddendum')"
    @ok="handleOk"
  >
    <SmartTable class="smart-table" @register="registerTable">
      <template #table-relatedColumn="{ row }">
        <a-input v-model:value="row.relatedColumn" :size="getFormSize" />
      </template>
    </SmartTable>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { SmartColumn, SmartTable, useSmartTable } from '@/components/SmartTable';
  import { FormSchema } from '@/components/Form';
  import { useI18n } from '@/hooks/web/useI18n';
  import { propTypes } from '@/utils/propTypes';
  import { computed, PropType, toRefs, unref } from 'vue';
  import { message } from 'ant-design-vue';
  import { defHttp } from '@/utils/http/axios';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';

  const props = defineProps({
    multiple: propTypes.bool.def(true),
    selectTableList: {
      type: Array as PropType<Array<any>>,
      default: () => [],
    },
  });

  const emit = defineEmits(['ok', 'register']);

  const { selectTableList: selectTableListRef } = toRefs(props);

  const { t } = useI18n();

  const { getFormSize } = useSizeSetting();

  const columns = [
    {
      title: '{generator.views.code.table.connectionName}',
      field: 'connectionName',
      width: 120,
    },
    {
      title: '{generator.views.code.table.configName}',
      field: 'configName',
      width: 120,
    },
    {
      title: '{generator.views.code.table.tableName}',
      field: 'tableName',
      width: 160,
    },
    {
      title: '{generator.views.addendumTable.title.relatedColumn}',
      field: 'relatedColumn',
      width: 120,
      slots: {
        default: 'table-relatedColumn',
      },
    },
    {
      title: '{generator.views.code.table.remarks}',
      field: 'remarks',
      minWidth: 120,
    },
    {
      title: '{common.table.remark}',
      field: 'remark',
      minWidth: 200,
    },
  ];

  const searchSchemeList: FormSchema[] = [
    {
      label: t('generator.views.code.table.configName'),
      field: 'configName',
      component: 'Input',
    },
    {
      label: t('generator.views.code.table.tableName'),
      field: 'tableName',
      component: 'Input',
    },
  ];

  const computedColumns = computed<Partial<SmartColumn>[]>(() => {
    const firstColumn: SmartColumn = {
      type: 'checkbox',
      width: 60,
    };
    if (!props.multiple) {
      firstColumn.type = 'radio';
    }
    return [firstColumn, ...columns];
  });

  /**
   * 确认操作
   */
  const handleOk = () => {
    const data: any[] = [];
    if (props.multiple) {
      data.push(...getCheckboxRecords(false));
    } else {
      const row = getRadioRecord(false);
      if (row) {
        data.push(row);
      }
    }
    const errorDataList = data.filter(
      (item) =>
        item.relatedColumn === undefined ||
        item.relatedColumn == null ||
        item.relatedColumn.trim() === '',
    );
    if (errorDataList.length > 0) {
      errorDataList.forEach((item) => {
        message.error(
          t('generator.views.addendumTable.validate.relatedColumnWithConfig', item.configName),
        );
      });
      return false;
    }
    const dealData = data.map((item) => {
      return {
        addendumId: item.id,
        relatedColumn: item.relatedColumn,
        configName: item.configName,
      };
    });
    emit('ok', dealData);
    // 关闭弹窗
    closeModal();
  };

  const [registerModal, { closeModal }] = useModalInner(() => {
    query();
  });
  const [
    registerTable,
    { getCheckboxRecords, getRadioRecord, query, setRadioRow, setCheckboxRow },
  ] = useSmartTable({
    columns: unref(computedColumns),
    pagerConfig: false,
    useSearchForm: true,
    searchFormConfig: {
      schemas: searchSchemeList,
      layout: 'inline',
      actionColOptions: {
        span: undefined,
      },
      colon: true,
    },
    proxyConfig: {
      autoLoad: false,
      ajax: {
        query: (params) =>
          defHttp.post({
            url: 'db/code/main/list',
            data: {
              ...params.ajaxParameter,
              parameter: {
                'type@=': '30',
              },
            },
          }),
      },
      afterLoad: (result) => {
        const selectTableList = unref(selectTableListRef);
        if (selectTableList.length > 0) {
          const selectTableMap: Map<number, any> = new Map<number, any>();
          selectTableList.forEach((item) => {
            selectTableMap.set(item.addendumId, item);
          });
          // 选中的行
          const selectRowsList: Array<any> = [];
          result.forEach((item) => {
            if (selectTableMap.has(item.id)) {
              selectRowsList.push(item);
              item.relatedColumn = selectTableMap.get(item.id).relatedColumn;
            }
          });
          if (selectRowsList.length > 0) {
            if (!props.multiple) {
              setRadioRow(selectRowsList[0]);
            } else {
              setCheckboxRow(selectRowsList, true);
            }
          }
        }
        return result;
      },
    },
  });
</script>

<style lang="less" scoped>
  .smart-table {
    :deep(.ant-form-item) {
      margin-bottom: 0;
    }
  }
</style>
