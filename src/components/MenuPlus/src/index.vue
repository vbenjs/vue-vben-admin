<template>
  <ul :class="getClass" :style="getStyle">
    <slot></slot>
  </ul>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, CSSProperties, unref } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { propTypes } from '/@/utils/propTypes';
  export default defineComponent({
    props: {
      mode: propTypes.oneOf(['horizontal', 'vertical']).def('vertical'),
      theme: propTypes.oneOf(['light', 'dark', 'primary']).def('light'),
      activeName: propTypes.oneOfType([propTypes.string, propTypes.number]),
      openNames: propTypes.array.def([]),
      accordion: propTypes.bool,
      width: propTypes.string.def('210px'),
    },
    setup(props) {
      const currentActiveName = ref(props.activeName);
      const openedNames = ref<string[]>();

      const { prefixCls } = useDesign('menu');

      const getClass = computed(() => {
        const { theme, mode } = props;
        let curTheme = theme;
        if (mode === 'vertical' && theme === 'primary') {
          curTheme = 'light';
        }
        return [
          prefixCls,
          `${prefixCls}-${curTheme}`,
          {
            [`${prefixCls}-${mode}`]: mode,
          },
        ];
      });

      const getStyle = computed(
        (): CSSProperties => {
          const { mode, width } = props;
          if (mode === 'vertical') {
            return {
              width: width,
            };
          }
          return {};
        }
      );

      function updateActiveName() {
        if (unref(currentActiveName) === undefined) {
          currentActiveName.value = -1;
        }
      }

      function updateOpened() {}

      return { getClass, getStyle };
    },
  });
</script>
