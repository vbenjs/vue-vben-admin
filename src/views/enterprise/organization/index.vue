<template>
  <PageWrapper contentFullHeight>
    <Card size="small" class="mb-2" v-if="userStore.getIsAdmin">
      <BasicForm @register="registerForm" />
    </Card>
    <Card size="small">
      <div class="flex w-full" :style="{ height: height }">
        <div class="w-79 mr-1 h-full">
          <Space>
            <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleCreate">
              新建组织架构
            </a-button>
          </Space>
          <div class="h-10px"></div>
          <BasicTree
            ref="asyncTreeRef"
            :treeData="tree"
            checkable
            draggable
            :load-data="onLoadData"
            @dragstart="dragstart"
          >
            <template #title="{ key: treeKey, title }">
              <div class="w-full flex justify-between">
                <span>{{ title }}</span>
                <Dropdown :trigger="['click']">
                  <Icon icon="icon-park-outline:more" />
                  <template #overlay>
                    <Menu @click="({ key: menuKey }) => onContextMenuClick(treeKey, menuKey)">
                      <MenuItem key="1">1st menu item</MenuItem>
                      <MenuItem key="1">1st menu item</MenuItem>
                      <MenuItem key="1">1st menu item</MenuItem>
                    </Menu>
                  </template>
                </Dropdown>
              </div>
            </template>
          </BasicTree>
        </div>
        <div class="w-[calc(100%-20rem)] border-l-1 border-[#eeeeee]">
          <BasicTable @register="registerTable">
            <template #toolbar>
              <a-button
                type="primary"
                preIcon="ant-design:plus-outlined"
                @click="handleCreate"
                v-auth="`${AUTH_KEY}_add`"
              >
                添加用户
              </a-button>
            </template>
            <template #tableTitle>
              <Space>
                <span>当前位置：</span>
                <Breadcrumb>
                  <BreadcrumbItem>Home</BreadcrumbItem>
                  <BreadcrumbItem>1</BreadcrumbItem>
                  <BreadcrumbItem>2</BreadcrumbItem>
                  <BreadcrumbItem>3</BreadcrumbItem>
                </Breadcrumb>
              </Space>
            </template>
          </BasicTable>
        </div>
      </div>
    </Card>

    <AreaFormDrawer @register="registerAreaFormDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="tsx" setup>
  import { getColumns, AUTH_KEY, TableResult } from './data';
  import { useDrawer } from '@/components/Drawer';
  import { PageWrapper } from '@/components/Page';
  import { BasicTable, TableAction, useTable } from '@/components/Table';

  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { Breadcrumb, Card, Space, Dropdown, Menu } from 'ant-design-vue';
  import { BasicTree, TreeActionType } from '@/components/Tree';
  import { onMounted, ref, unref } from 'vue';
  import { isArray, uniq } from 'lodash-es';
  import { deleteArea, getArea, getAreaById } from '@/api/company/area';
  import { useForm, BasicForm } from '@/components/Form';
  import { getSelectBrandFormSchema } from '@/views/common/FormSchemas';
  import { useUserStore } from '@/store/modules/user';
  import { Icon } from '@/components/Icon';

  defineOptions({ name: AUTH_KEY });

  const AreaFormDrawer = createAsyncComponent(() => import('./Drawer/AreaFormDrawer.vue'));
  const BreadcrumbItem = Breadcrumb.Item;
  const MenuItem = Menu.Item;

  const height = ref('500px');
  const asyncTreeRef = ref();
  const tree = ref([
    {
      title: 'parent ',
      key: '0-0',
    },
  ]);

  const userStore = useUserStore();

  const [registerAreaFormDrawer, { openDrawer: openAreaFormDrawer }] = useDrawer();

  const [registerForm] = useForm({
    // layout: 'vertical',
    labelWidth: 80,
    showActionButtonGroup: false,
    schemas: getSelectBrandFormSchema(),
    compact: true,
  });

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    api: (where) => getArea(where, true),
    columns: getColumns(),
    rowKey: 'id',
    useSearchForm: false,
    loading: true,
    showIndexColumn: false,
    canResize: true,
    resizeHeightOffset: 12,
    actionColumn: {
      width: 160,
      title: '操作',
      dataIndex: 'action',
      auth: [`${AUTH_KEY}_edit`],
      customRender: ({ record }) => {
        return createActions(record as TableResult);
      },
    },
  });

  const createActions = (record: TableResult) => {
    return (
      <TableAction
        stopButtonPropagation
        actions={[
          {
            icon: 'clarity:note-edit-line',
            tooltip: '编辑',
            auth: `${AUTH_KEY}_edit`,
            onClick: handleEdit.bind(null, record.id),
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
    openAreaFormDrawer(true, {
      actionKey: 'create',
    });
  };

  const handleEdit = async (id: number) => {
    const account = await getAreaById(id);
    openAreaFormDrawer(true, {
      record: account,
      actionKey: 'edit',
    });
  };

  const handleDelete = async (id: number) => {
    await deleteArea([id]);
    reload();
  };

  async function onLoadData(treeNode) {
    if (isArray(treeNode.children) && treeNode.children.length > 0) {
      return;
    }
    const asyncTreeAction: TreeActionType | null = unref(asyncTreeRef);
    if (asyncTreeAction) {
      const nodeChildren = await getAreaById(treeNode.eventKey);
      asyncTreeAction.updateNodeByKey(treeNode.eventKey, { children: nodeChildren });
      asyncTreeAction.setExpandedKeys(
        uniq([treeNode.eventKey, ...asyncTreeAction.getExpandedKeys()]),
      );
    }

    return;
  }

  const dragstart = () => {
    console.log('dragstart');
  };

  const onContextMenuClick = (treeKey: string, menuKey: string | number) => {
    console.log(`treeKey: ${treeKey}, menuKey: ${menuKey}`);
  };

  onMounted(() => {
    const offset = 80 + 32 + 24 + (userStore.getIsAdmin ? 74 : 0) + 2;
    height.value = `calc(100vh - ${offset}px)`;
  });
</script>
