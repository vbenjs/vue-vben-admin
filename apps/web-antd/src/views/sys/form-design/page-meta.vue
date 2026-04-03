<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Switch,
  Table,
  Tag,
} from 'ant-design-vue';

import {
  sysApprovalProcessApi,
  sysFormDesignApi,
  sysMenuApi,
  sysPageMetaApi,
} from '#/api/core/sys-manage';

const router = useRouter();
const loading = ref(false);
const dataSource = ref<any[]>([]);
const pagination = ref({ current: 1, pageSize: 20, total: 0 });
const searchParams = ref({ pageName: '', status: undefined as string | undefined });
const isModalVisible = ref(false);
const submitting = ref(false);
const formRef = ref();
const menuOptions = ref<any[]>([]);
const menuRawOptions = ref<any[]>([]);

const columns = [
  { title: '页面编码', dataIndex: 'pageCode', key: 'pageCode', width: 150 },
  { title: '页面名称', dataIndex: 'pageName', key: 'pageName', width: 180 },
  { title: '业务系统', dataIndex: 'bizSystem', key: 'bizSystem', width: 120 },
  { title: '页面类型', dataIndex: 'pageType', key: 'pageType', width: 110 },
  { title: '功能菜单', dataIndex: 'menuName', key: 'menuName', width: 180 },
  { title: '关联表', dataIndex: 'relationTable', key: 'relationTable', width: 160 },
  { title: '布局', dataIndex: 'formLayout', key: 'formLayout', width: 100 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 170 },
  { title: '操作', key: 'action', width: 260 },
];

const defaultForm = () => ({
  allowLink: '0',
  bizSystem: 'RISS',
  formLayout: 'list',
  menuName: '',
  pageCode: '',
  pageName: '',
  pageSchema: '',
  pageType: '0',
  relationTable: '',
  remark: '',
  sqlScript: '',
  status: '0',
});
const formState = ref<any>(defaultForm());

const pageTypeTextMap: Record<string, string> = {
  '0': '列表页',
  '1': '表单页',
  '2': '树形页',
  '3': '统计页',
};
const layoutTextMap: Record<string, string> = {
  list: '分页列表',
  tree: '左树右表',
  single: '单页表单',
};

const enabledCount = computed(
  () => dataSource.value.filter((item) => item.status === '0').length,
);

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleString('zh-CN') : '-';

const parseRecord = (item: any) => {
  let parsedContent: Record<string, any> = {};
  try {
    parsedContent = item.formContent ? JSON.parse(item.formContent) : {};
  } catch {
    parsedContent = {};
  }
  return {
    ...item,
    ...parsedContent,
    pageName: parsedContent.pageName || item.formName,
  };
};

const fetchMenus = async () => {
  const menus = await sysMenuApi.getList().catch(() => []);
  menuRawOptions.value = (menus || []).filter((item: any) => item.menuType !== 'F');
  menuOptions.value = menuRawOptions.value.map((item: any) => ({
    label: item.menuName,
    value: item.menuName,
  }));
};

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await sysPageMetaApi.getList({
      page,
      pageSize: pagination.value.pageSize,
      formName: searchParams.value.pageName,
      status: searchParams.value.status,
    });
    dataSource.value = (res?.items || []).map(parseRecord);
    pagination.value.current = page;
    pagination.value.total = res?.total || 0;
  } finally {
    loading.value = false;
  }
};

const openModal = async (record?: any) => {
  if (record?.formId) {
    const detail = await sysPageMetaApi.getById(record.formId);
    formState.value = { ...defaultForm(), ...parseRecord(detail), formId: detail?.formId };
  } else {
    formState.value = defaultForm();
  }
  isModalVisible.value = true;
};

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    const payload = { ...formState.value };
    if (payload.formId) {
      await sysPageMetaApi.update(payload.formId, payload);
      message.success('页面配置更新成功');
    } else {
      const created = await sysPageMetaApi.create(payload);
      payload.formId = created?.formId;
      message.success('页面配置新增成功');
    }

    if (payload.allowLink === '1') {
      await syncLinkedConfigs(payload);
    }

    isModalVisible.value = false;
    fetchList(pagination.value.current);
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (id: string) => {
  await sysPageMetaApi.remove(id);
  message.success('删除页面配置成功');
  fetchList(pagination.value.current);
};

const syncLinkedConfigs = async (record: any) => {
  if (record.allowLink !== '1') {
    return;
  }

  if (!record.pageName || !record.menuName) {
    message.warning('请先补全页面名称和功能菜单后再联动');
    return;
  }

  const matchedMenu = menuRawOptions.value.find(
    (item: any) => item.menuName === record.menuName,
  );
  const linkedFormName = `${record.pageName}页面表单`;
  const linkedProcessName = `${record.pageName}流程`;

  const formList = await sysFormDesignApi.getList({
    page: 1,
    pageSize: 200,
    formName: linkedFormName,
    formType: '1',
  });
  const existedForm = (formList?.items || []).find(
    (item: any) => item.formName === linkedFormName,
  );

  const formPayload = {
    formContent: JSON.stringify({
      menuCode: matchedMenu?.menuCode || '',
      menuId: matchedMenu?.menuId || '',
      menuName: record.menuName,
      menuPath: matchedMenu?.path || '',
      pageCode: record.pageCode,
      pageSchema: record.pageSchema,
      relationTable: record.relationTable,
      sqlScript: record.sqlScript,
    }),
    formName: linkedFormName,
    formType: '1',
    remark: `页面自定义自动生成：${record.pageName}`,
    status: record.status || '0',
  };

  let linkedFormId = existedForm?.formId;
  let formAction = '更新';
  if (linkedFormId) {
    await sysFormDesignApi.update(linkedFormId, formPayload);
  } else {
    const createdForm = await sysFormDesignApi.create(formPayload);
    linkedFormId = createdForm?.formId;
    formAction = '创建';
  }

  const processList = await sysApprovalProcessApi.getList({
    page: 1,
    pageSize: 200,
    processName: linkedProcessName,
  });
  const existedProcess = (processList?.items || []).find(
    (item: any) => item.processName === linkedProcessName,
  );

  const processPayload = {
    bizTable: record.relationTable || '',
    flowNodes: record.sqlScript || '',
    formId: linkedFormId,
    menuName: record.menuName,
    processName: linkedProcessName,
    remark: `页面自定义自动生成：${record.pageName}`,
    status: record.status || '0',
    weight: 0,
  };

  let processAction = '更新';
  if (existedProcess?.processId) {
    await sysApprovalProcessApi.update(existedProcess.processId, processPayload);
  } else {
    await sysApprovalProcessApi.create(processPayload);
    processAction = '创建';
  }

  message.success(`联动成功：${formAction}表单，${processAction}流程`);
};

onMounted(async () => {
  await Promise.all([fetchMenus(), fetchList(1)]);
});
</script>

<template>
  <Page title="页面自定义" description="配置页面元数据、菜单归属、表结构与布局模式。">
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-4 flex flex-wrap gap-3">
          <Input
            v-model:value="searchParams.pageName"
            placeholder="页面名称"
            class="w-40"
            allow-clear
          />
          <Select
            v-model:value="searchParams.status"
            placeholder="状态"
            class="w-28"
            allow-clear
          >
            <Select.Option value="0">启用</Select.Option>
            <Select.Option value="1">停用</Select.Option>
          </Select>
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button
            @click="
              () => {
                searchParams.pageName = '';
                searchParams.status = undefined;
                fetchList(1);
              }
            "
          >
            重置
          </Button>
          <Button type="primary" class="ml-auto" @click="openModal()">+ 新建页面</Button>
        </div>

        <div class="mb-3 rounded bg-gray-50 px-3 py-2 text-sm text-gray-600">
          当前共 {{ pagination.total }} 个页面配置，启用中 {{ enabledCount }} 个。
        </div>

        <Table
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          :pagination="pagination"
          row-key="formId"
          bordered
          size="middle"
          :scroll="{ x: 1500 }"
          @change="(pag) => fetchList(pag.current || 1)"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'pageType'">
              {{ pageTypeTextMap[record.pageType] || '-' }}
            </template>
            <template v-if="column.key === 'formLayout'">
              {{ layoutTextMap[record.formLayout] || '-' }}
            </template>
            <template v-if="column.key === 'status'">
              <Tag :color="record.status === '0' ? 'success' : 'error'">
                {{ record.status === '0' ? '启用' : '停用' }}
              </Tag>
            </template>
            <template v-if="column.key === 'createTime'">
              {{ formatDate(record.createTime) }}
            </template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small" @click="openModal(record)">编辑</Button>
              <Button type="link" size="small" @click="syncLinkedConfigs(record)">
                一键联动
              </Button>
              <Button
                type="link"
                size="small"
                @click="router.push('/approval/flow-config')"
              >
                流程配置
              </Button>
              <Button
                type="link"
                size="small"
                @click="router.push('/approval/form-config')"
              >
                表单配置
              </Button>
              <Popconfirm title="确定删除吗？" @confirm="handleDelete(record.formId)">
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>

      <Modal
        v-model:open="isModalVisible"
        :title="formState.formId ? '编辑页面配置' : '新建页面配置'"
        @ok="handleSubmit"
        :confirm-loading="submitting"
        destroy-on-close
        width="860px"
      >
        <Form ref="formRef" :model="formState" layout="vertical" class="mt-4">
          <div class="grid grid-cols-2 gap-4">
            <Form.Item
              label="页面编码"
              name="pageCode"
              :rules="[{ required: true, message: '请输入页面编码' }]"
            >
              <Input v-model:value="formState.pageCode" placeholder="如 FIN_PAGE_001" />
            </Form.Item>
            <Form.Item
              label="页面名称"
              name="pageName"
              :rules="[{ required: true, message: '请输入页面名称' }]"
            >
              <Input v-model:value="formState.pageName" placeholder="请输入页面名称" />
            </Form.Item>
            <Form.Item label="业务系统" name="bizSystem">
              <Input v-model:value="formState.bizSystem" placeholder="如 RISS" />
            </Form.Item>
            <Form.Item label="页面类型" name="pageType">
              <Select v-model:value="formState.pageType">
                <Select.Option value="0">列表页</Select.Option>
                <Select.Option value="1">表单页</Select.Option>
                <Select.Option value="2">树形页</Select.Option>
                <Select.Option value="3">统计页</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="功能菜单" name="menuName">
              <Select
                v-model:value="formState.menuName"
                :options="menuOptions"
                placeholder="请选择功能菜单"
                allow-clear
              />
            </Form.Item>
            <Form.Item label="关联表" name="relationTable">
              <Input v-model:value="formState.relationTable" placeholder="如 expense_claim" />
            </Form.Item>
            <Form.Item label="页面布局" name="formLayout">
              <Select v-model:value="formState.formLayout">
                <Select.Option value="list">分页列表</Select.Option>
                <Select.Option value="tree">左树右表</Select.Option>
                <Select.Option value="single">单页表单</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="允许关联" name="allowLink">
              <Switch
                :checked="formState.allowLink === '1'"
                @change="(checked) => (formState.allowLink = checked ? '1' : '0')"
              />
            </Form.Item>
            <Form.Item label="状态" name="status">
              <Radio.Group v-model:value="formState.status">
                <Radio value="0">启用</Radio>
                <Radio value="1">停用</Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          <Form.Item label="页面 Schema" name="pageSchema">
            <Input.TextArea
              v-model:value="formState.pageSchema"
              :rows="5"
              placeholder="可填写页面配置 JSON 或字段说明"
            />
          </Form.Item>
          <Form.Item label="SQL 脚本" name="sqlScript">
            <Input.TextArea
              v-model:value="formState.sqlScript"
              :rows="5"
              placeholder="可填写查询 SQL 或数据来源说明"
            />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea v-model:value="formState.remark" :rows="3" placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  </Page>
</template>
