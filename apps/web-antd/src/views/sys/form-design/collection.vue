<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  Col,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Switch,
  Table,
} from 'ant-design-vue';

import { sysFormDataApi, sysFormDesignApi } from '#/api/core/sys-manage';

const route = useRoute();
const router = useRouter();
const formId = ref(route.query.formId as string);
const formInfo = ref<any>({});
const fieldList = ref<any[]>([]);

const loading = ref(false);
const dataSource = ref([]);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });

// Calculate dynamic table columns based on the form design
const columns = ref<any[]>([
  { title: '数据编号', dataIndex: 'id', key: 'id', width: 100 },
  { title: '提交人', dataIndex: 'createBy', key: 'createBy', width: 120 },
  { title: '提交时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
]);

const parseFormData = (dataStr: string) => {
  try {
    return JSON.parse(dataStr);
  } catch {
    return {};
  }
};

const fetchFormDesign = async () => {
  if (!formId.value) return;
  try {
    const res = await sysFormDesignApi.getList({ formId: formId.value });
    if (res?.items?.length) {
      formInfo.value = res.items[0];
      if (formInfo.value.formContent) {
        fieldList.value = JSON.parse(formInfo.value.formContent);
        // Build map for dynamic columns
        fieldList.value.forEach((field) => {
          columns.value.push({
            title: field.label,
            dataIndex: `custom_${field.fieldName}`,
            key: field.fieldName,
          });
        });
        columns.value.push({ title: '操作', key: 'action', width: 120 });
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const fetchList = async (page = 1) => {
  if (!formId.value) return;
  try {
    loading.value = true;
    const res = await sysFormDataApi.getList({
      page,
      pageSize: pagination.value.pageSize,
      formId: formId.value,
    });

    // Map JSON formData string into top-level properties for AntD Table
    dataSource.value = (res?.items || []).map((item: any) => {
      const parsedData = parseFormData(item.formData);
      const mappedItem = { ...item };
      fieldList.value.forEach((f) => {
        mappedItem[`custom_${f.fieldName}`] = parsedData[f.fieldName] || '-';
      });
      mappedItem.createTime = new Date(item.createTime).toLocaleString('zh-CN');
      return mappedItem;
    });

    pagination.value.current = page;
    pagination.value.total = res?.total || 0;
  } finally {
    loading.value = false;
  }
};

/* ---- Write/Submit Form Data ---- */
const isModalVisible = ref(false);
const submitting = ref(false);
const formState = ref<any>({});

const openSubmitModal = () => {
  formState.value = {};
  isModalVisible.value = true;
};

const handleSubmit = async () => {
  try {
    submitting.value = true;
    await sysFormDataApi.create({
      formId: formId.value,
      formData: JSON.stringify(formState.value),
      createBy: '当前用户',
    });
    message.success('提交成功');
    isModalVisible.value = false;
    fetchList(1);
  } catch (error) {
    console.error(error);
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (id: number) => {
  await sysFormDataApi.remove(id);
  message.success('删除成功');
  fetchList(pagination.value.current);
};

onMounted(async () => {
  if (!formId.value) {
    message.warning('缺少 params: formId');
    router.back();
    return;
  }
  await fetchFormDesign();
  await fetchList();
});
</script>

<template>
  <Page
    :title="`数据采集管理 - ${formInfo.formName || '加载中...'}`"
    description="本页面基于表单设计器的 Schema 动态渲染收集列表与提交流程。"
  >
    <div class="flex h-full flex-col p-4">
      <Card :bordered="false" class="flex-1">
        <div class="mb-3 flex justify-between">
          <Button @click="router.back()">返回业务列表</Button>
          <Button type="primary" @click="openSubmitModal()">
            + 填写单据(模拟收集)
          </Button>
        </div>

        <Table
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          :pagination="pagination"
          @change="(pag) => fetchList(pag.current)"
          row-key="id"
          bordered
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <Popconfirm
                title="确定删除这行数据吗？"
                @confirm="handleDelete(record.id)"
              >
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>
    </div>

    <!-- 动态渲染的填写弹窗 -->
    <Modal
      v-model:open="isModalVisible"
      :title="`填写: ${formInfo.formName || '动态表单'}`"
      @ok="handleSubmit"
      :confirm-loading="submitting"
      destroy-on-close
      width="600px"
    >
      <div class="mt-4 rounded border bg-gray-50 px-4 py-4">
        <Row :gutter="16">
          <Col
            v-for="field in fieldList"
            :key="field.fieldName"
            :span="field.gridSpan || 24"
            class="mb-4"
          >
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700">
                <span v-if="field.required" class="mr-1 text-red-500">*</span>
                {{ field.label }}
              </label>

              <Input
                v-if="field.component === 'Input'"
                v-model:value="formState[field.fieldName]"
                placeholder="请输入内容"
              />
              <Select
                v-if="field.component === 'Select'"
                v-model:value="formState[field.fieldName]"
                :options="[
                  { value: 'OptionA', label: 'Option A' },
                  { value: 'OptionB', label: 'Option B' },
                ]"
                placeholder="请选择"
              />
              <Switch
                v-if="field.component === 'Switch'"
                v-model:checked="formState[field.fieldName]"
              />
              <Input
                v-if="field.component === 'DatePicker'"
                v-model:value="formState[field.fieldName]"
                placeholder="YYYY-MM-DD"
              />
              <Input
                v-if="field.component === 'InputNumber'"
                v-model:value="formState[field.fieldName]"
                type="number"
                placeholder="输入数字"
              />
            </div>
          </Col>
        </Row>
      </div>
    </Modal>
  </Page>
</template>
