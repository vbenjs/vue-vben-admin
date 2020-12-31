<template>
  <PreviewGroup :class="prefixCls">
    <slot v-if="!imageList || $slots.default" />
    <template v-else>
      <template v-for="item in getImageList" :key="item.src">
        <Image v-bind="item">
          <template #placeholder v-if="item.placeholder">
            <Image v-bind="item" :src="item.placeholder" :preview="false" />
          </template>
        </Image>
      </template>
    </template>
  </PreviewGroup>
</template>
<script lang="ts">
  import type { PropType } from 'vue';
  import { defineComponent, computed } from 'vue';

  import { Image } from 'ant-design-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { propTypes } from '/@/utils/propTypes';
  import { ImageItem } from './types';
  import { isString } from '/@/utils/is';

  export default defineComponent({
    name: 'ImagePreview',
    components: {
      Image,
      PreviewGroup: Image.PreviewGroup,
    },
    props: {
      functional: propTypes.bool,
      imageList: {
        type: Array as PropType<ImageItem[]>,
      },
    },
    setup(props) {
      const { prefixCls } = useDesign('image-preview');

      const getImageList = computed(() => {
        const { imageList } = props;
        if (!imageList) {
          return [];
        }
        return imageList.map((item) => {
          if (isString(item)) {
            return {
              src: item,
              placeholder: false,
            };
          }
          return item;
        });
      });

      return { prefixCls, getImageList };
    },
  });
</script>
<style lang="less">
  @import (reference) '../../../design/index.less';
  @prefix-cls: ~'@{namespace}-image-preview';

  .@{prefix-cls} {
    .ant-image-preview-operations {
      background: rgba(0, 0, 0, 0.4);
    }
  }
</style>
