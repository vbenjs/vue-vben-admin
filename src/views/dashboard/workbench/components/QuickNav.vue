<template>
  <Card title="快捷导航" v-bind="$attrs">
    <template v-for="item in items" :key="item">
      <CardGrid>
        <span class="flex flex-col items-center">
          <Icon :icon="item.icon" :color="item.color" size="20" />
          <span class="text-md mt-2">{{ item.title }}</span>
        </span>
      </CardGrid>
    </template>
  </Card>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  import { Card } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { navItems } from './data';

  export default defineComponent({
    components: { Card, CardGrid: Card.Grid, Icon },
    setup() {
      return { items: navItems };
    },
  });
</script>
