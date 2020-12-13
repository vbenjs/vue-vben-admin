<template>
  <BasicArrow :expand="getIsOpen" bottom inset :class="getWrapperClass" />
</template>
<script lang="ts">
  import { defineComponent, PropType, computed } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { BasicArrow } from '/@/components/Basic';

  import { propTypes } from '/@/utils/propTypes';
  export default defineComponent({
    name: 'BasicMenuItem',
    components: { BasicArrow },
    props: {
      key: propTypes.string,
      openKeys: {
        type: Array as PropType<string[]>,
        default: [],
      },
      collapsed: propTypes.bool,
    },
    setup(props) {
      const { prefixCls } = useDesign('basic-menu');

      const getIsOpen = computed(() => {
        return props.openKeys.includes(props.key);
      });

      const getWrapperClass = computed(() => {
        return [
          `${prefixCls}__expand-icon`,
          {
            [`${prefixCls}__expand-icon--collapsed`]: props.collapsed,
          },
        ];
      });
      return {
        prefixCls,
        getIsOpen,
        getWrapperClass,
      };
    },
  });
</script>
