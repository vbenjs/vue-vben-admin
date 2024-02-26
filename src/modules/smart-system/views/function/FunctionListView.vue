<template>
  <div class="full-height page-container">
    <SmartTable @register="registerTable" :size="getTableSize">
      <template #table-icon="{ row }">
        <Icon v-if="row.icon" :icon="getIcon(row.icon)" />
        <div v-else></div>
      </template>
      <template #table-functionType="{ row }">
        <a-tag :color="getTagData(row.functionType).color">
          {{ getTagData(row.functionType).text }}
        </a-tag>
      </template>
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getTableActions(row)" />
      </template>
      <template #addEditForm-functionType="{ model }">
        <a-radio-group v-model:value="model.functionType">
          <a-radio
            v-for="(type, key) in functionTypes"
            :key="key"
            :disabled="type.disabled"
            :value="type.value"
          >
            {{ type.label }}
          </a-radio>
        </a-radio-group>
      </template>
    </SmartTable>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, unref } from 'vue';

  import {
    ActionItem,
    SmartTable,
    useSmartTable,
    SmartVxeTableAction,
  } from '@/components/SmartTable';
  import { Icon } from '@/components/Icon';
  import { tableColumns, getAddEditForm, getSearchSchemas } from './FunctionListView.config';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { listApi, deleteApi, getByIdApi, saveApi } from './FunctionListView.api';
  import { useI18n } from '@/hooks/web/useI18n';
  import StringUtils from '@/utils/StringUtils';
  import { SystemPermissions } from '@/modules/smart-system/constants/SystemConstants';
  import { hasPermission } from '@/utils/auth';

  const permissions = SystemPermissions.function;
  const { t } = useI18n();
  const { getTableSize } = useSizeSetting();

  const currentRowRef = ref<any>({});
  const getTableActions = (row: Recordable): ActionItem[] => {
    return [
      {
        label: t('common.button.add'),
        icon: 'ant-design:plus-outlined',
        disabled: row.functionType === 'FUNCTION' || !hasPermission(permissions.add),
        onClick: () => {
          currentRowRef.value = row;
          const data: Recordable = {
            parentId: row.functionId,
            parentName: row.functionName,
          };
          const functionType = row.functionType;
          switch (functionType) {
            case 'CATALOG': {
              setTypeDisabled(['function']);
              break;
            }
            case 'MENU': {
              setTypeDisabled(['catalogue', 'menu']);
              data.functionType = 'FUNCTION';
              break;
            }
            case 'FUNCTION': {
              setTypeDisabled(['catalogue', 'menu', 'function']);
              break;
            }
          }
          showAddModal(data, row);
        },
      },
      {
        label: t('common.button.edit'),
        icon: 'ant-design:edit-outlined',
        color: 'warning',
        auth: permissions.update,
        onClick: () => {
          currentRowRef.value = row;
          setTypeDisabled(['catalogue', 'menu', 'function']);
          editByRowModal(row);
        },
      },
      {
        label: t('common.button.delete'),
        icon: 'ant-design:delete-outlined',
        danger: true,
        auth: permissions.delete,
        onClick: () => {
          currentRowRef.value = row;
          deleteByRow(row);
        },
      },
    ];
  };

  const [
    registerTable,
    { showAddModal, editByRowModal, getSearchForm, getTableInstance, deleteByRow },
  ] = useSmartTable({
    id: 'FunctionListView',
    columns: tableColumns,
    resizableConfig: {},
    border: true,
    align: 'left',
    height: 'auto',
    useSearchForm: true,
    searchFormConfig: {
      compact: true,
      layout: 'inline',
      colon: true,
      schemas: getSearchSchemas(t),
      searchWithSymbol: true,
      actionColOptions: {
        span: undefined,
      },
    },
    columnConfig: {
      resizable: true,
      isHover: true,
    },
    authConfig: {
      authHandler: hasPermission,
      toolbar: {
        ModalAdd: permissions.add,
      },
    },
    treeConfig: {
      lazy: true,
      loadMethod: ({ row }) => {
        const { searchSymbolForm } = getSearchForm().getSearchFormParameter();
        const parameter = {
          parameter: {
            ...searchSymbolForm,
            'parentId@=': row.functionId,
          },
        };
        return listApi(parameter);
      },
    },
    rowConfig: {
      keyField: 'functionId',
    },
    sortConfig: {
      remote: true,
      defaultSort: {
        field: 'seq',
        order: 'asc',
      },
    },
    addEditConfig: {
      modalConfig: {
        width: 860,
      },
      formConfig: {
        colon: true,
        baseColProps: {
          span: 12,
        },
        labelCol: { span: 7 },
        wrapperCol: { span: 16 },
        schemas: getAddEditForm(t),
      },
      afterSave: () => {
        // 保存完成之后重新加载节点
        return getTableInstance().reloadTreeExpand(unref(currentRowRef));
      },
    },
    proxyConfig: {
      ajax: {
        query: ({ ajaxParameter }) => {
          const parameter = {
            ...ajaxParameter,
            parameter: {
              ...ajaxParameter?.parameter,
              'parentId@=': 0,
            },
          };
          return listApi(parameter);
        },
        delete: (params) => deleteApi(params),
        save: saveApi,
        getById: getByIdApi,
      },
    },
    toolbarConfig: {
      refresh: true,
      buttons: [
        {
          code: 'ModalAdd',
          props: {
            onClick: () => {
              setTypeDisabled(['function']);
              showAddModal({
                parentId: '0',
                parentName: '根目录',
              });
            },
          },
        },
      ],
    },
  });
  const getTagData = (functionType: string) => {
    switch (functionType) {
      case 'CATALOG': {
        return {
          color: '#f50',
          text: t('system.views.function.common.catalogue'),
        };
      }
      case 'MENU': {
        return {
          color: '#2db7f5',
          text: t('system.views.function.common.menu'),
        };
      }
      case 'FUNCTION': {
        return {
          color: '#108ee9',
          text: t('system.views.function.common.function'),
        };
      }
      default: {
        return {
          text: '',
        };
      }
    }
  };

  const getIcon = (compatibleIcon: string) => {
    if (compatibleIcon && compatibleIcon.indexOf(':') === -1) {
      compatibleIcon = StringUtils.humpToLine(compatibleIcon);
      compatibleIcon = 'ant-design:' + compatibleIcon;
    }
    return compatibleIcon;
  };

  const defaultFunctionTypes = (t: Function) => {
    return {
      catalogue: {
        value: 'CATALOG',
        label: t('system.views.function.common.catalogue'),
        disabled: false,
      },
      menu: {
        value: 'MENU',
        label: t('system.views.function.common.menu'),
        disabled: false,
      },
      function: {
        value: 'FUNCTION',
        label: t('system.views.function.common.function'),
        disabled: false,
      },
    };
  };
  /**
   * 设置不可用类型
   * @param keys
   */
  const setTypeDisabled = (keys: Array<string>) => {
    Object.keys(functionTypes).forEach((key) => {
      functionTypes[key].disabled = keys.includes(key);
    });
  };
  const functionTypes: any = reactive(defaultFunctionTypes(t));
</script>

<style scoped></style>
