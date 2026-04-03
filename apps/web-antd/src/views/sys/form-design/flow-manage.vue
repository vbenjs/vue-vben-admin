<script setup lang="ts">
import { onMounted, ref } from 'vue';
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
  Table,
  Tag,
} from 'ant-design-vue';

import { sysFormDesignApi } from '#/api/core/sys-manage';

const router = useRouter();
const loading = ref(false);
const dataSource = ref([]);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const searchParams = ref({ formName: '', status: undefined });

const columns = [
  { title: '表单名称', dataIndex: 'formName', key: 'formName' },
  { title: '表单类型', dataIndex: 'formType', key: 'formType', width: 100 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
  { title: '操作', key: 'action', width: 230 },
];

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await sysFormDesignApi.getList({
      page,
      pageSize: pagination.value.pageSize,
      ...searchParams.value,
    });
    dataSource.value = res?.items || [];
    pagination.value.current = page;
    pagination.value.total = res?.total || 0;
  } finally {
    loading.value = false;
  }
};

const formatDate = (v: string) =>
  v ? new Date(v).toLocaleString('zh-CN') : '-';

/* ---- 新增/编辑 Modal ---- */
const isModalVisible = ref(false);
const submitting = ref(false);
const formRef = ref();
const defaultForm = () => ({
  formName: '',
  formType: '1',
  status: '0',
  remark: '',
  formContent: '',
});
const formState = ref<any>(defaultForm());

const openModal = (record?: any) => {
  formState.value = record ? { ...record } : defaultForm();
  isModalVisible.value = true;
};

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    if (formState.value.formId) {
      await sysFormDesignApi.update(formState.value.formId, formState.value);
      message.success('更新成功');
    } else {
      await sysFormDesignApi.create(formState.value);
      message.success('新增成功');
    }
    isModalVisible.value = false;
    fetchList(pagination.value.current);
  } catch (error) {
    console.error(error);
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (id: number) => {
  await sysFormDesignApi.remove(id);
  message.success('删除成功');
  fetchList(pagination.value.current);
};

// Route to designer
const goToDesigner = (id: string) => {
  router.push(`/sys/form/designer?id=${id}`);
};

// Route to Form Collection Preivew (Data Setup)
const goToPreview = (id: string) => {
  router.push(`/sys/form/collection?formId=${id}`);
};

onMounted(() => fetchList());
</script>

<template>
  <Page>
    <div class="flex h-full flex-col p-4">
      <Card :bordered="false" class="flex-1">
        <div class="mb-3 flex flex-wrap gap-3">
          <Input
            v-model:value="searchParams.formName"
            placeholder="表单名称"
            class="w-40"
            allow-clear
          />
          <Select
            v-model:value="searchParams.status"
            placeholder="状态"
            class="w-28"
            allow-clear
          >
            <Select.Option value="0">开启</Select.Option>
            <Select.Option value="1">关闭</Select.Option>
          </Select>
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button
            @click="
              () => {
                searchParams.formName = '';
                searchParams.status = undefined;
                fetchList(1);
              }
            "
          >
            重置
          </Button>
          <Button type="primary" class="ml-auto" @click="openModal()">
            + 新建表单
          </Button>
        </div>

        <Table
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          :pagination="pagination"
          @change="(pag) => fetchList(pag.current)"
          row-key="formId"
          bordered
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <Tag :color="record.status === '0' ? 'success' : 'error'">
                {{ record.status === '0' ? '开启' : '关闭' }}
              </Tag>
            </template>
            <template v-if="column.key === 'formType'">
              <Tag color="processing">
                {{ record.formType === '0' ? '内置' : '自定义' }}
              </Tag>
            </template>
            <template v-if="column.key === 'createTime'">
              {{ formatDate(record.createTime) }}
            </template>
            <template v-if="column.key === 'action'">
              <Button
                type="link"
                size="small"
                @click="goToDesigner(record.formId)"
              >
                设计表单
              </Button>
              <Button
                type="link"
                size="small"
                @click="goToPreview(record.formId)"
              >
                填写/收集
              </Button>
              <Button type="link" size="small" @click="openModal(record)">
                编辑
              </Button>
              <Popconfirm
                title="确定删除吗？相关数据也会丢失。"
                @confirm="handleDelete(record.formId)"
              >
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>
    </div>

    <!-- 新增/编辑弹窗 -->
    <Modal
      v-model:open="isModalVisible"
      :title="formState.formId ? '编辑表单配置' : '新增表单配置'"
      @ok="handleSubmit"
      :confirm-loading="submitting"
      destroy-on-close
      width="600px"
    >
      <Form
        ref="formRef"
        :model="formState"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 17 }"
        class="mt-4"
      >
        <Form.Item
          label="表单名称"
          name="formName"
          :rules="[{ required: true, message: '请输入表单名称' }]"
        >
          <Input
            v-model:value="formState.formName"
            placeholder="例如：请假单、报销单"
          />
        </Form.Item>
        <Form.Item label="表单类型" name="formType">
          <Radio.Group v-model:value="formState.formType">
            <Radio value="0">系统内置</Radio>
            <Radio value="1">业务自定义</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="物理表映射"
          name="remark"
          help="用于高级数据写入配置（可选）"
        >
          <Input
            v-model:value="formState.remark"
            placeholder="表名，如：biz_leave_apply"
          />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Radio.Group v-model:value="formState.status">
            <Radio value="0">启用</Radio>
            <Radio value="1">停用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  </Page>
</template>
