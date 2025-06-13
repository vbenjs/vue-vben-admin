<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import {
  ElButton,
  ElCard,
  ElCheckTag,
  ElDescriptions,
  ElDescriptionsItem,
  ElMessage,
  ElMessageBox,
  ElNotification,
  ElOption,
  ElPagination,
  ElPopconfirm,
  ElPopover,
  ElSegmented,
  ElSelect,
  ElSelectV2,
  ElSpace,
  ElTable,
  ElTableColumn,
  ElTabPane,
  ElTabs,
  ElTag,
  ElTimePicker,
  ElTimeSelect,
  ElTooltip,
  ElTreeSelect,
} from 'element-plus';

type NotificationType = 'error' | 'info' | 'success' | 'warning';

function info() {
  ElMessage.info('How many roads must a man walk down');
}

function error() {
  ElMessage.error({
    duration: 2500,
    message: 'Once upon a time you dressed so fine',
  });
}

function warning() {
  ElMessage.warning('How many roads must a man walk down');
}
function success() {
  ElMessage.success(
    'Cause you walked hand in hand With another man in my place',
  );
}

function messageBox() {
  ElMessageBox.alert('This is a message', 'Title', {
    confirmButtonText: 'OK',
    callback: (action: any) => {
      ElMessage({
        type: 'info',
        message: `action: ${action}`,
      });
    },
  });
}

function notify(type: NotificationType) {
  ElNotification({
    duration: 2500,
    message: '说点啥呢',
    type,
  });
}
const segmentedValue = ref('Mon');

const segmentedOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const type1 = ref();
const date = ref();
const options = Array.from({ length: 1000 }).map((_, idx) => ({
  value: `Option ${idx + 1}`,
  label: `${[idx % 10]}${idx}`,
}));

const currentPage = ref(4);
const pageSize = ref(100);

const tableData2 = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
];

const checked = ref(true);

const tabPosition = ref('top');

function changeChecked(v: boolean) {
  checked.value = v;
}
</script>

<template>
  <Page
    description="支持多语言，主题功能集成切换等"
    title="Element Plus组件使用演示"
  >
    <div class="flex flex-wrap gap-4">
      <ElCard class="mb-4 w-auto">
        <template #header> Button </template>
        <div class="flex flex-col gap-4">
          <div>
            <ElButton>Default</ElButton>
            <ElButton type="primary">Primary</ElButton>
            <ElButton type="success">Success</ElButton>
            <ElButton type="info">Info</ElButton>
            <ElButton type="warning">Warning</ElButton>
            <ElButton type="danger">Danger</ElButton>
          </div>

          <div>
            <ElButton plain>Plain</ElButton>
            <ElButton type="primary" plain>Primary</ElButton>
            <ElButton type="success" plain>Success</ElButton>
            <ElButton type="info" plain>Info</ElButton>
            <ElButton type="warning" plain>Warning</ElButton>
            <ElButton type="danger" plain>Danger</ElButton>
          </div>

          <div>
            <ElButton round>Round</ElButton>
            <ElButton type="primary" round>Primary</ElButton>
            <ElButton type="success" round>Success</ElButton>
            <ElButton type="info" round>Info</ElButton>
            <ElButton type="warning" round>Warning</ElButton>
            <ElButton type="danger" round>Danger</ElButton>
          </div>

          <div>
            <ElButton :icon="Plus" circle />
            <ElButton type="primary" :icon="Plus" circle />
            <ElButton type="success" :icon="Plus" circle />
            <ElButton type="info" :icon="Plus" circle />
            <ElButton type="warning" :icon="Plus" circle />
            <ElButton type="danger" :icon="Plus" circle />
          </div>

          <div>
            <ElButton disabled>Default</ElButton>
            <ElButton type="primary" disabled>Primary</ElButton>
            <ElButton type="success" disabled>Success</ElButton>
            <ElButton type="info" disabled>Info</ElButton>
            <ElButton type="warning" disabled>Warning</ElButton>
            <ElButton type="danger" disabled>Danger</ElButton>
          </div>

          <div>
            <ElButton plain disabled>Plain</ElButton>
            <ElButton type="primary" plain disabled>Primary</ElButton>
            <ElButton type="success" plain disabled>Success</ElButton>
            <ElButton type="info" plain disabled>Info</ElButton>
            <ElButton type="warning" plain disabled>Warning</ElButton>
            <ElButton type="danger" plain disabled>Danger</ElButton>
          </div>
          <div>
            <ElButton link>Plain</ElButton>
            <ElButton type="primary" link>Primary</ElButton>
            <ElButton type="success" link>Success</ElButton>
            <ElButton type="info" link>Info</ElButton>
            <ElButton type="warning" link>Warning</ElButton>
            <ElButton type="danger" link>Danger</ElButton>
          </div>
          <div>
            <ElButton link disabled>Plain</ElButton>
            <ElButton type="primary" link disabled>Primary</ElButton>
            <ElButton type="success" link disabled>Success</ElButton>
            <ElButton type="info" link disabled>Info</ElButton>
            <ElButton type="warning" link disabled>Warning</ElButton>
            <ElButton type="danger" link disabled>Danger</ElButton>
          </div>
          <div>
            <ElButton text>Plain</ElButton>
            <ElButton type="primary" text>Primary</ElButton>
            <ElButton type="success" text>Success</ElButton>
            <ElButton type="info" text>Info</ElButton>
            <ElButton type="warning" text>Warning</ElButton>
            <ElButton type="danger" text>Danger</ElButton>
          </div>
          <div>
            <ElButton text disabled>Plain</ElButton>
            <ElButton type="primary" text disabled>Primary</ElButton>
            <ElButton type="success" text disabled>Success</ElButton>
            <ElButton type="info" text disabled>Info</ElButton>
            <ElButton type="warning" text disabled>Warning</ElButton>
            <ElButton type="danger" text disabled>Danger</ElButton>
          </div>
        </div>
      </ElCard>
      <ElCard class="mb-4 w-auto">
        <template #header> Tag </template>
        <div class="flex flex-col gap-4">
          <ElSpace>
            <ElTag type="primary">Tag 1</ElTag>
            <ElTag type="success">Tag 2</ElTag>
            <ElTag type="info">Tag 3</ElTag>
            <ElTag type="warning">Tag 4</ElTag>
            <ElTag type="danger">Tag 5</ElTag>
          </ElSpace>
          <ElSpace>
            <ElTag effect="dark" type="primary">Tag 1</ElTag>
            <ElTag effect="dark" type="success">Tag 2</ElTag>
            <ElTag effect="dark" type="info">Tag 3</ElTag>
            <ElTag effect="dark" type="warning">Tag 4</ElTag>
            <ElTag effect="dark" type="danger">Tag 5</ElTag>
          </ElSpace>
          <ElSpace>
            <ElTag effect="plain" type="primary">Tag 1</ElTag>
            <ElTag effect="plain" type="success">Tag 2</ElTag>
            <ElTag effect="plain" type="info">Tag 3</ElTag>
            <ElTag effect="plain" type="warning">Tag 4</ElTag>
            <ElTag effect="plain" type="danger">Tag 5</ElTag>
          </ElSpace>
          <ElSpace>
            <ElTag round type="primary">Tag 1</ElTag>
            <ElTag round type="success">Tag 2</ElTag>
            <ElTag round type="info">Tag 3</ElTag>
            <ElTag round type="warning">Tag 4</ElTag>
            <ElTag round type="danger">Tag 5</ElTag>
          </ElSpace>
          <ElSpace>
            <ElTag round effect="dark" type="primary">Tag 1</ElTag>
            <ElTag round effect="dark" type="success">Tag 2</ElTag>
            <ElTag round effect="dark" type="info">Tag 3</ElTag>
            <ElTag round effect="dark" type="warning">Tag 4</ElTag>
            <ElTag round effect="dark" type="danger">Tag 5</ElTag>
          </ElSpace>
          <ElSpace>
            <ElTag round effect="plain" type="primary">Tag 1</ElTag>
            <ElTag round effect="plain" type="success">Tag 2</ElTag>
            <ElTag round effect="plain" type="info">Tag 3</ElTag>
            <ElTag round effect="plain" type="warning">Tag 4</ElTag>
            <ElTag round effect="plain" type="danger">Tag 5</ElTag>
          </ElSpace>
          <ElSpace>
            <ElCheckTag checked>Checked</ElCheckTag>
            <ElCheckTag :checked="checked" @change="changeChecked">
              Toggle me
            </ElCheckTag>
            <ElCheckTag disabled>Disabled</ElCheckTag>
          </ElSpace>
          <ElSpace>
            <ElCheckTag
              :checked="checked"
              @change="changeChecked"
              type="primary"
            >
              Tag 1
            </ElCheckTag>
            <ElCheckTag
              :checked="checked"
              @change="changeChecked"
              type="success"
            >
              Tag 2
            </ElCheckTag>
            <ElCheckTag :checked="checked" @change="changeChecked" type="info">
              Tag 3
            </ElCheckTag>
            <ElCheckTag
              :checked="checked"
              @change="changeChecked"
              type="warning"
            >
              Tag 4
            </ElCheckTag>
            <ElCheckTag
              :checked="checked"
              @change="changeChecked"
              type="danger"
            >
              Tag 5
            </ElCheckTag>
            <ElCheckTag
              :checked="checked"
              @change="changeChecked"
              disabled
              type="success"
            >
              Tag 6
            </ElCheckTag>
          </ElSpace>
        </div>
      </ElCard>
      <ElCard class="mb-4 w-auto">
        <template #header> Table </template>
        <div class="flex flex-col gap-4">
          无边框
          <ElSpace>
            <ElTable
              :data="tableData2"
              style="width: 300px"
              show-overflow-tooltip
            >
              <ElTableColumn prop="date" label="Date" width="180" />
              <ElTableColumn prop="name" label="Name" width="180" />
              <ElTableColumn prop="address" label="Address" />
            </ElTable>
          </ElSpace>
          有边框
          <ElSpace>
            <ElTable
              :data="tableData2"
              style="width: 300px"
              show-overflow-tooltip
              border
            >
              <ElTableColumn prop="date" label="Date" width="180" />
              <ElTableColumn prop="name" label="Name" width="180" />
              <ElTableColumn prop="address" label="Address" fixed="right" />
            </ElTable>
          </ElSpace>
          无表头
          <ElSpace>
            <ElTable
              :data="tableData2"
              style="width: 300px"
              show-overflow-tooltip
              :show-header="false"
              border
            >
              <ElTableColumn prop="date" label="Date" width="180" />
              <ElTableColumn prop="name" label="Name" width="180" />
              <ElTableColumn prop="address" label="Address" fixed="right" />
            </ElTable>
          </ElSpace>
        </div>
      </ElCard>

      <ElCard class="mb-4 w-auto">
        <template #header> Popper </template>
        <div class="grid grid-cols-2 gap-4">
          <ElSpace>
            <ElSelect
              v-model="type1"
              placeholder="Select"
              style="width: 240px"
              clearable
            >
              <ElOption label="Option 1" value="1" />
              <ElOption label="Option 2" value="2" disabled />
            </ElSelect>
          </ElSpace>
          <ElSpace>
            <ElSelectV2
              v-model="type1"
              :options="options"
              placeholder="ElSelectV2"
              style="width: 240px"
            />
          </ElSpace>
          <ElSpace>
            <ElTimePicker v-model="date" placeholder="ElTimePicker" />
          </ElSpace>
          <ElSpace>
            <ElTimeSelect
              v-model="date"
              start="08:30"
              step="00:15"
              end="18:30"
              placeholder="Select time"
            />
          </ElSpace>
          <ElSpace>
            <ElTreeSelect
              v-model="type1"
              :data="options"
              :render-after-expand="false"
              style="width: 240px"
              placeholder="ElTreeSelect"
            />
          </ElSpace>
          <ElSpace>
            <ElPopconfirm title="Are you sure to delete this?">
              <template #reference>
                <ElButton>Delete</ElButton>
              </template>
            </ElPopconfirm>
            <ElButton @click="messageBox"> Message Box </ElButton>
          </ElSpace>
          <ElSpace>
            <ElPopover
              placement="top-start"
              title="Title"
              :width="200"
              trigger="hover"
              content="this is content, this is content, this is content"
            >
              <template #reference>
                <ElButton class="m-2">Hover to activate</ElButton>
              </template>
            </ElPopover>
          </ElSpace>
          <ElSpace>
            <ElTooltip content="Top center" placement="top">
              <ElButton>Dark</ElButton>
            </ElTooltip>
            <ElTooltip
              content="Bottom center"
              placement="bottom"
              effect="light"
            >
              <ElButton>Light</ElButton>
            </ElTooltip>
          </ElSpace>
        </div>
      </ElCard>
      <!--  -->
      <ElCard class="mb-4">
        <template #header> Message </template>
        <ElSpace>
          <ElButton type="info" @click="info"> 信息 </ElButton>
          <ElButton type="danger" @click="error"> 错误 </ElButton>
          <ElButton type="warning" @click="warning"> 警告 </ElButton>
          <ElButton type="success" @click="success"> 成功 </ElButton>
        </ElSpace>
      </ElCard>
      <ElCard class="mb-4 w-80">
        <template #header> Notification </template>
        <ElSpace>
          <ElButton type="info" @click="notify('info')"> 信息 </ElButton>
          <ElButton type="danger" @click="notify('error')"> 错误 </ElButton>
          <ElButton type="warning" @click="notify('warning')"> 警告 </ElButton>
          <ElButton type="success" @click="notify('success')"> 成功 </ElButton>
        </ElSpace>
      </ElCard>
      <ElCard class="mb-4 w-80">
        <template #header> Popconfirm </template>
        <ElSpace>
          <ElPopconfirm title="Are you sure to delete this?">
            <template #reference>
              <ElButton>Delete</ElButton>
            </template>
          </ElPopconfirm>
        </ElSpace>
      </ElCard>
      <ElCard class="mb-4 w-auto">
        <template #header> Segmented </template>
        <ElSegmented v-model="segmentedValue" :options="segmentedOptions" />
      </ElCard>

      <ElCard class="mb-4 w-80">
        <template #header> V-Loading </template>
        <div class="flex size-72 items-center justify-center" v-loading="true">
          一些演示的内容
        </div>
      </ElCard>

      <ElCard class="mb-4 w-auto">
        <template #header> Descriptions </template>
        <div class="flex flex-col gap-4">
          <ElSpace>
            <ElDescriptions class="margin-top" :column="1" border>
              <ElDescriptionsItem label="UserName">
                kooriookami
              </ElDescriptionsItem>
              <ElDescriptionsItem label="Telephone">
                18100000000
              </ElDescriptionsItem>
              <ElDescriptionsItem label="Place"> Suzhou </ElDescriptionsItem>
              <ElDescriptionsItem label="Remarks">
                <ElTag size="small">School</ElTag>
              </ElDescriptionsItem>
              <ElDescriptionsItem label="Address">
                No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu
                Province
              </ElDescriptionsItem>
            </ElDescriptions>
          </ElSpace>
        </div>
      </ElCard>

      <ElCard class="mb-4 w-auto">
        <template #header> Pagination </template>
        <div class="flex flex-col gap-4">
          <ElSpace>
            <ElPagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[100, 200, 300, 400]"
              :background="false"
              layout="total, sizes, prev, pager, next, jumper"
              :total="400"
            />
          </ElSpace>
          <ElSpace>
            <ElPagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[100, 200, 300, 400]"
              :background="true"
              layout="total, sizes, prev, pager, next, jumper"
              :total="400"
            />
          </ElSpace>
        </div>
      </ElCard>

      <ElCard class="mb-4 w-auto">
        <template #header> Tabs </template>
        <div class="mb-4 flex gap-4">
          <ElTabs v-model="tabPosition" type="card">
            <ElTabPane label="top" name="top">top</ElTabPane>
            <ElTabPane label="right" name="right">right</ElTabPane>
          </ElTabs>
          <ElTabs v-model="tabPosition" type="border-card">
            <ElTabPane label="top" name="top">top</ElTabPane>
            <ElTabPane label="right" name="right">right</ElTabPane>
          </ElTabs>
        </div>
        <div class="flex gap-4">
          <ElTabs
            v-model="tabPosition"
            tab-position="left"
            type="card"
            class="h-full"
          >
            <ElTabPane label="top" name="top">top</ElTabPane>
            <ElTabPane label="right" name="right">right</ElTabPane>
          </ElTabs>
          <ElTabs
            v-model="tabPosition"
            tab-position="left"
            type="border-card"
            class="h-full"
          >
            <ElTabPane label="top" name="top">top</ElTabPane>
            <ElTabPane label="right" name="right">right</ElTabPane>
          </ElTabs>
        </div>
      </ElCard>
    </div>
  </Page>
</template>
