<template>
  <CollapseContainer title="安全设置" :canExpand="false">
    <List>
      <template v-for="item in secureSettingList" :key="item.key">
        <ListItem>
          <ListItemMeta>
            <template #title>
              {{ item.title }}
              <div
                class="float-right mt-10px mr-30px text-blue-500 text-font-normal cursor-pointer"
                v-if="item.extra"
              >
                {{ item.extra }}
              </div>
            </template>
            <template #description>
              <div>{{ item.description }}</div>
            </template>
          </ListItemMeta>
        </ListItem>
      </template>
    </List>
  </CollapseContainer>
</template>
<script lang="ts" setup>
  import { CollapseContainer } from '@/components/Container';
  import { List } from 'ant-design-vue';
  import { secureSettingList } from './data';

  const ListItem = List.Item;
  const ListItemMeta = List.Item.Meta;
</script>
