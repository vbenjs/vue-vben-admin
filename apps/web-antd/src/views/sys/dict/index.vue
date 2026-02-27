<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import { Col, Row, Tree, Card, Table, Button, Input, Select, Tag, Modal, Form, message, Popconfirm, Radio } from 'ant-design-vue';
import { sysDictTypeApi, sysDictDataApi } from '#/api/core/sys-manage';

const typeLoading = ref(false);
const dataLoading = ref(false);

// ========== 左侧字典类型 (sys_dict_type) ==========
const treeData = ref<any[]>([]);
const selectedKeys = ref<string[]>([]);
const searchType = ref('');

const fetchTypeList = async () => {
  try {
    typeLoading.value = true;
    const res = await sysDictTypeApi.getList({ dictName: searchType.value });
    treeData.value = (res || []).map((item: any) => ({
      ...item,
      title: `${item.dictName} (${item.dictType})`,
      key: item.dictType,
    }));
    if (treeData.value.length > 0 && selectedKeys.value.length === 0) {
      selectedKeys.value = [treeData.value[0].key];
      fetchDataList();
    }
  } finally {
    typeLoading.value = false;
  }
};

// 类别弹窗
const isTypeModalVisible = ref(false);
const typeFormRef = ref();
const typeFormState = ref<any>({ dictName: '', dictType: '', status: '0', remark: '' });

const openTypeModal = (record?: any) => {
  if (record) {
    typeFormState.value = { ...record };
  } else {
    typeFormState.value = { dictName: '', dictType: '', status: '0', remark: '' };
  }
  isTypeModalVisible.value = true;
};

const handleTypeSubmit = async () => {
  try {
    await typeFormRef.value?.validate();
    if (typeFormState.value.dictId) {
      await sysDictTypeApi.update(typeFormState.value.dictId, typeFormState.value);
      message.success('修改类别成功');
    } else {
      await sysDictTypeApi.create(typeFormState.value);
      message.success('新增类别成功');
    }
    isTypeModalVisible.value = false;
    fetchTypeList();
  } catch (error) {
    console.error(error);
  }
};

const handleDeleteType = async (id: number | string) => {
  await sysDictTypeApi.remove(id);
  message.success('删除成功');
  if (selectedKeys.value.length > 0) {
    // 找出当前被删除的那个项是否是选中的项，如果是则清空右侧
    const node = treeData.value.find(item => item.dictId === id);
    if (node && selectedKeys.value.includes(node.key)) {
      selectedKeys.value = [];
      tableData.value = [];
    }
  }
  fetchTypeList();
};

// ========== 右侧字典明细 (sys_dict_data) ==========
const searchData = ref({ dictLabel: '', status: '' });
const tableData = ref<any[]>([]);

const columns = [
  { title: '字典标签', dataIndex: 'dictLabel', key: 'dictLabel' },
  { title: '字典键值', dataIndex: 'dictValue', key: 'dictValue' },
  { title: '排序', dataIndex: 'dictSort', key: 'dictSort' },
  { title: '样式', dataIndex: 'listClass', key: 'listClass' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'action', width: '150px' },
];

const fetchDataList = async () => {
  if (!selectedKeys.value || selectedKeys.value.length === 0) {
    tableData.value = [];
    return;
  }
  try {
    dataLoading.value = true;
    const res = await sysDictDataApi.getList({
      dictType: selectedKeys.value[0],
      ...searchData.value
    });
    tableData.value = res || [];
  } finally {
    dataLoading.value = false;
  }
};

const handleSelect = (keys: any[]) => {
  if (keys.length > 0) {
    selectedKeys.value = keys;
    fetchDataList();
  }
};

// 字典项弹窗
const isDataModalVisible = ref(false);
const dataFormRef = ref();
const dataFormState = ref<any>({ dictLabel: '', dictValue: '', dictSort: 0, listClass: 'default', status: '0', remark: '' });

const openDataModal = (record?: any) => {
  if (record) {
    dataFormState.value = { ...record };
  } else {
    dataFormState.value = { dictLabel: '', dictValue: '', dictSort: 0, listClass: 'default', status: '0', remark: '', dictType: selectedKeys.value[0] };
  }
  isDataModalVisible.value = true;
};

const handleDataSubmit = async () => {
  try {
    await dataFormRef.value?.validate();
    if (dataFormState.value.dictCode) {
      await sysDictDataApi.update(dataFormState.value.dictCode, dataFormState.value);
      message.success('修改成功');
    } else {
      await sysDictDataApi.create(dataFormState.value);
      message.success('新增成功');
    }
    isDataModalVisible.value = false;
    fetchDataList();
  } catch (error) {
    console.error(error);
  }
};

const handleDeleteData = async (id: number | string) => {
  await sysDictDataApi.remove(id);
  message.success('删除成功');
  fetchDataList();
};

onMounted(() => {
  fetchTypeList();
});
</script>

<template>
  <Page title="数据字典管理" description="维护系统各种下拉框、标签、单选等多选数据集合。（双表左树右表设计）">
    <div class="p-4">
      <Row :gutter="16">
        <!-- 左侧：字典类别 -->
        <Col :span="6">
          <Card title="字典类别" :bordered="false" class="h-full">
            <template #extra><Button type="link" size="small" @click="openTypeModal()">新增分类</Button></template>
            <div class="flex gap-2 mb-4">
              <Input.Search v-model:value="searchType" placeholder="搜索字典类型" @search="fetchTypeList" class="flex-1" />
            </div>
            <Tree
              v-model:selectedKeys="selectedKeys"
              :tree-data="treeData"
              class="border border-gray-100 p-2 rounded max-h-[600px] overflow-y-auto"
              @select="handleSelect"
            >
              <template #title="{ key, title, dataRef }">
                <div class="flex justify-between items-center w-full group">
                  <span class="truncate pr-2">{{ title }}</span>
                  <div class="hidden group-hover:flex items-center gap-1">
                    <Button type="link" size="small" class="!px-1 !py-0 text-xs" @click.stop="openTypeModal(dataRef)">✏️</Button>
                    <Popconfirm title="删除分类？" @confirm="handleDeleteType(dataRef.dictId)">
                      <Button type="link" danger size="small" class="!px-1 !py-0 text-xs" @click.stop>❌</Button>
                    </Popconfirm>
                  </div>
                </div>
              </template>
            </Tree>
          </Card>
        </Col>

        <!-- 右侧：字典明细 -->
        <Col :span="18">
          <Card :title="`[ ${selectedKeys[0] || '请选择分类'} ] - 字典数据`" :bordered="false" class="h-full">
            <template #extra>
              <Button type="primary" class="mr-2" @click="openDataModal()">新增字典项</Button>
            </template>
            
            <div class="mb-4 flex gap-4">
              <Input v-model:value="searchData.dictLabel" placeholder="字典标签 (如: 男)" class="w-64" allowClear />
              <Select v-model:value="searchData.status" placeholder="状态" class="w-32" allowClear :options="[{label:'正常', value:'0'}, {label:'停用', value:'1'}]" />
              <Button type="primary" @click="fetchDataList">搜索</Button>
              <Button @click="() => { searchData = { dictLabel: '', status: '' }; fetchDataList(); }">重置</Button>
            </div>

            <Table :columns="columns" :dataSource="tableData" bordered :pagination="false" :loading="dataLoading" rowKey="dictCode">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'listClass'">
                  <Tag :color="record.listClass === 'default' ? '' : (record.listClass === 'primary' ? 'blue' : (record.listClass === 'success' ? 'green' : (record.listClass === 'danger' ? 'red' : 'orange')))">
                    {{ record.listClass }}
                  </Tag>
                </template>
                <template v-if="column.key === 'status'">
                  <Tag :color="record.status === '0' ? 'success' : 'error'">{{ record.status === '0' ? '正常' : '停用' }}</Tag>
                </template>
                <template v-if="column.key === 'action'">
                  <Button type="link" size="small" @click="openDataModal(record)">编辑</Button>
                  <Popconfirm title="确定删除吗？" @confirm="handleDeleteData(record.dictCode)">
                    <Button type="link" danger size="small">删除</Button>
                  </Popconfirm>
                </template>
              </template>
            </Table>
          </Card>
        </Col>
      </Row>
    </div>

    <!-- 字典类型弹窗 -->
    <Modal v-model:open="isTypeModalVisible" :title="typeFormState.dictId ? '编辑分类' : '新增分类'" @ok="handleTypeSubmit" destroyOnClose>
      <Form ref="typeFormRef" :model="typeFormState" :label-col="{span: 4}" :wrapper-col="{span: 18}" class="mt-4">
        <Form.Item label="字典名称" name="dictName" :rules="[{ required: true, message: '请输入字典名称' }]">
          <Input v-model:value="typeFormState.dictName" placeholder="如: 用户性别" />
        </Form.Item>
        <Form.Item label="字典类型" name="dictType" :rules="[{ required: true, message: '请输入字典类型' }]">
          <Input v-model:value="typeFormState.dictType" placeholder="如: sys_user_sex" />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Radio.Group v-model:value="typeFormState.status">
            <Radio value="0">正常</Radio>
            <Radio value="1">停用</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input.TextArea v-model:value="typeFormState.remark" />
        </Form.Item>
      </Form>
    </Modal>

    <!-- 字典数据弹窗 -->
    <Modal v-model:open="isDataModalVisible" :title="dataFormState.dictCode ? '编辑字典项' : '新增字典项'" @ok="handleDataSubmit" destroyOnClose>
      <Form ref="dataFormRef" :model="dataFormState" :label-col="{span: 4}" :wrapper-col="{span: 18}" class="mt-4">
        <Form.Item label="字典类型" name="dictType">
          <Input v-model:value="dataFormState.dictType" disabled />
        </Form.Item>
        <Form.Item label="数据标签" name="dictLabel" :rules="[{ required: true, message: '请输入标签' }]">
          <Input v-model:value="dataFormState.dictLabel" placeholder="如: 男" />
        </Form.Item>
        <Form.Item label="数据键值" name="dictValue" :rules="[{ required: true, message: '请输入键值' }]">
          <Input v-model:value="dataFormState.dictValue" placeholder="如: 1" />
        </Form.Item>
        <Form.Item label="样式属性" name="listClass">
          <Select v-model:value="dataFormState.listClass" :options="[{label:'默认(default)', value:'default'}, {label:'主要(primary)', value:'primary'}, {label:'成功(success)', value:'success'}, {label:'警告(warning)', value:'warning'}, {label:'危险(danger)', value:'danger'}]" />
        </Form.Item>
        <Form.Item label="显示排序" name="dictSort">
          <Input type="number" v-model:value="dataFormState.dictSort" />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Radio.Group v-model:value="dataFormState.status">
            <Radio value="0">正常</Radio>
            <Radio value="1">停用</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input.TextArea v-model:value="dataFormState.remark" />
        </Form.Item>
      </Form>
    </Modal>
  </Page>
</template>

<style scoped>
/* Scoped styles can go here */
</style>
