<template>
  <div :class="prefixCls" v-if="imgList && imgList.length">
    <PreviewGroup>
      <template v-for="img in imgList" :key="img">
        <Image :width="size" :src="img" />
      </template>
    </PreviewGroup>
  </div>
</template>
<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  import { Image } from 'ant-design-vue';

  export default defineComponent({
    name: 'TableImage',
    components: { Image, PreviewGroup: Image.PreviewGroup },
    props: {
      imgList: {
        type: Array as PropType<string[]>,
        default: null,
      },
      size: {
        type: Number as PropType<number>,
        default: 40,
      },
    },
    setup() {
      const { prefixCls } = useDesign('basic-table-img');
      return { prefixCls };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-basic-table-img';

  .@{prefix-cls} {
    display: flex;

    .ant-image {
      margin-right: 4px;
      cursor: zoom-in;

      img {
        border-radius: 2px;
      }
    }
  }
</style>
