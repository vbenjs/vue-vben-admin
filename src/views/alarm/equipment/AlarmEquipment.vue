<template>
  <div ref="wrapperRef" :class="prefixCls">
    <Tabs
      type="card"
      tabPosition="top"
      :tabBarStyle="tabBarStyle"
      :default-active-key="defaultTabKey"
      destroyInactiveTabPane
    >
      <template v-for="item in settingList" :key="item.key">
        <template v-if="hasPermission(item.auth)">
          <TabPane :key="item.key">
            <component :is="item.component" :style="{ height: height }" />
            <template #tab>
              <span :class="[!expand && prefixCls + '-expand']">
                <Icon v-if="item.icon" :icon="item.icon" />
              </span>
              {{ expand ? item.name : '' }}
            </template>
          </TabPane>
        </template>
      </template>
      <template #leftExtra>
        <div class="px-4">
          <Tag color="#2db7f5">{{ route.query.equipmentName }}</Tag>
          <Tag color="#87d068">{{ equipmentTypeMap.get(route.query.equipmentType as any) }}</Tag>
          <Tag color="red">{{ route.query.store }}</Tag>
        </div>
      </template>
    </Tabs>
  </div>
</template>

<script lang="ts">
  import { defineAsyncComponent, defineComponent, onMounted, onUnmounted, ref } from 'vue';
  import { Tabs, Tag } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { ScrollContainer } from '@/components/Container';
  import { throttle } from 'lodash-es';
  import { settingList } from './data';
  import { usePermission } from '@/hooks/web/usePermission';
  import { useRoute } from 'vue-router';
  import { equipmentTypeMap } from '@/enums/equipmentType';
  import { useTabs } from '@/hooks/web/useTabs';

  const Setting = defineAsyncComponent(() => import('./setting/index.vue'));
  const Record = defineAsyncComponent(() => import('./record/index.vue'));

  export default defineComponent({
    name: 'AlarmEquipment',
    components: {
      ScrollContainer,
      Tabs,
      TabPane: Tabs.TabPane,
      Tag,
      Icon,
      Setting,
      Record,
    },
    setup() {
      const expand = ref(true);
      const { hasPermission } = usePermission();

      const height = ref('100%');
      const route = useRoute();
      const { setTitle } = useTabs();
      setTitle(`告警配置:${route.query.equipmentName}`);

      const defaultTabKey = (route.query.default ?? 'setting') as string;

      const handleExpand = () => {
        expand.value = !expand.value;
      };
      onMounted(() => {
        handleCalcHeight();
        window.addEventListener('resize', handleCalcHeight);
      });
      onUnmounted(() => {
        window.removeEventListener('resize', handleCalcHeight);
      });

      const handleCalcHeight = throttle(() => {
        setTimeout(() => {
          const headerHeight =
            (document.querySelector('.vben-multiple-tabs')?.clientHeight ?? 0) +
            (document.querySelector('.ant-layout-header')?.clientHeight ?? 0) +
            1;
          const tabHeight = 40;
          height.value = `calc(100vh - ${headerHeight + 24 + tabHeight}px)`;
        }, 200);
      }, 200);

      return {
        prefixCls: 'base-settings',
        settingList,
        tabBarStyle: {},
        expand,
        route,
        handleExpand,
        hasPermission,
        height,
        equipmentTypeMap,
        defaultTabKey,
      };
    },
  });
</script>
<style lang="less">
  .base-settings {
    margin: 12px;
    background-color: @component-background;

    .base-title {
      padding-left: 0;
    }

    .ant-tabs-nav {
      margin: 0;
    }

    .ant-tabs-left > .ant-tabs-content-holder > .ant-tabs-content > .ant-tabs-tabpane {
      padding: 0;
    }

    &-expand .anticon {
      margin-right: 0;
    }
  }
</style>
