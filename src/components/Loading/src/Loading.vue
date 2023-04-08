<template>
  <section
    class="full-loading"
    :class="{ absolute, [theme]: !!theme }"
    :style="[background ? `background-color: ${background}` : '']"
    v-show="loading"
  >
    <Spin v-bind="$attrs" :tip="tip" :size="size" :spinning="loading" />
  </section>
</template>
<script lang="ts">
  import { Spin } from 'ant-design-vue';
  import { defineComponent, PropType } from 'vue';

  export default defineComponent({
    name: 'Loading',
    components: { Spin },
    props: {
      tip: {
        type: String as PropType<string>,
        default: '',
      },
      size: {
        type: String as PropType<'default' | 'small' | 'large'>,
        default: 'large',
        validator: (v): boolean => {
          return ['default', 'small', 'large'].includes(v as any);
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
      },
    },
  });
</script>
<style lang="less" scoped>
  .full-loading {
    display: flex;
    position: fixed;
    z-index: 200;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgb(240 242 245 / 40%);

    &.absolute {
      position: absolute;
      z-index: 300;
      top: 0;
      left: 0;
    }
  }

  html[data-theme='dark'] {
    .full-loading:not(.light) {
      background-color: @modal-mask-bg;
    }
  }

  .full-loading.dark {
    background-color: @modal-mask-bg;
  }
</style>
