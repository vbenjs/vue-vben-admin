<template>
  <div ref="wrapperRef" :class="prefixCls">
    <Tabs type="card" :tabPosition="tabPosition" :tabBarStyle="tabBarStyle" destroyInactiveTabPane>
      <template #rightExtra v-if="tabPosition === 'left'">
        <div class="w-50px h-10 flex justify-center items-center" @click="handleExpand">
          <Icon icon="icon-park-outline:expand-left-and-right" />
        </div>
      </template>
      <template v-for="item in settingList" :key="item.key">
        <template v-if="hasPermission(item.auth)">
          <TabPane :key="item.key">
            <component :is="item.component" :style="{ height: height }" class="enter-y" />
            <template #tab>
              <span :class="[!expand && prefixCls + '-expand']">
                <Icon v-if="item.icon" :icon="item.icon" />
              </span>
              {{ expand ? item.name : '' }}
            </template>
          </TabPane>
        </template>
      </template>
    </Tabs>
  </div>
</template>

<script lang="ts">
  import {
    computed,
    defineAsyncComponent,
    defineComponent,
    onMounted,
    onUnmounted,
    ref,
    watch,
  } from 'vue';
  import { Tabs } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { ScrollContainer } from '@/components/Container';
  import { useAppStore } from '@/store/modules/app';
  import { MenuTypeEnum } from '@/enums/menuEnum';
  import { throttle } from 'lodash-es';
  import { settingList } from './data';
  import { usePermission } from '@/hooks/web/usePermission';

  const OtherSettings = defineAsyncComponent(() => import('./other/index.vue'));
  const RemindMessage = defineAsyncComponent(() => import('./remind/message/index.vue'));
  const RemindTemplate = defineAsyncComponent(() => import('./remind/template/index.vue'));
  const BusinessTime = defineAsyncComponent(() => import('./time/index.vue'));

  export default defineComponent({
    name: 'SystemSet',
    components: {
      ScrollContainer,
      Tabs,
      TabPane: Tabs.TabPane,
      Icon,
      OtherSettings,
      RemindTemplate,
      RemindMessage,
      BusinessTime,
    },
    setup() {
      const expand = ref(true);
      const appStore = useAppStore();
      const { hasPermission } = usePermission();

      const tabPosition = computed(() => {
        if (appStore.getMenuSetting.type === MenuTypeEnum.TOP_MENU) return 'left';
        return 'top';
      });

      const height = ref('100%');

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
      watch(
        () => tabPosition.value,
        () => handleCalcHeight(),
      );
      const handleCalcHeight = throttle(() => {
        setTimeout(() => {
          const headerHeight =
            (document.querySelector('.vben-multiple-tabs')?.clientHeight ?? 0) +
            (document.querySelector('.ant-layout-header')?.clientHeight ?? 0) +
            1;
          const tabHeight = tabPosition.value === 'left' ? 0 : 40;
          height.value = `calc(100vh - ${headerHeight + 30 + tabHeight}px)`;
        }, 200);
      }, 200);

      return {
        prefixCls: 'base-settings',
        settingList,
        tabBarStyle: {},
        expand,
        tabPosition,
        handleExpand,
        hasPermission,
        height,
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
