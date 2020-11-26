<template>
  <div class="markdown" ref="wrapRef" />
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted, unref, onUnmounted, nextTick, watchEffect } from 'vue';
  import Vditor from 'vditor';
  import 'vditor/dist/index.css';

  import { propTypes } from '/@/utils/propTypes';

  export default defineComponent({
    emits: ['update:value'],
    props: {
      height: propTypes.number.def(360),
      value: propTypes.string.def(''),
    },
    setup(props, { attrs, emit }) {
      const wrapRef = ref<ElRef>(null);
      const vditorRef = ref<Nullable<Vditor>>(null);
      const initedRef = ref(false);

      function init() {
        const wrapEl = unref(wrapRef);
        if (!wrapEl) return;
        const bindValue = { ...attrs, ...props };
        vditorRef.value = new Vditor(wrapEl, {
          mode: 'sv',
          preview: {
            actions: [],
          },
          input: (v) => {
            emit('update:value', v);
          },
          ...bindValue,
          cache: {
            enable: false,
          },
        });
        initedRef.value = true;
      }

      watchEffect(() => {
        nextTick(() => {
          const vditor = unref(vditorRef);
          if (unref(initedRef) && props.value && vditor) {
            vditor.setValue(props.value);
          }
        });
      });

      onMounted(() => {
        nextTick(() => {
          init();
        });
      });

      onUnmounted(() => {
        const vditorInstance = unref(vditorRef);
        if (!vditorInstance) return;
        vditorInstance.destroy();
      });

      return {
        wrapRef,
        getVditor: (): Vditor => vditorRef.value!,
      };
    },
  });
</script>
