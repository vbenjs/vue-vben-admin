<script lang="ts" setup>
import { computed, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import {
  ElAlert,
  ElButton,
  ElCard,
  ElCheckTag,
  ElDatePicker,
  ElDescriptions,
  ElDescriptionsItem,
  ElDialog,
  ElInput,
  ElInputNumber,
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
  ElUpload,
} from 'element-plus';

// 类型定义
type NotificationType = 'error' | 'info' | 'success' | 'warning';
type ButtonType = 'danger' | 'info' | 'primary' | 'success' | 'warning';
type TagType = 'danger' | 'info' | 'primary' | 'success' | 'warning';

// 常量定义
const BUTTON_TYPES: ButtonType[] = [
  'primary',
  'success',
  'info',
  'warning',
  'danger',
];
const TAG_TYPES: TagType[] = [
  'primary',
  'success',
  'info',
  'warning',
  'danger',
];
const SEGMENTED_OPTIONS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const PAGE_SIZES = [100, 200, 300, 400];

// 消息配置
const MESSAGE_CONFIG = {
  info: 'How many roads must a man walk down',
  warning: 'How many roads must a man walk down',
  success: 'Cause you walked hand in hand With another man in my place',
  error: {
    duration: 2500,
    message: 'Once upon a time you dressed so fine',
  },
} as const;

// 响应式数据
const segmentedValue = ref('Mon');
const type1 = ref<string>('');
const date = ref<string>('');
const currentPage = ref(4);
const pageSize = ref(100);
const checked = ref(true);
const tabPosition = ref('top');
const inputValue = ref('');
const inputNumberValue = ref(1);
const dialogVisible = ref(false);

// 计算属性 - 优化性能
const selectOptions = computed(() =>
  Array.from({ length: 1000 }).map((_, idx) => ({
    value: `Option ${idx + 1}`,
    label: `${idx % 10}${idx}`,
  })),
);

const tableData = computed(() => [
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
]);

// 优化的消息函数
const showMessage = {
  info: () => ElMessage.info(MESSAGE_CONFIG.info),
  warning: () => ElMessage.warning(MESSAGE_CONFIG.warning),
  success: () => ElMessage.success(MESSAGE_CONFIG.success),
  error: () => ElMessage.error(MESSAGE_CONFIG.error),
};

// 优化的通知函数
const showNotification = (type: NotificationType) => {
  ElNotification({
    duration: 2500,
    message: '说点啥呢',
    type,
  });
};

// 消息框函数
const showMessageBox = () => {
  ElMessageBox.alert('This is a message', 'Title', {
    confirmButtonText: 'OK',
    callback: (action: any) => {
      ElMessage({
        type: 'info',
        message: `action: ${action}`,
      });
    },
  });
};

// 切换选中状态
const toggleChecked = (v: boolean) => {
  checked.value = v;
};

const elAlertList: ('error' | 'info' | 'success' | 'warning')[] = [
  'success',
  'info',
  'warning',
  'error',
];
</script>

<template>
  <Page
    description="支持多语言，主题功能集成切换等"
    title="Element Plus组件使用演示"
  >
    <div class="flex flex-wrap gap-4">
      <!-- Button 按钮组件演示 -->
      <ElCard class="mb-4 w-auto min-w-[200px]">
        <template #header>按钮</template>
        <div class="flex flex-col gap-4">
          <!-- 基础按钮 -->
          <div class="flex flex-wrap gap-2">
            <ElButton>Default</ElButton>
            <ElButton v-for="type in BUTTON_TYPES" :key="type" :type="type">
              {{ type.charAt(0).toUpperCase() + type.slice(1) }}
            </ElButton>
          </div>

          <!-- 朴素按钮 -->
          <div class="flex flex-wrap gap-2">
            <ElButton plain>Plain</ElButton>
            <ElButton
              v-for="type in BUTTON_TYPES"
              :key="`plain-${type}`"
              :type="type"
              plain
            >
              {{ type.charAt(0).toUpperCase() + type.slice(1) }}
            </ElButton>
          </div>

          <!-- 圆角按钮 -->
          <div class="flex flex-wrap gap-2">
            <ElButton round>Round</ElButton>
            <ElButton
              v-for="type in BUTTON_TYPES"
              :key="`round-${type}`"
              :type="type"
              round
            >
              {{ type.charAt(0).toUpperCase() + type.slice(1) }}
            </ElButton>
          </div>

          <!-- 圆形按钮 -->
          <div class="flex flex-wrap gap-2">
            <ElButton :icon="Plus" circle />
            <ElButton
              v-for="type in BUTTON_TYPES"
              :key="`circle-${type}`"
              :type="type"
              :icon="Plus"
              circle
            />
          </div>

          <!-- 禁用按钮 -->
          <div class="flex flex-wrap gap-2">
            <ElButton disabled>Default</ElButton>
            <ElButton
              v-for="type in BUTTON_TYPES"
              :key="`disabled-${type}`"
              :type="type"
              disabled
            >
              {{ type.charAt(0).toUpperCase() + type.slice(1) }}
            </ElButton>
          </div>

          <!-- 禁用朴素按钮 -->
          <div class="flex flex-wrap gap-2">
            <ElButton plain disabled>Plain</ElButton>
            <ElButton
              v-for="type in BUTTON_TYPES"
              :key="`plain-disabled-${type}`"
              :type="type"
              plain
              disabled
            >
              {{ type.charAt(0).toUpperCase() + type.slice(1) }}
            </ElButton>
          </div>

          <!-- 链接按钮 -->
          <div class="flex flex-wrap gap-2">
            <ElButton link>Plain</ElButton>
            <ElButton
              v-for="type in BUTTON_TYPES"
              :key="`link-${type}`"
              :type="type"
              link
            >
              {{ type.charAt(0).toUpperCase() + type.slice(1) }}
            </ElButton>
          </div>

          <!-- 禁用链接按钮 -->
          <div class="flex flex-wrap gap-2">
            <ElButton link disabled>Plain</ElButton>
            <ElButton
              v-for="type in BUTTON_TYPES"
              :key="`link-disabled-${type}`"
              :type="type"
              link
              disabled
            >
              {{ type.charAt(0).toUpperCase() + type.slice(1) }}
            </ElButton>
          </div>

          <!-- 文字按钮 -->
          <div class="flex flex-wrap gap-2">
            <ElButton text>Plain</ElButton>
            <ElButton
              v-for="type in BUTTON_TYPES"
              :key="`text-${type}`"
              :type="type"
              text
            >
              {{ type.charAt(0).toUpperCase() + type.slice(1) }}
            </ElButton>
          </div>

          <!-- 禁用文字按钮 -->
          <div class="flex flex-wrap gap-2">
            <ElButton text disabled>Plain</ElButton>
            <ElButton
              v-for="type in BUTTON_TYPES"
              :key="`text-disabled-${type}`"
              :type="type"
              text
              disabled
            >
              {{ type.charAt(0).toUpperCase() + type.slice(1) }}
            </ElButton>
          </div>
        </div>
      </ElCard>

      <!-- Tag 标签组件演示 -->
      <ElCard class="mb-4 w-auto min-w-[200px]">
        <template #header>标签</template>
        <div class="flex flex-col gap-4">
          <!-- 基础标签 -->
          <ElSpace wrap>
            <ElTag
              v-for="(type, index) in TAG_TYPES"
              :key="`tag-${type}`"
              :type="type"
            >
              Tag {{ index + 1 }}
            </ElTag>
          </ElSpace>

          <!-- 深色标签 -->
          <ElSpace wrap>
            <ElTag
              v-for="(type, index) in TAG_TYPES"
              :key="`dark-${type}`"
              effect="dark"
              :type="type"
            >
              Tag {{ index + 1 }}
            </ElTag>
          </ElSpace>

          <!-- 朴素标签 -->
          <ElSpace wrap>
            <ElTag
              v-for="(type, index) in TAG_TYPES"
              :key="`plain-${type}`"
              effect="plain"
              :type="type"
            >
              Tag {{ index + 1 }}
            </ElTag>
          </ElSpace>

          <!-- 圆形标签 -->
          <ElSpace wrap>
            <ElTag
              v-for="(type, index) in TAG_TYPES"
              :key="`round-${type}`"
              round
              :type="type"
            >
              Tag {{ index + 1 }}
            </ElTag>
          </ElSpace>

          <!-- 圆形深色标签 -->
          <ElSpace wrap>
            <ElTag
              v-for="(type, index) in TAG_TYPES"
              :key="`round-dark-${type}`"
              round
              effect="dark"
              :type="type"
            >
              Tag {{ index + 1 }}
            </ElTag>
          </ElSpace>

          <!-- 圆形朴素标签 -->
          <ElSpace wrap>
            <ElTag
              v-for="(type, index) in TAG_TYPES"
              :key="`round-plain-${type}`"
              round
              effect="plain"
              :type="type"
            >
              Tag {{ index + 1 }}
            </ElTag>
          </ElSpace>

          <!-- 可选择标签 -->
          <ElSpace wrap>
            <ElCheckTag checked>Checked</ElCheckTag>
            <ElCheckTag :checked="checked" @change="toggleChecked">
              Toggle me
            </ElCheckTag>
            <ElCheckTag disabled>Disabled</ElCheckTag>
          </ElSpace>

          <!-- 可选择彩色标签 -->
          <ElSpace wrap>
            <ElCheckTag
              v-for="(type, index) in TAG_TYPES"
              :key="`check-${type}`"
              :checked="checked"
              :type="type"
              @change="toggleChecked"
            >
              Tag {{ index + 1 }}
            </ElCheckTag>
            <ElCheckTag
              :checked="checked"
              disabled
              type="success"
              @change="toggleChecked"
            >
              Disabled
            </ElCheckTag>
          </ElSpace>
        </div>
      </ElCard>

      <!-- Table 表格组件演示 -->
      <ElCard class="mb-4 w-auto min-w-[200px]">
        <template #header>表格</template>
        <div class="flex flex-col gap-4">
          <div>
            <div class="mb-2 text-sm font-medium text-gray-600">无边框</div>
            <ElTable
              :data="tableData"
              style="width: 200px"
              show-overflow-tooltip
            >
              <ElTableColumn prop="date" label="Date" width="120" />
              <ElTableColumn prop="name" label="Name" width="80" />
              <ElTableColumn prop="address" label="Address" fixed="right" />
            </ElTable>
          </div>

          <div>
            <div class="mb-2 text-sm font-medium text-gray-600">有边框</div>
            <ElTable
              :data="tableData"
              style="width: 200px"
              show-overflow-tooltip
              border
            >
              <ElTableColumn prop="date" label="Date" width="120" />
              <ElTableColumn prop="name" label="Name" width="80" />
              <ElTableColumn prop="address" label="Address" fixed="right" />
            </ElTable>
          </div>

          <div>
            <div class="mb-2 text-sm font-medium text-gray-600">无表头</div>
            <ElTable
              :data="tableData"
              style="width: 200px"
              show-overflow-tooltip
              :show-header="false"
              border
            >
              <ElTableColumn prop="date" label="Date" width="120" />
              <ElTableColumn prop="name" label="Name" width="80" />
              <ElTableColumn prop="address" label="Address" fixed="right" />
            </ElTable>
          </div>
        </div>
      </ElCard>

      <!-- Popper 弹出组件演示 -->
      <ElCard class="mb-4 w-auto min-w-[200px]">
        <template #header>弹出组件</template>
        <div class="grid grid-cols-2 gap-4">
          <ElSpace direction="vertical">
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

          <ElSpace direction="vertical">
            <ElSelectV2
              v-model="type1"
              :options="selectOptions"
              placeholder="ElSelectV2"
              style="width: 240px"
            />
          </ElSpace>

          <ElSpace direction="vertical">
            <ElTimePicker v-model="date" placeholder="ElTimePicker" />
          </ElSpace>

          <ElSpace direction="vertical">
            <ElTimeSelect
              v-model="date"
              start="08:30"
              step="00:15"
              end="18:30"
              placeholder="Select time"
            />
          </ElSpace>

          <ElSpace direction="vertical">
            <ElTreeSelect
              v-model="type1"
              :data="selectOptions"
              :render-after-expand="false"
              style="width: 240px"
              placeholder="ElTreeSelect"
            />
          </ElSpace>

          <ElSpace direction="vertical">
            <ElPopconfirm title="Are you sure to delete this?">
              <template #reference>
                <ElButton>Delete</ElButton>
              </template>
            </ElPopconfirm>
            <ElButton @click="showMessageBox">Message Box</ElButton>
          </ElSpace>

          <ElSpace direction="vertical">
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

          <ElSpace direction="vertical">
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

      <!-- Message 消息提示演示 -->
      <ElCard class="mb-4">
        <template #header>消息提示</template>
        <ElSpace wrap>
          <ElButton type="info" @click="showMessage.info">信息</ElButton>
          <ElButton type="danger" @click="showMessage.error">错误</ElButton>
          <ElButton type="warning" @click="showMessage.warning">警告</ElButton>
          <ElButton type="success" @click="showMessage.success">成功</ElButton>
        </ElSpace>
      </ElCard>

      <!-- Notification 通知演示 -->
      <ElCard class="mb-4 w-80">
        <template #header>通知</template>
        <ElSpace wrap>
          <ElButton
            v-for="type in [
              'info',
              'error',
              'warning',
              'success',
            ] as NotificationType[]"
            :key="`notify-${type}`"
            :type="type === 'error' ? 'danger' : type"
            @click="showNotification(type)"
          >
            {{
              type === 'info'
                ? '信息'
                : type === 'error'
                  ? '错误'
                  : type === 'warning'
                    ? '警告'
                    : '成功'
            }}
          </ElButton>
        </ElSpace>
      </ElCard>

      <!-- Popconfirm 气泡确认框演示 -->
      <ElCard class="mb-4 w-80">
        <template #header>气泡确认框</template>
        <ElSpace>
          <ElPopconfirm title="Are you sure to delete this?">
            <template #reference>
              <ElButton>Delete</ElButton>
            </template>
          </ElPopconfirm>
        </ElSpace>
      </ElCard>

      <!-- Segmented 分段控制器演示 -->
      <ElCard class="mb-4 w-auto min-w-[200px]">
        <template #header>分段控制器</template>
        <ElSegmented v-model="segmentedValue" :options="SEGMENTED_OPTIONS" />
      </ElCard>

      <!-- Loading 加载演示 -->
      <ElCard class="mb-4 w-80">
        <template #header>加载中</template>
        <div class="flex size-72 items-center justify-center" v-loading="true">
          一些演示的内容
        </div>
      </ElCard>

      <!-- Descriptions 描述列表演示 -->
      <ElCard class="mb-4 w-auto min-w-[200px]">
        <template #header>描述列表</template>
        <ElDescriptions class="margin-top" :column="1" border>
          <ElDescriptionsItem label="UserName">
            kooriookami
          </ElDescriptionsItem>
          <ElDescriptionsItem label="Telephone">
            18100000000
          </ElDescriptionsItem>
          <ElDescriptionsItem label="Place">Suzhou</ElDescriptionsItem>
          <ElDescriptionsItem label="Remarks">
            <ElTag size="small">School</ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="Address">
            No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
          </ElDescriptionsItem>
        </ElDescriptions>
      </ElCard>

      <!-- Pagination 分页演示 -->
      <ElCard class="mb-4 w-auto min-w-[200px]">
        <template #header>分页</template>
        <div class="flex flex-col gap-4">
          <div>
            <div class="mb-2 text-sm font-medium text-gray-600">无背景</div>
            <ElPagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="PAGE_SIZES"
              :background="false"
              layout="total, sizes, prev, pager, next, jumper"
              :total="400"
            />
          </div>
          <div>
            <div class="mb-2 text-sm font-medium text-gray-600">有背景</div>
            <ElPagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="PAGE_SIZES"
              :background="true"
              layout="total, sizes, prev, pager, next, jumper"
              :total="400"
            />
          </div>
        </div>
      </ElCard>

      <!-- Tabs 标签页演示 -->
      <ElCard class="mb-4 w-auto min-w-[200px]">
        <template #header>标签页</template>
        <div class="mb-4 flex gap-4">
          <ElTabs v-model="tabPosition" type="card">
            <ElTabPane label="top" name="top">顶部标签页</ElTabPane>
            <ElTabPane label="right" name="right">右侧标签页</ElTabPane>
          </ElTabs>
          <ElTabs v-model="tabPosition" type="border-card">
            <ElTabPane label="top" name="top">顶部边框标签页</ElTabPane>
            <ElTabPane label="right" name="right">右侧边框标签页</ElTabPane>
          </ElTabs>
        </div>
        <div class="flex gap-4">
          <ElTabs
            v-model="tabPosition"
            tab-position="left"
            type="card"
            class="h-full"
          >
            <ElTabPane label="top" name="top">左侧标签页</ElTabPane>
            <ElTabPane label="right" name="right">右侧标签页</ElTabPane>
          </ElTabs>
          <ElTabs
            v-model="tabPosition"
            tab-position="left"
            type="border-card"
            class="h-full"
          >
            <ElTabPane label="top" name="top">左侧边框标签页</ElTabPane>
            <ElTabPane label="right" name="right">右侧边框标签页</ElTabPane>
          </ElTabs>
        </div>
      </ElCard>

      <!-- Input 输入组件演示 -->
      <ElCard class="mb-4 w-auto min-w-[200px]">
        <template #header>输入框</template>
        <div class="flex flex-col gap-4">
          <div class="grid grid-cols-2 gap-4">
            <ElInput v-model="inputValue" placeholder="基础输入框" />
            <ElInput v-model="inputValue" placeholder="禁用状态" disabled />
            <ElInput v-model="inputValue" placeholder="可清空" clearable />
            <ElInput
              v-model="inputValue"
              placeholder="密码框"
              type="password"
              show-password
            />
            <ElInputNumber v-model="inputNumberValue" :min="1" :max="10" />
            <ElInputNumber
              v-model="inputNumberValue"
              :min="1"
              :max="10"
              disabled
            />
          </div>
        </div>
      </ElCard>

      <!-- DatePicker 日期选择器演示 -->
      <ElCard class="mb-4 w-auto min-w-[200px]">
        <template #header>日期选择器</template>
        <div class="grid grid-cols-1 gap-4">
          <ElDatePicker v-model="date" type="date" placeholder="选择日期" />
          <ElDatePicker
            v-model="date"
            type="datetime"
            placeholder="选择日期时间"
          />
          <ElDatePicker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <ElDatePicker
            v-model="date"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </div>
      </ElCard>

      <!-- Alert/Badge 警告和徽章演示 -->
      <ElCard class="mb-4 w-auto min-w-[200px]">
        <template #header>警告提示</template>
        <div>
          <div class="mb-2 text-sm font-medium text-gray-600">警告</div>
          <div class="flex flex-col gap-2">
            <ElAlert
              v-for="type in elAlertList"
              :key="`alert-${type}`"
              :title="`${type} alert`"
              :type="type"
              show-icon
            />
          </div>
        </div>
      </ElCard>

      <!-- Avatar/Upload 头像和上传演示 -->
      <ElCard class="mb-4 w-auto min-w-[200px]">
        <template #header>文件上传</template>
        <div>
          <div class="mb-2 text-sm font-medium text-gray-600">上传</div>
          <ElUpload
            class="upload-demo"
            drag
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            multiple
          >
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </ElUpload>
        </div>
      </ElCard>

      <!-- Dialog 对话框演示 -->
      <ElCard class="mb-4 w-auto min-w-[200px]">
        <template #header>对话框</template>
        <ElButton type="primary" @click="dialogVisible = true">
          打开对话框
        </ElButton>
        <ElDialog v-model="dialogVisible" title="提示" width="500">
          <span>这是一段信息</span>
          <template #footer>
            <div class="dialog-footer">
              <ElButton @click="dialogVisible = false">取消</ElButton>
              <ElButton type="primary" @click="dialogVisible = false">
                确定
              </ElButton>
            </div>
          </template>
        </ElDialog>
      </ElCard>
    </div>
  </Page>
</template>
