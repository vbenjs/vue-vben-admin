<template>
  <div ref="viewerRef" id="markdownViewer" :class="$props.class"></div>
</template>

<script lang="ts" setup>
  import { onBeforeUnmount, onDeactivated, Ref, ref, unref, watch } from 'vue';
  import VditorPreview from 'vditor/dist/method.min';
  import { onMountedOrActivated } from '@vben/hooks';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { getTheme } from './getTheme';

  const props = defineProps({
    value: { type: String },
    class: { type: String },
  });
  const viewerRef = ref(null);
  const vditorPreviewRef = ref(null) as Ref<VditorPreview | null>;
  const { getDarkMode } = useRootSetting();

  function init() {
    const viewerEl = unref(viewerRef);
    vditorPreviewRef.value = VditorPreview.preview(viewerEl, props.value, {
      mode: getTheme(getDarkMode.value, 'content'),
      theme: {
        // 设置内容主题
        current: getTheme(getDarkMode.value, 'content'),
      },
      hljs: {
        // 设置代码块主题
        style: getTheme(getDarkMode.value, 'code'),
      },
    });
  }
  watch(
    () => getDarkMode.value,
    (val) => {
      VditorPreview.setContentTheme(getTheme(val, 'content'));
      VditorPreview.setCodeTheme(getTheme(val, 'code'));
      init();
    },
  );

  watch(
    () => props.value,
    (v, oldValue) => {
      v !== oldValue && init();
    },
  );

  function destroy() {
    const vditorInstance = unref(vditorPreviewRef);
    if (!vditorInstance) return;
    try {
      vditorInstance?.destroy?.();
    } catch (error) {
      //
    }
    vditorPreviewRef.value = null;
  }

  onMountedOrActivated(init);

  onBeforeUnmount(destroy);
  onDeactivated(destroy);
</script>
