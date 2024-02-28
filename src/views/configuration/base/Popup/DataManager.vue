<template>
  <div>
    <BasicTable @register="registerTable" class="!p-0" :formConfig="formConfig">
      <template #toolbar>
        <a-button @click="handleShowProduct" v-auth="'baseData_showProduct'"> 查看明细</a-button>
        <a-button type="primary" @click="handleCreate" v-auth="'baseData_add'"> 新建 </a-button>
        <a-button @click="handleDelete" v-auth="'baseData_del'"> 批量删除 </a-button>
      </template>
    </BasicTable>

    <FormDrawer @register="registerFormDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="tsx" setup>
  import { ref, onMounted } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useDrawer } from '@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { getApi, getColumns, getDeleteApi, getFormConfig } from './data';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { BaseDataType, baseDataTypeMap } from '@/enums/baseDataType';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useTabs } from '@/hooks/web/useTabs';
  import { useRoute } from 'vue-router';
  import { useGo } from '@/hooks/web/usePage';
  import { HashingFactory } from '@/utils/cipher';

  const FormDrawer = createAsyncComponent(() => import('./FormDrawer.vue'));

  defineOptions({ name: 'BaseDataManager' });

  const { t } = useI18n();
  const { setTitle } = useTabs();

  const route = useRoute();
  const go = useGo();
  const { createMessage: message, createConfirm } = useMessage();
  const type = ref<BaseDataType>('PRODUCT');
  const formConfig = ref({});

  const [registerFormDrawer, { openDrawer }] = useDrawer();

  const [
    registerTable,
    { updateTableDataRecord, setColumns, getForm, getSelectRowKeys, clearSelectedRowKeys, reload },
  ] = useTable({
    api: (where) => getApi(where, type.value),
    useSearchForm: true,
    // formConfig: getFormConfig(type.value),
    rowKey: 'id',
    loading: false,
    showIndexColumn: false,
    showTableSetting: true,
    immediate: false,
    // pagination: false,
    defSort: {
      columnKey: 'code',
      order: 'ascend',
    },
    rowSelection: { type: 'checkbox' },

    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      auth: ['baseData_add', 'baseData_edit', 'baseData_del'],
      customRender: ({ record }) => {
        return createActions(record);
      },
    },
  });

  const handleCreate = () => {
    openDrawer(true, { actionKey: 'create', type: type.value });
  };

  function handleSuccess({ action, values }) {
    if (action == 'edit') {
      updateTableDataRecord(values.id, values);
    } else {
      reload();
    }
  }

  const createActions = (record: Recordable) => {
    return (
      <TableAction
        stopButtonPropagation
        actions={[
          {
            icon: 'ant-design:copy-outlined',
            tooltip: '复制',
            auth: 'baseData_add',
            onClick: () => {
              openDrawer(true, { actionKey: 'create', type: type.value, record });
            },
          },
          {
            icon: 'clarity:note-edit-line',
            tooltip: '编辑',
            auth: 'baseData_edit',
            onClick: () => {
              openDrawer(true, { actionKey: 'edit', type: type.value, record });
            },
          },
          {
            icon: 'ant-design:delete-outlined',
            color: 'error',
            auth: 'baseData_del',
            popConfirm: {
              title: '是否确认删除？',
              placement: 'left',
              confirm: async () => {
                getDeleteApi([record.id], type.value).then(() => {
                  message.success(t('common.deleteSuccessMessage'));
                  clearSelectedRowKeys();
                  reload();
                });
              },
            },
          },
        ]}
      />
    );
  };

  const handleDelete = () => {
    const keys = getSelectRowKeys() as number[];
    console.log(keys);
    if (keys.length === 0) return message.warning('请选择需要删除的数据！');
    createConfirm({
      title: '提示',
      iconType: 'warning',
      content: '是否确认删除该数据？',
      onOk: async () => {
        getDeleteApi(keys, type.value).then(() => {
          message.success(t('common.deleteSuccessMessage'));
          reload();
          clearSelectedRowKeys();
        });
      },
    });
  };

  onMounted(() => {
    type.value = route.params.type as BaseDataType;
    getForm().setFieldsValue({});

    setColumns(getColumns(type.value));
    formConfig.value = getFormConfig(type.value);

    setTitle(`${baseDataTypeMap.get(type.value) ?? ''}信息`);
    reload();
  });

  const handleShowProduct = () => {
    const keys = getSelectRowKeys();
    if (keys.length === 0) {
      message.warning('请选择需要查看的数据');
      return;
    }
    const ids = keys.join(',');
    const md5 = HashingFactory.createMD5Hashing().hash(ids);
    go({
      path: '/warehouse/productDetail/' + md5,
      query: { ids, baseDataType: type.value, title: baseDataTypeMap.get(type.value) },
    });
  };
</script>
