<template>
  <CollapseContainer title="账号绑定" :canExpan="false">
    <List>
      <template v-for="item in list" :key="item.key">
        <ListItem>
          <ListItemMeta>
            <template #avatar>
              <VbenIcon v-if="item.avatar" class="avatar" :icon="item.avatar" :color="item.color" />
            </template>
            <template #title>
              {{ item.title }}
              <a-button type="link" size="small" v-if="item.extra" class="extra">
                {{ item.extra }}
              </a-button>
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
<script lang="ts">
  import { VbenIcon } from '@vben/icons';
  import { List } from 'ant-design-vue';
  import { defineComponent } from 'vue';

  import { CollapseContainer } from '@/components/Container/index';

  import { accountBindList } from './data';

  export default defineComponent({
    components: {
      CollapseContainer,
      List,
      ListItem: List.Item,
      ListItemMeta: List.Item.Meta,
      VbenIcon,
    },
    setup() {
      return {
        list: accountBindList,
      };
    },
  });
</script>
<style lang="less" scoped>
  .avatar {
    font-size: 40px !important;
  }

  .extra {
    margin-top: 10px;
    margin-right: 30px;
    float: right;
    cursor: pointer;
  }
</style>
