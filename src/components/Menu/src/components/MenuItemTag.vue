<template>
  <span :class="getTagClass" v-if="getShowTag">{{ getContent }}</span>
</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { contentProps } from '../props';

  export default defineComponent({
    name: 'MenuItemTag',
    props: contentProps,
    setup(props) {
      const { prefixCls } = useDesign('basic-menu-item-tag');

      const getShowTag = computed(() => {
        const { item, showTitle, isHorizontal } = props;

        if (!item || showTitle || isHorizontal) return false;

        const { tag } = item;
        if (!tag) return false;

        const { dot, content } = tag;
        if (!dot && !content) return false;
        return true;
      });

      const getContent = computed(() => {
        if (!getShowTag.value) return '';
        const { item } = props;
        const { tag } = item;
        const { dot, content } = tag!;
        return dot ? '' : content;
      });

      const getTagClass = computed(() => {
        const { item } = props;
        const { tag = {} } = item || {};
        const { dot, type = 'error' } = tag;
        return [
          prefixCls,
          [`${prefixCls}--${type}`],
          {
            [`${prefixCls}--dot`]: dot,
          },
        ];
      });
      return {
        prefixCls,
        getTagClass,
        getShowTag,
        getContent,
      };
    },
  });
</script>
