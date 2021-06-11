<template>
  <div ref="wrapRef"></div>
</template>
<script lang="ts">
  import {
    defineComponent,
    ref,
    onMounted,
    unref,
    onUnmounted,
    nextTick,
    computed,
    watch,
  } from 'vue';
  import Vditor from 'vditor';
  import 'vditor/dist/index.css';
  import { useLocale } from '/@/locales/useLocale';
  import { useModalContext } from '../../Modal';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';

  type Lang = 'zh_CN' | 'en_US' | 'ja_JP' | 'ko_KR' | undefined;

  export default defineComponent({
    inheritAttrs: false,
    props: {
      height: { type: Number, default: 360 },
      value: { type: String, default: '' },
    },
    emits: ['change', 'get'],
    setup(props, { attrs, emit }) {
      const wrapRef = ref<ElRef>(null);
      const vditorRef = ref<Nullable<Vditor>>(null);
      const initedRef = ref(false);

      const modalFn = useModalContext();

      const { getLocale } = useLocale();
      const { getDarkMode } = useRootSetting();

      watch(
        [() => getDarkMode.value, () => initedRef.value],
        ([val]) => {
          const vditor = unref(vditorRef);

          if (!vditor) {
            return;
          }
          const theme = val === 'dark' ? 'dark' : undefined;
          vditor.setTheme(theme as 'dark');
        },
        {
          immediate: true,
          flush: 'post',
        }
      );

      const getCurrentLang = computed((): 'zh_CN' | 'en_US' | 'ja_JP' | 'ko_KR' => {
        let lang: Lang;
        switch (unref(getLocale)) {
          case 'en':
            lang = 'en_US';
            break;
          case 'ja':
            lang = 'ja_JP';
            break;
          case 'ko':
            lang = 'ko_KR';
            break;
          default:
            lang = 'zh_CN';
        }
        return lang;
      });
      function init() {
        const wrapEl = unref(wrapRef);
        if (!wrapEl) return;
        const bindValue = { ...attrs, ...props };
        vditorRef.value = new Vditor(wrapEl, {
          theme: 'classic',
          lang: unref(getCurrentLang),
          mode: 'sv',
          preview: {
            actions: [],
          },
          input: (v) => {
            // emit('update:value', v);
            emit('change', v);
          },
          blur: () => {
            unref(vditorRef)?.setValue(props.value);
          },
          ...bindValue,
          cache: {
            enable: false,
          },
        });
        initedRef.value = true;
      }

      const instance = {
        getVditor: (): Vditor => vditorRef.value!,
      };

      onMounted(() => {
        nextTick(() => {
          init();
          setTimeout(() => {
            modalFn?.redoModalHeight?.();
          }, 200);
        });

        emit('get', instance);
      });

      onUnmounted(() => {
        const vditorInstance = unref(vditorRef);
        if (!vditorInstance) return;
        try {
          vditorInstance?.destroy?.();
        } catch (error) {}
      });

      return {
        wrapRef,
        ...instance,
      };
    },
  });
</script>
