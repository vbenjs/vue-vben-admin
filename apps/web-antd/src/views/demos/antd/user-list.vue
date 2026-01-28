<script lang="ts" setup>
import { Page } from '@vben/common-ui';
import { Button, Card, DatePicker, Drawer, Form, Input, InputNumber, message, Modal, Space, Table, Tag } from 'ant-design-vue';
import { ref, reactive } from 'vue';
import { SearchOutlined, EyeOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons-vue';

// 模拟用户数据
interface User {
  uid: string;
  nickname: string;
  username: string;
  lastLoginTime: string;
  lastLoginIp: string;
  loginCount: number;
  registerTime: string;
  isFrozen: boolean;
}

// 从JSON文件加载用户数据
import usersData from '#/data/users.json';
const users = ref<User[]>(usersData);

// 筛选表单
const filterForm = reactive({
  uid: '',
  nickname: '',
  username: '',
  lastLoginTime: [],
  lastLoginIp: '',
  loginCount: [],
  registerTime: []
});

// 表格列配置
const columns = [
  { title: '用户UID', dataIndex: 'uid', key: 'uid' },
  { title: '昵称', dataIndex: 'nickname', key: 'nickname' },
  { title: '用户名', dataIndex: 'username', key: 'username' },
  { title: '最近登录时间', dataIndex: 'lastLoginTime', key: 'lastLoginTime' },
  { title: '最近登录IP', dataIndex: 'lastLoginIp', key: 'lastLoginIp' },
  { title: '当月登录次数', dataIndex: 'loginCount', key: 'loginCount' },
  { title: '注册时间', dataIndex: 'registerTime', key: 'registerTime' },
  {
    title: '操作',
    key: 'action',
    slots: {
      customRender: ({ record }: { record: User }) => (
        <Space size="middle">
          <Button type="primary" :icon="EyeOutlined" @click={() => showDetail(record)}>详情</Button>
          <Button
            type="default"
            :icon="LockOutlined"
            :disabled="record.isFrozen"
            @click={() => toggleFreeze(record, true)}
          >
            冻结登录
          </Button>
          <Button
            type="default"
            :icon="UnlockOutlined"
            :disabled="!record.isFrozen"
            @click={() => toggleFreeze(record, false)}
          >
            解冻登录
          </Button>
        </Space>
      )
    }
  }
];

// 详情抽屉
const detailDrawer = ref(false);
const currentUser = ref<User | null>(null);

const showDetail = (user: User) => {
  currentUser.value = user;
  detailDrawer.value = true;
};

// 冻结/解冻
const toggleFreeze = (user: User, freeze: boolean) => {
  const action = freeze ? '冻结' : '解冻';
  Modal.confirm({
    title: `${action}用户`,
    content: `确定要${action}用户 ${user.nickname} 吗？`,
    async onOk() {
      try {
        const index = users.value.findIndex(u => u.uid === user.uid);
        if (index !== -1) {
          users.value[index].isFrozen = freeze;
          message.success(`${action}成功`);
        } else {
          message.error(`未找到用户 ${user.nickname}`);
        }
      } catch (err) {
        message.error(`${action}失败：${(err as Error).message}`);
      }
    },
    onCancel() {
      message.info(`已取消${action}操作`);
    }
  });
};

// 搜索
const search = () => {
  // 这里可以添加筛选逻辑
  message.success('搜索功能待实现');
};
</script>

<template>
  <Page title="用户列表">
    <Card class="mb-5">
      <Form :model="filterForm" layout="inline">
        <Form.Item label="UID">
          <Input v-model:value="filterForm.uid" placeholder="请输入UID" />
        </Form.Item>
        <Form.Item label="昵称">
          <Input v-model:value="filterForm.nickname" placeholder="请输入昵称" />
        </Form.Item>
        <Form.Item label="用户名">
          <Input v-model:value="filterForm.username" placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item label="最近登录时间">
          <DatePicker.RangePicker v-model:value="filterForm.lastLoginTime" style="width: 300px" />
        </Form.Item>
        <Form.Item label="最近登录IP">
          <Input v-model:value="filterForm.lastLoginIp" placeholder="请输入IP" />
        </Form.Item>
        <Form.Item label="当月登录次数">
          <InputNumber v-model:value="filterForm.loginCount[0]" placeholder="最小值" style="width: 100px" />
          <span class="mx-2">-</span>
          <InputNumber v-model:value="filterForm.loginCount[1]" placeholder="最大值" style="width: 100px" />
        </Form.Item>
        <Form.Item label="注册时间">
          <DatePicker.RangePicker v-model:value="filterForm.registerTime" style="width: 300px" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" :icon="SearchOutlined" @click="search">查找</Button>
        </Form.Item>
      </Form>
    </Card>

    <Card>
      <Table :columns="columns" :data-source="users" row-key="uid" bordered />
    </Card>

    <Drawer
      title="用户详情"
      :open="detailDrawer"
      placement="right"
      @close="detailDrawer = false"
      width="500px"
    >
      <div v-if="currentUser">
        <p><strong>UID:</strong> {{ currentUser.uid }}</p>
        <p><strong>昵称:</strong> {{ currentUser.nickname }}</p>
        <p><strong>用户名:</strong> {{ currentUser.username }}</p>
        <p><strong>最近登录时间:</strong> {{ currentUser.lastLoginTime }}</p>
        <p><strong>最近登录IP:</strong> {{ currentUser.lastLoginIp }}</p>
        <p><strong>当月登录次数:</strong> {{ currentUser.loginCount }}</p>
        <p><strong>注册时间:</strong> {{ currentUser.registerTime }}</p>
        <p>
          <strong>状态:</strong>
          <Tag :color="currentUser.isFrozen ? 'red' : 'green'">
            {{ currentUser.isFrozen ? '已冻结' : '正常' }}
          </Tag>
        </p>
      </div>
    </Drawer>
  </Page>
</template>
