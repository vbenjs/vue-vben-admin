<template>
  <Card title="最新动态" v-bind="$attrs">
    <template #extra>
      <a-button type="link" size="small">更多</a-button>
    </template>
    <List item-layout="horizontal" :data-source="items">
      <template #renderItem="{ item }">
        <ListItem>
          <ListItemMeta>
            <template #description>
              {{ item.date }}
            </template>
            <!-- eslint-disable-next-line -->
            <template #title> {{ item.name }} <span v-html="item.desc"> </span> </template>
            <template #avatar>
              <Icon :icon="item.avatar" :size="30" />
            </template>
          </ListItemMeta>
        </ListItem>
      </template>
    </List>
  </Card>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  import { Card, List } from 'ant-design-vue';
  import { dynamicInfoItems } from './data';
  import headerImg from '/@/assets/images/header.jpg';
  import { Icon } from '/@/components/Icon';

  export default defineComponent({
    components: { Card, List, ListItem: List.Item, ListItemMeta: List.Item.Meta, Icon },
    setup() {
      return { items: dynamicInfoItems, headerImg };
    },
  });
</script>
