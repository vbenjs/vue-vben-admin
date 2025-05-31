<script setup lang="ts">
import type { TabOption } from '@vben/types';

import { computed, ref } from 'vue';

import { Tabs } from 'ant-design-vue';

interface Props {
  tabs?: TabOption[];
}

defineOptions({
  name: 'LoginTabs',
  components: {
    'a-tabs': Tabs,
    'a-tab-pane': Tabs.TabPane,
  },
});

const props = withDefaults(defineProps<Props>(), {
  tabs: () => [],
});

const emits = defineEmits(['updateActiveKey']);
const defaultValue = computed(() => {
  return props.tabs?.[0]?.value;
});
const activeKey = ref(defaultValue.value);
</script>

<template>
  <div class="w-full">
    <a-tabs
      class="login-tabs-wrapper"
      v-model:active-key="activeKey"
      @change="emits('updateActiveKey', activeKey)"
    >
      <a-tab-pane
        class="login-tabs-pane-wrapper"
        v-for="tab in tabs"
        :key="tab.value"
        :tab="tab.label"
      >
        <slot :name="tab.value"></slot>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<style scoped lang="scss">
:deep(.login-tabs-wrapper) {
  & > .ant-tabs-nav {
    &::before {
      display: none;
    }

    & > .ant-tabs-nav-wrap {
      & > .ant-tabs-nav-list {
        .ant-tabs-tab {
          .ant-tabs-tab-btn {
            color: hsl(218deg 70% 13%);
          }

          &.ant-tabs-tab-active {
            .ant-tabs-tab-btn {
              color: hsl(var(--primary));
            }
          }

          &::before {
            position: absolute;
            right: -12px;
            bottom: calc(50% - 9px);
            width: 1px;
            height: 18px;
            content: '';
            background-color: #ddd;
          }

          &:nth-child(2) {
            margin-left: 24px;
            &::before {
              display: none;
            }
          }
        }

        & > .ant-tabs-ink-bar {
          display: none;
        }
      }
    }
  }
}
</style>
