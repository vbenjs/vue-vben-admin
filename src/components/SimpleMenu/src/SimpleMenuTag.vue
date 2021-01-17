<template>
  <span :class="getTagClass" v-if="getShowTag">{{ getContent }}</span>
</template>
<script lang="ts">
  import type { Menu } from '/@/router/types';
  import type { PropType } from 'vue';

  import { defineComponent, computed } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    name: 'SimpleMenuTag',
    props: {
      item: {
        type: Object as PropType<Menu>,
        default: {},
      },
      collapseParent: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
    },
    setup(props) {
      const { prefixCls } = useDesign('simple-menu');

      const getShowTag = computed(() => {
        const { item } = props;

        if (!item) return false;

        const { tag } = item;
        if (!tag) return false;

        const { dot, content } = tag;
        if (!dot && !content) return false;
        return true;
      });

      const getContent = computed(() => {
        if (!getShowTag.value) return '';
        const { item, collapseParent } = props;
        const { tag } = item;
        const { dot, content } = tag!;
        return dot || collapseParent ? '' : content;
      });

      const getTagClass = computed(() => {
        const { item, collapseParent } = props;
        const { tag = {} } = item || {};
        const { dot, type = 'error' } = tag;
        const tagCls = `${prefixCls}-tag`;
        return [
          tagCls,

          [`${tagCls}--${type}`],
          {
            [`${tagCls}--collapse`]: collapseParent,
            [`${tagCls}--dot`]: dot,
          },
        ];
      });
      return {
        getTagClass,
        getShowTag,
        getContent,
      };
    },
  });
</script>
