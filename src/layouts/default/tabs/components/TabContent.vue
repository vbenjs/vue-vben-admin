<template>
  <Dropdown :dropMenuList="getDropMenuList" :trigger="getTrigger" @menuEvent="handleMenuEvent">
    <div :class="`${prefixCls}__info`" @contextmenu="handleContext" v-if="isTabs">
      <span class="ml-1">{{ getTitle }}</span>
    </div>

    <span :class="`${prefixCls}__extra-quick`" v-else @click="handleContext">
      <RightOutlined />
    </span>
  </Dropdown>
</template>
<script lang="ts">
  import type { PropType } from 'vue';

  import { defineComponent, computed } from 'vue';
  import { Dropdown } from '/@/components/Dropdown/index';

  import { TabContentProps, TabContentEnum } from '../types';

  import { RightOutlined } from '@ant-design/icons-vue';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { useTabDropdown } from '../useTabDropdown';
  import { useI18n } from '/@/hooks/web/useI18n';

  import { RouteLocationNormalized } from 'vue-router';
  export default defineComponent({
    name: 'TabContent',
    components: { Dropdown, RightOutlined },
    props: {
      tabItem: {
        type: Object as PropType<RouteLocationNormalized>,
        default: null,
      },

      type: {
        type: Number as PropType<TabContentEnum>,
        default: TabContentEnum.TAB_TYPE,
      },
    },
    setup(props) {
      const { prefixCls } = useDesign('multiple-tabs-content');
      const { t } = useI18n();

      const getTitle = computed(() => {
        const { tabItem: { meta } = {} } = props;
        return meta && t(meta.title);
      });

      const {
        getDropMenuList,
        handleMenuEvent,
        handleContextMenu,
        getTrigger,
        isTabs,
      } = useTabDropdown(props as TabContentProps);

      function handleContext(e: ChangeEvent) {
        props.tabItem && handleContextMenu(props.tabItem)(e);
      }
      return {
        prefixCls,
        getDropMenuList,
        handleMenuEvent,
        handleContext,
        getTrigger,
        isTabs,
        getTitle,
      };
    },
  });
</script>
