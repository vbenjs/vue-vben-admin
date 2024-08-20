<script lang="ts" setup>
import { onMounted, useAttrs, useSlots } from 'vue';

import { useFs } from '@fast-crud/fast-crud';

import { createCrudOptions, type FirstRow } from './crud';

const props = defineProps({});

const emit = defineEmits([]);

const slots = useSlots();

const attrs = useAttrs();

const context: any = {
  ctx: {
    attrs,
    emit,
    slots,
  },
  props,
}; // 自定义变量, 将会传递给createCrudOptions, 比如直接把props,和ctx直接传过去使用
function onExpose() {} // 将在createOptions之前触发，可以获取到crudExpose,和context
const { crudBinding, crudExpose, crudRef } = useFs<FirstRow>({
  context,
  createCrudOptions,
  onExpose,
});

// 页面打开后获取列表数据
onMounted(() => {
  crudExpose.doRefresh();
});
</script>

<template>
  <FsPage>
    <template #header>
      <div class="title">first crud demo</div>
      <div class="more">
        <a
          href="http://fast-crud.docmirror.cn/guide/start/first.html"
          target="_blank"
          >文档
        </a>
      </div>
    </template>
    <FsCrud ref="crudRef" v-bind="crudBinding" />
  </FsPage>
</template>
