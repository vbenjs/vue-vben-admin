<script setup lang="ts">
import { ref } from 'vue';
import { Page } from '@vben/common-ui';
import { Col, Row, Tree, Card, Table, Button, Input, Select, Divider } from 'ant-design-vue';

// 左侧字典类型树 (sys_dict_type)
const treeData = ref([
  { title: '用户性别 (sys_user_sex)', key: 'sys_user_sex' },
  { title: '订单状态 (biz_order_status)', key: 'biz_order_status' },
  { title: '发布状态 (sys_publish_status)', key: 'sys_publish_status' },
]);
const selectedKeys = ref(['sys_user_sex']);

// 右侧具体字典表格数据 (sys_dict_data)
const columns = [
  { title: '字典标签', dataIndex: 'label', key: 'label' },
  { title: '字典键值', dataIndex: 'value', key: 'value' },
  { title: '排序', dataIndex: 'sort', key: 'sort' },
  { title: '回显主题样式', dataIndex: 'class', key: 'class' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'action', width: '150px' },
];

const tableData = ref([
  { key: '1', label: '男', value: '1', sort: 1, class: 'default', status: '正常' },
  { key: '2', label: '女', value: '2', sort: 2, class: 'danger', status: '正常' },
  { key: '3', label: '未知', value: '0', sort: 3, class: 'info', status: '正常' },
]);

const handleSelect = (keys: any[]) => {
  if (keys.length > 0) {
    selectedKeys.value = keys;
    console.log('加载字典详情:', keys[0]);
    // 模拟请求加载对应的字典数据
    // fetchDictData(keys[0]);
  }
};
</script>

<template>
  <Page title="数据字典管理" description="维护系统各种下拉框、标签、单选等多选数据集合。（双表左树右表设计）">
    <div class="p-4">
      <Row :gutter="16">
        <!-- 左侧：字典类别 -->
        <Col :span="6">
          <Card title="字典类别" :bordered="false" class="h-full">
            <template #extra><Button type="link" size="small">新增分类</Button></template>
            <Input.Search placeholder="搜索字典类型" class="mb-4" />
            <Tree
              v-model:selectedKeys="selectedKeys"
              :tree-data="treeData"
              class="border border-gray-100 p-2 rounded"
              @select="handleSelect"
            />
          </Card>
        </Col>

        <!-- 右侧：字典明细 -->
        <Col :span="18">
          <Card :title="`[ ${selectedKeys[0] || '请选择分类'} ] - 字典数据`" :bordered="false" class="h-full">
            <template #extra>
              <Button type="primary" class="mr-2">新增字典项</Button>
              <Button>一键清理缓存</Button>
            </template>
            
            <div class="mb-4 flex gap-4">
              <Input placeholder="字典标签 (如: 男)" class="w-64" />
              <Select placeholder="主题样式" class="w-48" allowClear :options="[{label:'默认', value:'default'}, {label:'主色', value:'primary'}, {label:'Danger', value:'danger'}]" />
              <Button type="primary">搜索</Button>
              <Button>重置</Button>
            </div>

            <Table :columns="columns" :dataSource="tableData" bordered :pagination="false">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'class'">
                  <div class="flex items-center gap-2">
                    <span :class="`px-2 py-1 text-xs rounded border ${record.class === 'danger' ? 'bg-red-50 text-red-500 border-red-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`">
                      {{ record.class }}
                    </span>
                  </div>
                </template>
                <template v-if="column.key === 'action'">
                  <a class="text-blue-500 mr-2">编辑</a>
                  <a class="text-red-500">删除</a>
                </template>
              </template>
            </Table>
          </Card>
        </Col>
      </Row>
    </div>
  </Page>
</template>

<style scoped>
/* Scoped styles can go here */
</style>
