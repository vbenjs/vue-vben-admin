<template>
  <PageWrapper fixedHeight contentFullHeight>
    <Card size="small">
      <div class="flex w-full">
        <div class="w-80 mr-4">
          <BasicTree
            title="懒加载异步树"
            ref="asyncTreeRef"
            :treeData="tree"
            checkable
            :load-data="onLoadData"
          />
        </div>
        <div class="w-[calc(100%-21rem)]">
          <BasicTable @register="registerTable" class="!p-0">
            <template #toolbar>
              <a-button
                type="primary"
                preIcon="ant-design:plus-outlined"
                @click="handleCreate"
                v-auth="'StoreManager_add'"
              >
                添加地点
              </a-button>
            </template>
          </BasicTable>
        </div>
      </div>
    </Card>

    <!-- <StoreDrawer @register="registerDrawer" @success="handleSuccess" /> -->
  </PageWrapper>
</template>
<script lang="tsx" setup>
  import { getFormConfig, getColumns } from './data';
  import { StoreResult } from '@/api/model/storeModel';
  import { deleteStore, getStore, getStoreById } from '@/api/store';
  import { useDrawer } from '@/components/Drawer';
  import { PageWrapper } from '@/components/Page';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { useGo } from '@/hooks/web/usePage';
  import { openWindow } from '@/utils';
  import { HashingFactory } from '@/utils/cipher';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { Card } from 'ant-design-vue';
  import { BasicTree, TreeActionType } from '@/components/Tree';
  import { ref, unref } from 'vue';
  import { isArray, uniq } from 'lodash-es';

  defineOptions({ name: 'Organization' });

  // const StoreDrawer = createAsyncComponent(() => import('./Drawer/StoreDrawer.vue'));

  // const [registerDrawer, { openDrawer }] = useDrawer();
  const go = useGo();
  const encryptByMd5 = HashingFactory.createMD5Hashing().hash;

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    api: (where) => getStore(where, true),
    columns: getColumns(),
    rowKey: 'id',
    useSearchForm: false,
    loading: true,
    showIndexColumn: false,
    actionColumn: {
      width: 160,
      title: '操作',
      dataIndex: 'action',
      auth: ['StoreManager_edit', 'StoreManager_del'],
      customRender: ({ record }) => {
        return createActions(record as StoreResult);
      },
    },
  });

  const createActions = (record: StoreResult) => {
    return (
      <TableAction
        stopButtonPropagation
        actions={[
          {
            icon: 'clarity:note-edit-line',
            tooltip: '编辑',
            auth: 'StoreManager_edit',
            onClick: handleEdit.bind(null, record.id),
          },
        ]}
        dropDownActions={[
          {
            label: '营业额管理',
            auth: 'StoreTurnover',
            onClick: () =>
              go({
                path: '/enterprise/store/turnover/' + encryptByMd5(record.id + 'turnover'),
                query: {
                  storeId: record.id,
                  storeNumber: record.storeNumber,
                  storeName: record.name,
                },
              }),
          },
          {
            icon: 'ant-design:delete-outlined',
            label: '删除',
            color: 'error',
            auth: 'StoreManager_del',
            popConfirm: {
              title: '是否确认删除？',
              placement: 'left',
              confirm: handleDelete.bind(null, record.id),
            },
          },
        ]}
      />
    );
  };
  function handleSuccess({ action, values }) {
    if (action == 'edit') {
      updateTableDataRecord(values.id, values);
    } else {
      reload();
    }
  }

  const handleCreate = () => {
    openDrawer(true, {
      actionKey: 'create',
    });
  };

  const handleEdit = async (id: number) => {
    const account = await getStoreById(id);
    openDrawer(true, {
      record: account,
      actionKey: 'edit',
    });
  };

  const handleDelete = async (id: number) => {
    await deleteStore(id);
    reload();
  };

  function handleCheck(checkedKeys, e) {
    console.log('onChecked', checkedKeys, e);
  }

  const asyncTreeRef = ref();
  const tree = ref([
    {
      title: 'parent ',
      key: '0-0',
    },
  ]);

  function onLoadData(treeNode) {
    return new Promise((resolve: (value?: unknown) => void) => {
      if (isArray(treeNode.children) && treeNode.children.length > 0) {
        resolve();
        return;
      }
      setTimeout(() => {
        const asyncTreeAction: TreeActionType | null = unref(asyncTreeRef);
        if (asyncTreeAction) {
          const nodeChildren = [
            { title: `Child Node ${treeNode.eventKey}-0`, key: `${treeNode.eventKey}-0` },
            { title: `Child Node ${treeNode.eventKey}-1`, key: `${treeNode.eventKey}-1` },
          ];
          asyncTreeAction.updateNodeByKey(treeNode.eventKey, { children: nodeChildren });
          asyncTreeAction.setExpandedKeys(
            uniq([treeNode.eventKey, ...asyncTreeAction.getExpandedKeys()]),
          );
        }

        resolve();
        return;
      }, 300);
    });
  }
</script>
