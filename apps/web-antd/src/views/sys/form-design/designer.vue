<script setup lang="ts">
// @ts-nocheck
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

// @ts-ignore
import { Icon } from '@iconify/vue';
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Switch,
} from 'ant-design-vue';

import { sysFormDesignApi } from '#/api/core/sys-manage';

const route = useRoute();
const router = useRouter();
const formId = ref(
  (route.query.id as string) || (route.query.formId as string),
);
const formInfo = ref<any>({});
const loading = ref(false);
const submitting = ref(false);

/* ==== 左侧：可用组件库 ==== */
const componentList = [
  { type: 'Input', label: '单行文本', icon: 'lucide:type' },
  { type: 'Textarea', label: '多行文本', icon: 'lucide:align-left' },
  { type: 'InputNumber', label: '数字输入框', icon: 'lucide:hash' },
  { type: 'Select', label: '下拉选择', icon: 'lucide:chevron-down-square' },
  { type: 'Radio', label: '单选框组', icon: 'lucide:circle-dot' },
  { type: 'Checkbox', label: '多选框组', icon: 'lucide:check-square' },
  { type: 'DatePicker', label: '日期选择', icon: 'lucide:calendar' },
  { type: 'TimePicker', label: '时间选择', icon: 'lucide:clock' },
  { type: 'Switch', label: '开关', icon: 'lucide:toggle-right' },
  { type: 'Upload', label: '文件上传', icon: 'lucide:upload-cloud' },
];

/* ==== 中间：已添加的字段数组 ==== */
interface FieldItem {
  id: string;
  type: string;
  label: string;
  fieldName: string;
  placeholder: string;
  required: boolean;
  gridSpan: number;
}
const fieldList = ref<FieldItem[]>([]);
const activeFieldId = ref<null | string>(null);

/* ==== 点击添加组件 ==== */
const handleAddComponent = (comp: any) => {
  const newField: FieldItem = {
    id: `field_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    type: comp.type,
    label: comp.label,
    fieldName: `custom_${comp.type.toLowerCase()}_${Date.now() % 10_000}`,
    placeholder: `请输入${comp.label}`,
    required: false,
    gridSpan: 24,
  };
  fieldList.value.push(newField);
  activeFieldId.value = newField.id;
};

const handleSelectField = (id: string) => {
  activeFieldId.value = id;
};

const handleRemoveField = (index: number) => {
  fieldList.value.splice(index, 1);
  if (fieldList.value.length > 0) {
    const fallbackField = fieldList.value[Math.max(0, index - 1)];
    activeFieldId.value = fallbackField ? fallbackField.id : null;
  } else {
    activeFieldId.value = null;
  }
};

const handleClear = () => {
  fieldList.value = [];
  activeFieldId.value = null;
};

/* ==== 数据加载与保存 ==== */
const fetchForm = async () => {
  if (!formId.value) return;
  loading.value = true;
  try {
    const res = await sysFormDesignApi.getList({ formId: formId.value });
    if (res?.items?.length) {
      formInfo.value = res.items[0];
      if (formInfo.value.formContent) {
        fieldList.value = JSON.parse(formInfo.value.formContent);
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const saveForm = async () => {
  try {
    submitting.value = true;
    const updateData = {
      ...formInfo.value,
      formContent: JSON.stringify(fieldList.value),
    };
    await sysFormDesignApi.update(updateData.formId, updateData);
    message.success('保存成功');
    router.back();
  } catch (error) {
    console.error(error);
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  fetchForm();
});
</script>

<template>
  <Page>
    <div class="design-wrapper flex h-full flex-col bg-gray-50 p-4">
      <!-- 纯手写的三栏布局头部 -->
      <div
        class="z-10 flex items-center justify-between rounded-t border-b bg-white px-4 py-3 shadow-sm"
      >
        <div class="flex items-center gap-2 text-lg font-bold">
          <Icon icon="lucide:layout-template" class="text-xl text-primary" />
          {{ formInfo.formName || '未命名表单' }}
        </div>
        <div class="flex gap-3">
          <Button @click="handleClear" danger ghost size="small">
            清空画布
          </Button>
          <Button @click="router.back()" size="small">返回</Button>
          <Button
            type="primary"
            :loading="submitting"
            @click="saveForm"
            size="small"
          >
            保存发布
          </Button>
        </div>
      </div>

      <!-- 三栏主体 -->
      <div class="flex flex-1 overflow-hidden rounded-b shadow-sm">
        <!-- 左侧：组件库 -->
        <div class="flex w-64 flex-col border-r bg-white">
          <div class="border-b bg-gray-50/50 p-3 font-bold text-gray-700">
            基础组件库
          </div>
          <div class="flex-1 overflow-y-auto p-3">
            <div class="grid grid-cols-2 gap-2">
              <div
                v-for="comp in componentList"
                :key="comp.type"
                class="flex cursor-pointer flex-col items-center justify-center rounded border bg-gray-50/30 p-2 transition-colors hover:border-primary hover:text-primary"
                @click="handleAddComponent(comp)"
              >
                <Icon
                  :icon="comp.icon"
                  class="mb-1 text-xl text-gray-500 group-hover:text-primary"
                />
                <span class="text-xs text-gray-600">{{ comp.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 中间：画布 -->
        <div class="relative flex flex-1 flex-col overflow-hidden bg-gray-100">
          <div class="flex-1 overflow-y-auto p-4">
            <div class="min-h-full rounded border bg-white p-6 shadow-sm">
              <div
                v-if="fieldList.length === 0"
                class="flex h-64 flex-col items-center justify-center text-gray-400"
              >
                <Icon icon="lucide:mouse-pointer-click" class="mb-2 text-4xl" />
                <p>点击左侧组件添加到画布</p>
              </div>

              <Form
                layout="horizontal"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 18 }"
              >
                <Row :gutter="16">
                  <Col
                    v-for="(field, index) in fieldList"
                    :key="field.id"
                    :span="field.gridSpan || 24"
                  >
                    <div
                      class="group relative mb-2 cursor-pointer rounded border-2 border-dashed p-4 transition-all"
                      :class="
                        activeFieldId === field.id
                          ? 'border-primary bg-primary/5'
                          : 'border-transparent hover:border-blue-300 hover:bg-gray-50'
                      "
                      @click.stop="handleSelectField(field.id)"
                    >
                      <!-- 操作按钮 (悬浮显示) -->
                      <div
                        class="absolute right-0 top-0 z-10 -translate-y-1/2 translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100"
                        :class="{ 'opacity-100': activeFieldId === field.id }"
                      >
                        <Button
                          danger
                          shape="circle"
                          size="small"
                          class="shadow-md"
                          @click.stop="handleRemoveField(index)"
                        >
                          <template #icon>
                            <Icon icon="lucide:trash-2" />
                          </template>
                        </Button>
                      </div>

                      <!-- 渲染表单项预览 -->
                      <Form.Item
                        :label="field.label"
                        :required="field.required"
                        class="pointer-events-none mb-0"
                      >
                        <Input
                          v-if="field.type === 'Input'"
                          :placeholder="field.placeholder"
                        />
                        <Input.TextArea
                          v-else-if="field.type === 'Textarea'"
                          :placeholder="field.placeholder"
                          :rows="3"
                        />
                        <Input
                          v-else-if="field.type === 'InputNumber'"
                          :placeholder="field.placeholder"
                          type="number"
                        />
                        <Select
                          v-else-if="field.type === 'Select'"
                          :placeholder="field.placeholder"
                          :options="[]"
                        />
                        <Switch v-else-if="field.type === 'Switch'" />
                        <div
                          v-else
                          class="inline-block rounded border bg-gray-100 px-3 py-1 text-sm italic text-gray-400"
                        >
                          [{{ field.label }} 控件占位]
                        </div>
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </div>

        <!-- 右侧：属性配置 -->
        <div class="flex w-80 flex-col border-l bg-white">
          <div class="border-b bg-gray-50/50 p-3 font-bold text-gray-700">
            属性配置
          </div>
          <div class="flex-1 overflow-y-auto p-4">
            <template v-for="field in fieldList" :key="field.id">
              <Form
                v-show="activeFieldId === field.id"
                layout="vertical"
                class="w-full"
              >
                <Form.Item label="当前组件">
                  <Input
                    :value="field.type"
                    disabled
                    class="bg-gray-100 font-mono text-gray-500"
                  />
                </Form.Item>
                <Form.Item label="字段标题">
                  <Input v-model:value="field.label" />
                </Form.Item>
                <Form.Item label="字段标识 (绑定键值)">
                  <Input
                    v-model:value="field.fieldName"
                    addon-before="custom_"
                  />
                </Form.Item>
                <Form.Item label="占位提示文字">
                  <Input v-model:value="field.placeholder" />
                </Form.Item>
                <Form.Item label="是否必填">
                  <Switch v-model:checked="field.required" />
                </Form.Item>
                <Form.Item label="占用栅格 (1-24)">
                  <Input
                    type="number"
                    v-model:value="field.gridSpan"
                    :min="1"
                    :max="24"
                  />
                </Form.Item>
              </Form>
            </template>

            <div v-if="!activeFieldId" class="mt-20 text-center text-gray-400">
              请在画布中选择一个组件
            </div>
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>

<style scoped>
.design-wrapper {
  height: calc(100vh - 120px);
}
</style>
