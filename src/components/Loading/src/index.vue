<template>
  <section class="full-loading" :class="{ absolute }" v-show="loading" :style="getStyle">
    <Spin v-bind="$attrs" :tip="tip" :size="size" :spinning="loading" />
  </section>
</template>
<script lang="ts">
  import { computed, CSSProperties, PropType } from 'vue';

  import { defineComponent } from 'vue';
  import { Spin } from 'ant-design-vue';

  import { SizeEnum } from '/@/enums/sizeEnum';
  import { ThemeEnum } from '/@/enums/appEnum';

  export default defineComponent({
    name: 'Loading',
    components: { Spin },
    props: {
      tip: {
        type: String as PropType<string>,
        default: '',
      },
      size: {
        type: String as PropType<SizeEnum>,
        default: SizeEnum.LARGE,
        validator: (v: SizeEnum): boolean => {
          return [SizeEnum.DEFAULT, SizeEnum.SMALL, SizeEnum.LARGE].includes(v);
        },
      },
      absolute: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
      loading: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
      background: {
        type: String as PropType<string>,
      },
      theme: {
        type: String as PropType<'dark' | 'light'>,
        default: 'light',
      },
    },
    setup(props) {
      const getStyle = computed(
        (): CSSProperties => {
          const { background, theme } = props;
          const bgColor = background
            ? background
            : theme === ThemeEnum.DARK
            ? 'rgba(0, 0, 0, 0.2)'
            : 'rgba(240, 242, 245, 0.4)';
          return { background: bgColor };
        }
      );

      return { getStyle };
    },
  });
</script>
<style lang="less" scoped>
  .full-loading {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;

    &.absolute {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 300;
    }
  }
</style>
