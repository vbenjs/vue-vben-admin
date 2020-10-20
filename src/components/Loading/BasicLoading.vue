<template>
  <section class="basic-loading">
    <img
      src="/@/assets/images/loading.svg"
      alt=""
      :height="getLoadingIconSize"
      :width="getLoadingIconSize"
    />
    <span class="mt-4" v-if="tip"> {{ tip }}</span>
  </section>
</template>

<script lang="ts">
  import type { PropType } from 'vue';
  // components
  import { defineComponent, computed } from 'vue';

  import { SizeEnum, sizeMap } from '/@/enums/sizeEnum';

  import { BasicLoadingProps } from './type';

  export default defineComponent({
    inheritAttrs: false,
    name: 'BasicLoading',
    props: {
      tip: {
        type: String as PropType<string>,
        default: '',
      },
      size: {
        type: String as PropType<SizeEnum>,
        default: SizeEnum.DEFAULT,
        validator: (v: SizeEnum): boolean => {
          return [SizeEnum.DEFAULT, SizeEnum.SMALL, SizeEnum.LARGE].includes(v);
        },
      },
    },
    setup(props: BasicLoadingProps) {
      const getLoadingIconSize = computed(() => {
        const { size } = props;
        return sizeMap.get(size);
      });

      return { getLoadingIconSize };
    },
  });
</script>
<style lang="less" scoped>
  .basic-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
</style>
