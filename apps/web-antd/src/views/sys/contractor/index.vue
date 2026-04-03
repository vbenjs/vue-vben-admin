<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

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
  Table,
  Tag,
} from 'ant-design-vue';

import { contractorApi } from '#/api/core/sys-manage';

const userStore = useUserStore();
const loading = ref(false);
const dataSource = ref<any[]>([]);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const contextInfo = ref({
  fiscalYear: userStore.userInfo?.fiscalYear || '',
  tenantName: userStore.userInfo?.tenantName || '',
});
const searchParams = ref({
  fiscalYear: userStore.userInfo?.fiscalYear || '',
  contractorName: '',
  contractorType: '',
  status: undefined,
});
const pageDescription = computed(() => {
  const parts = [];
  if (contextInfo.value.tenantName)
    parts.push(`当前账套：${contextInfo.value.tenantName}`);
  if (contextInfo.value.fiscalYear)
    parts.push(`默认年度：${contextInfo.value.fiscalYear}年度`);
  return parts.join(' · ') || '预选承包商业务示例，已接入年度上下文过滤。';
});
const columns = [
  {
    title: '承包商名称',
    dataIndex: 'contractorName',
    key: 'contractorName',
    width: 180,
  },
  {
    title: '承包商类型',
    dataIndex: 'contractorType',
    key: 'contractorType',
    width: 140,
  },
  {
    title: '统一信用代码',
    dataIndex: 'creditCode',
    key: 'creditCode',
    width: 180,
  },
  {
    title: '联系人',
    dataIndex: 'contactPerson',
    key: 'contactPerson',
    width: 120,
  },
  {
    title: '联系电话',
    dataIndex: 'contactPhone',
    key: 'contactPhone',
    width: 140,
  },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 170 },
  { title: '操作', key: 'action', width: 130 },
];
const isModalVisible = ref(false);
const submitting = ref(false);
const formRef = ref();
const defaultForm = () => ({
  contractorName: '',
  contractorType: '',
  creditCode: '',
  contactPerson: '',
  contactPhone: '',
  qualification: '',
  businessScope: '',
  status: '0',
  remark: '',
});
const formState = ref<any>(defaultForm());
const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await contractorApi.getList({
      page,
      pageSize: pagination.value.pageSize,
      ...searchParams.value,
    });
    dataSource.value = res?.items || [];
    pagination.value.current = page;
    pagination.value.total = res?.total || 0;
    contextInfo.value = {
      fiscalYear:
        res?.context?.fiscalYear || userStore.userInfo?.fiscalYear || '',
      tenantName:
        res?.context?.tenantName || userStore.userInfo?.tenantName || '',
    };
  } finally {
    loading.value = false;
  }
};
const openModal = async (record?: any) => {
  formState.value = record?.id
    ? await contractorApi.getById(record.id)
    : defaultForm();
  isModalVisible.value = true;
};
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    if (formState.value.id) {
      await contractorApi.update(formState.value.id, formState.value);
      message.success('更新承包商成功');
    } else {
      await contractorApi.create(formState.value);
      message.success('新增承包商成功');
    }
    isModalVisible.value = false;
    fetchList(1);
  } finally {
    submitting.value = false;
  }
};
const handleDelete = async (id: string) => {
  await contractorApi.remove(id);
  message.success('删除承包商成功');
  fetchList(1);
};
const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleString('zh-CN') : '-';
onMounted(() => fetchList());
</script>
<template>
  <Page>
    <div class="space-y-4">
      <Card>
        <div class="mb-4 flex flex-wrap gap-3">
          <Input
            v-model:value="searchParams.fiscalYear"
            placeholder="年度，如 2026"
            style="width: 140px"
          /><Input
            v-model:value="searchParams.contractorName"
            placeholder="承包商名称"
            style="width: 180px"
          /><Input
            v-model:value="searchParams.contractorType"
            placeholder="承包商类型"
            style="width: 160px"
          /><Select
            v-model:value="searchParams.status"
            placeholder="状态"
            allow-clear
            style="width: 120px"
          >
            <Select.Option value="0">正常</Select.Option
            ><Select.Option value="1">停用</Select.Option> </Select
          ><Button type="primary" @click="fetchList(1)">查询</Button
          ><Button
            @click="
              () => {
                searchParams.fiscalYear = userStore.userInfo?.fiscalYear || '';
                searchParams.contractorName = '';
                searchParams.contractorType = '';
                searchParams.status = undefined;
                fetchList(1);
              }
            "
          >
            重置 </Button
          ><Button type="primary" class="ml-auto" @click="openModal()">
            + 新增
          </Button>
        </div>
        <Table
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          :pagination="pagination"
          row-key="id"
          bordered
          size="middle"
          :scroll="{ x: 1320 }"
          @change="(pag) => fetchList(pag.current)"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <Tag :color="record.status === '0' ? 'success' : 'error'">
                {{ record.status === '0' ? '正常' : '停用' }}
              </Tag> </template
            ><template v-if="column.key === 'createTime'">
              {{ formatDate(record.createTime) }} </template
            ><template v-if="column.key === 'action'">
              <Button type="link" size="small" @click="openModal(record)">
                编辑 </Button
              ><Popconfirm
                title="确定删除吗？"
                @confirm="handleDelete(record.id)"
              >
                <Button type="link" danger size="small"> 删除 </Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>
    </div>
    <Modal
      v-model:open="isModalVisible"
      :title="formState.id ? '编辑承包商' : '新增承包商'"
      @ok="handleSubmit"
      :confirm-loading="submitting"
      destroy-on-close
      width="760px"
    >
      <Form ref="formRef" :model="formState" layout="vertical" class="mt-4">
        <div class="grid grid-cols-2 gap-4">
          <Form.Item
            label="承包商名称"
            name="contractorName"
            :rules="[{ required: true, message: '请输入承包商名称' }]"
          >
            <Input
              v-model:value="formState.contractorName"
              placeholder="请输入承包商名称"
            /> </Form.Item
          ><Form.Item label="承包商类型" name="contractorType">
            <Input
              v-model:value="formState.contractorType"
              placeholder="请输入承包商类型"
            /> </Form.Item
          ><Form.Item label="统一信用代码" name="creditCode">
            <Input
              v-model:value="formState.creditCode"
              placeholder="请输入信用代码"
            /> </Form.Item
          ><Form.Item label="联系人" name="contactPerson">
            <Input
              v-model:value="formState.contactPerson"
              placeholder="请输入联系人"
            /> </Form.Item
          ><Form.Item label="联系电话" name="contactPhone">
            <Input
              v-model:value="formState.contactPhone"
              placeholder="请输入联系电话"
            /> </Form.Item
          ><Form.Item label="资质" name="qualification">
            <Input
              v-model:value="formState.qualification"
              placeholder="请输入资质"
            /> </Form.Item
          ><Form.Item label="状态" name="status">
            <Radio.Group v-model:value="formState.status">
              <Radio value="0">正常</Radio><Radio value="1">停用</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
        <Form.Item label="经营范围" name="businessScope">
          <Input.TextArea
            v-model:value="formState.businessScope"
            placeholder="请输入经营范围"
          /> </Form.Item
        ><Form.Item label="备注" name="remark">
          <Input.TextArea
            v-model:value="formState.remark"
            placeholder="可输入备注信息"
          />
        </Form.Item>
      </Form>
    </Modal>
  </Page>
</template>
