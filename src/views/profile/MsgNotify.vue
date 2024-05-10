<template>
  <CollapseContainer title="新消息通知" :canExpan="false">
    <List>
      <template v-for="item in msgNotifyList" :key="item.key">
        <List.Item>
          <List.Item.Meta>
            <template #title>
              {{ item.title }}
              <Switch
                class="extra"
                checked-children="开"
                un-checked-children="关"
                default-checked
              />
            </template>
            <template #description>
              <div>{{ item.description }} </div>
            </template>
          </List.Item.Meta>
        </List.Item>
      </template>
    </List>
  </CollapseContainer>
</template>
<script lang="ts" setup>
  import { List, Switch } from 'ant-design-vue';
  import { CollapseContainer } from '/@/components/Container/index';

  import { msgNotifyList } from './data';
</script>
<style lang="less" scoped>
  .extra {
    float: right;
    margin-top: 10px;
    margin-right: 30px;
  }
</style>
