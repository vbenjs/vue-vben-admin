<template>
  <PageWrapper title="MarkDown组件示例">
    <a-button @click="toggleTheme" class="mb-2" type="primary"> 黑暗主题 </a-button>
    <MarkDown :value="value" @change="handleChange" ref="markDownRef" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { MarkDown, MarkDownActionType } from '/@/components/Markdown';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    components: { MarkDown, PageWrapper },
    setup() {
      const markDownRef = ref<Nullable<MarkDownActionType>>(null);
      const valueRef = ref(`
# title

# content
`);

      function toggleTheme() {
        const markDown = unref(markDownRef);
        if (!markDown) return;
        const vditor = markDown.getVditor();
        vditor.setTheme('dark');
      }

      function handleChange(v: string) {
        valueRef.value = v;
      }

      return {
        value: valueRef,
        toggleTheme,
        markDownRef,
        handleChange,
      };
    },
  });
</script>
