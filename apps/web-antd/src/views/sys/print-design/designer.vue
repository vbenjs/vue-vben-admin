<script setup lang="ts">
// @ts-nocheck
import { onMounted, ref } from 'vue';
// Initialize Hiprint manually for Vben Admin environment
// Note: real implementation will require vue-plugin-hiprint to be fully compliant with Vite
import { defaultElementTypeProvider, hiprint } from 'vue-plugin-hiprint';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

// @ts-ignore
import { Icon } from '@iconify/vue';
import { Button, message } from 'ant-design-vue';

import { sysPrintDesignApi } from '#/api/core/sys-manage';

const route = useRoute();
const router = useRouter();

const printId = ref(route.query.id as string);
const templateData = ref<any>({});
const loading = ref(false);

const hiprintTemplate = ref<any>(null);

const initHiprint = () => {
  // Initialize hiprint provider
  hiprint.init({
    // eslint-disable-next-line new-cap
    providers: [new defaultElementTypeProvider()],
  });

  // Create Hiprint Template instance
  hiprintTemplate.value = new hiprint.PrintTemplate({
    template: templateData.value.printContent
      ? JSON.parse(templateData.value.printContent)
      : {},
  });

  // Link UI container IDs
  hiprintTemplate.value.design('#hiprint-printTemplate');

  // @ts-ignore
  hiprint.PrintElementTypeManager.buildByHtml(
    (window as any).$ ? (window as any).$('.ep-draggable-item') : null,
  );
};

const fetchTemplate = async () => {
  if (!printId.value) {
    message.error('未提供模板ID');
    return;
  }
  loading.value = true;
  try {
    const res = await sysPrintDesignApi.getList({ printId: printId.value });
    if (res?.items?.length) {
      templateData.value = res.items[0];
      setTimeout(() => initHiprint(), 50); // slight delay to ensure DOM is ready
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const saveTemplate = async () => {
  if (!hiprintTemplate.value) return;
  const json = hiprintTemplate.value.getJson();
  try {
    loading.value = true;
    const updateData = {
      ...templateData.value,
      printContent: JSON.stringify(json),
    };
    await sysPrintDesignApi.update(updateData.printId, updateData);
    message.success('保存成功');
    router.back();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const previewTemplate = () => {
  if (!hiprintTemplate.value) return;
  hiprintTemplate.value.getHtml([{}]); // Dummy data preview
  message.info('预览将在新标签页打开或在本地生成');
};

onMounted(() => {
  fetchTemplate();
});
</script>

<template>
  <Page>
    <div class="design-wrapper flex h-full flex-col bg-gray-50 p-4">
      <!-- Top Actions -->
      <div
        class="z-10 flex items-center justify-between rounded-t border-b bg-white px-4 py-3 shadow-sm"
      >
        <div class="flex items-center gap-4 text-lg font-bold">
          <Icon icon="lucide:printer" class="text-xl text-primary" />
          {{ templateData.printName || '加载中...' }}
          <span class="text-xs font-normal text-gray-400">
            （编号: {{ templateData.printCode || '-' }}）
          </span>
        </div>
        <div class="flex gap-3">
          <Button @click="router.back()" size="small">返回</Button>
          <Button @click="previewTemplate" size="small">预览模板</Button>
          <Button
            type="primary"
            :loading="loading"
            @click="saveTemplate"
            size="small"
          >
            保存发布
          </Button>
        </div>
      </div>

      <!-- Designer Core Layout -->
      <div
        class="flex flex-1 overflow-hidden rounded-b border-x border-b bg-white shadow-sm"
      >
        <!-- Left: Elements provider -->
        <div class="flex w-64 flex-col border-r bg-gray-50/50">
          <div class="border-b bg-white p-3 font-bold text-gray-700">
            可打印组件
          </div>
          <div class="flex-1 overflow-y-auto p-3">
            <div class="grid grid-cols-2 gap-2 text-center text-sm">
              <!-- Draggable items hooked by hiprint -->
              <a
                class="ep-draggable-item rounded border bg-white p-2 transition hover:border-primary hover:text-primary"
                tid="defaultModule.text"
                style="display: block"
              >
                <Icon
                  icon="lucide:type"
                  class="mx-auto mb-1 text-xl text-gray-500"
                />
                普通文本
              </a>
              <a
                class="ep-draggable-item rounded border bg-white p-2 transition hover:border-primary hover:text-primary"
                tid="defaultModule.image"
                style="display: block"
              >
                <Icon
                  icon="lucide:image"
                  class="mx-auto mb-1 text-xl text-gray-500"
                />
                图片
              </a>
              <a
                class="ep-draggable-item rounded border bg-white p-2 transition hover:border-primary hover:text-primary"
                tid="defaultModule.longText"
                style="display: block"
              >
                <Icon
                  icon="lucide:align-left"
                  class="mx-auto mb-1 text-xl text-gray-500"
                />
                长文本
              </a>
              <a
                class="ep-draggable-item rounded border bg-white p-2 transition hover:border-primary hover:text-primary"
                tid="defaultModule.table"
                style="display: block"
              >
                <Icon
                  icon="lucide:table"
                  class="mx-auto mb-1 text-xl text-gray-500"
                />
                表格
              </a>
              <a
                class="ep-draggable-item rounded border bg-white p-2 transition hover:border-primary hover:text-primary"
                tid="defaultModule.barcode"
                style="display: block"
              >
                <Icon
                  icon="lucide:barcode"
                  class="mx-auto mb-1 text-xl text-gray-500"
                />
                条形码
              </a>
              <a
                class="ep-draggable-item rounded border bg-white p-2 transition hover:border-primary hover:text-primary"
                tid="defaultModule.qrcode"
                style="display: block"
              >
                <Icon
                  icon="lucide:qr-code"
                  class="mx-auto mb-1 text-xl text-gray-500"
                />
                二维码
              </a>
              <a
                class="ep-draggable-item rounded border bg-white p-2 transition hover:border-primary hover:text-primary"
                tid="defaultModule.hline"
                style="display: block"
              >
                <Icon
                  icon="lucide:minus"
                  class="mx-auto mb-1 text-xl text-gray-500"
                />
                横线
              </a>
              <a
                class="ep-draggable-item rounded border bg-white p-2 transition hover:border-primary hover:text-primary"
                tid="defaultModule.vline"
                style="display: block"
              >
                <Icon
                  icon="lucide:minus"
                  class="mx-auto mb-1 rotate-90 text-xl text-gray-500"
                />
                竖线
              </a>
            </div>
          </div>
        </div>

        <!-- Center: Designer Space -->
        <div
          class="relative flex flex-1 justify-center overflow-auto bg-gray-200 p-6"
        >
          <!-- Paper container -->
          <div
            id="hiprint-printTemplate"
            class="min-h-[800px] w-full max-w-[800px] bg-white shadow-md"
          ></div>
        </div>

        <!-- Right: Element Properties -->
        <div class="flex w-80 flex-col border-l bg-gray-50/50">
          <div class="border-b bg-white p-3 font-bold text-gray-700">
            组件配置
          </div>
          <div class="flex-1 overflow-y-auto">
            <!-- Properties linked automatically by hiprint -->
            <div id="PrintElementOptionSetting" class="p-2"></div>
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

:deep(.hiprint-printElement-opts) {
  width: 100% !important;
}
</style>
