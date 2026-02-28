<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import {
  Card, Table, Button, Input, Tag, Switch, Popconfirm,
  Modal, Form, InputNumber, Radio, message,
} from 'ant-design-vue';
import { sysFormDesignApi } from '#/api/core/sys-manage';

const loading = ref(false);
const dataSource = ref([]);
const pagination = ref({ current: 1, pageSize: 30, total: 0 });
const searchParams = ref({ flowName: '', flowNo: '' });

const columns = [
  { title: '流程名称', dataIndex: 'flowName', key: 'flowName' },
  { title: '流程编号', dataIndex: 'flowNo', key: 'flowNo', width: 140 },
  { title: '流程类型', dataIndex: 'flowType', key: 'flowType', width: 100 },
  { title: '备注', dataIndex: 'remark', key: 'remark' },
  { title: '排序', dataIndex: 'orderNo', key: 'orderNo', width: 70 },
  { title: '是否可用', dataIndex: 'enabled', key: 'enabled', width: 90 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
  { title: '修改时间', dataIndex: 'updateTime', key: 'updateTime', width: 160 },
  { title: '操作', key: 'action', width: 160 },
];

const formatDate = (v: string) => (v ? new Date(v).toLocaleString('zh-CN') : '-');

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await sysFormDesignApi.getList({
      page, pageSize: pagination.value.pageSize, ...searchParams.value,
    });
    dataSource.value = res?.items || [];
    pagination.value.current = page;
    pagination.value.total = res?.total || 0;
  } finally {
    loading.value = false;
  }
};

/* ---- 新增/编辑 Modal ---- */
const isModalVisible = ref(false);
const submitting = ref(false);
const formRef = ref();
const defaultForm = () => ({
  flowName: '', flowNo: '', orderNo: 0, status: '0', remark: '',
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
  } catch (err) {
    console.error(err);
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (id: number) => {
  await sysFormDesignApi.remove(id);
  message.success('删除成功');
  fetchList(pagination.value.current);
};

onMounted(() => fetchList());
</script>

<template>
  <Page title="流程管理" description="维护业务流程定义、流程表单和流程配置。">
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-3 flex gap-3 flex-wrap">
          <Input v-model:value="searchParams.flowName" placeholder="流程名称" class="w-40" allowClear />
          <Input v-model:value="searchParams.flowNo" placeholder="流程编号" class="w-40" allowClear />
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button @click="() => { searchParams.flowName = ''; searchParams.flowNo = ''; fetchList(1); }">重置</Button>
          <Button type="primary" class="ml-auto" @click="openModal()">+ 新建</Button>
          <Button>编辑</Button>
          <Button>复制</Button>
          <Popconfirm title="确定删除选中的流程吗？">
            <Button danger ghost>删除</Button>
          </Popconfirm>
          <Button>导出</Button>
        </div>

        <Table
          :columns="columns"
          :dataSource="dataSource"
          :loading="loading"
          :pagination="pagination"
          @change="(pag) => fetchList(pag.current)"
          rowKey="formId"
          bordered
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'flowType'">
              <Tag color="processing">{{ record.formType === '0' ? '内置' : '自定义' }}</Tag>
            </template>
            <template v-if="column.key === 'enabled'">
              <Switch :checked="record.status === '0'" size="small" disabled />
            </template>
            <template v-if="column.key === 'createTime'">{{ formatDate(record.createTime) }}</template>
            <template v-if="column.key === 'updateTime'">{{ formatDate(record.updateTime) }}</template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small">流程表单</Button>
              <Button type="link" size="small" @click="openModal(record)">编辑</Button>
              <Popconfirm title="确定删除？" @confirm="handleDelete(record.formId)">
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
      :title="formState.formId ? '编辑流程' : '新增流程'"
      @ok="handleSubmit"
      :confirmLoading="submitting"
      destroyOnClose
      width="520px"
    >
      <Form
        ref="formRef"
        :model="formState"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 17 }"
        class="mt-4"
      >
        <Form.Item
          label="流程名称"
          name="flowName"
          :rules="[{ required: true, message: '请输入流程名称' }]"
        >
          <Input v-model:value="formState.flowName" placeholder="请输入流程名称" />
        </Form.Item>
        <Form.Item label="流程编号" name="flowNo">
          <Input v-model:value="formState.flowNo" placeholder="请输入流程编号" />
        </Form.Item>
        <Form.Item label="排序号" name="orderNo">
          <InputNumber v-model:value="formState.orderNo" :min="0" style="width: 100%" />
        </Form.Item>
        <Form.Item label="是否可用" name="status">
          <Radio.Group v-model:value="formState.status">
            <Radio value="0">是</Radio>
            <Radio value="1">否</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input.TextArea v-model:value="formState.remark" placeholder="可输入备注信息" />
        </Form.Item>
      </Form>
    </Modal>
  </Page>
</template>
