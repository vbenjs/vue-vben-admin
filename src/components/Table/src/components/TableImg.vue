<template>
  <div
    :class="prefixCls"
    class="flex mx-auto items-center"
    v-if="imgList && imgList.length"
    :style="getWrapStyle"
  >
    <PreviewGroup>
      <template v-for="img in imgList" :key="img">
        <Image :width="size" :src="img" />
      </template>
    </PreviewGroup>
  </div>
</template>
<script lang="ts">
  import type { CSSProperties } from 'vue';
  import { defineComponent, computed } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  import { Image } from 'ant-design-vue';
  import { propTypes } from '/@/utils/propTypes';

  export default defineComponent({
    name: 'TableImage',
    components: { Image, PreviewGroup: Image.PreviewGroup },
    props: {
      imgList: propTypes.arrayOf(propTypes.string),
      size: propTypes.number.def(40),
    },
    setup(props) {
      const getWrapStyle = computed(
        (): CSSProperties => {
          const { size } = props;
          const s = `${size}px`;
          return { height: s, width: s };
        }
      );

      const { prefixCls } = useDesign('basic-table-img');
      return { prefixCls, getWrapStyle };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-basic-table-img';

  .@{prefix-cls} {
    .ant-image {
      margin-right: 4px;
      cursor: zoom-in;

      img {
        border-radius: 2px;
      }
    }
  }
</style>
