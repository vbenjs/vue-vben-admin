<template>
  <div @click.stop="toggleCollapsed">
    <DoubleRightOutlined v-if="getCollapsed" />
    <DoubleLeftOutlined v-else />
  </div>
</template>
<script lang="ts">
  import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons-vue';
  import { defineComponent } from 'vue';

  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';

  export default defineComponent({
    name: 'SiderTrigger',
    components: { DoubleRightOutlined, DoubleLeftOutlined },
    setup() {
      const { getCollapsed, toggleCollapsed } = useMenuSetting();

      return { getCollapsed, toggleCollapsed };
    },
  });
</script>
