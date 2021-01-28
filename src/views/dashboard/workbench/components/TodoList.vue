<template>
  <CollapseContainer class="todo-list" title="待办事项" :canExpan="false">
    <template #title>
      <span> 待办事项 <span class="todo-list__total">30</span> </span>
    </template>

    <List>
      <template v-for="item in todoList" :key="item.id">
        <ListItem class="todo-list__item">
          <ListItemMeta>
            <template #title>
              <div>
                <span class="todo-list__item-title">{{ item.title }}</span>
                <span class="todo-list__item-memo">{{ item.memo }}</span>
              </div>
            </template>
            <template #description>
              <div class="todo-list__item-desc">
                提交人：{{ item.sbmter }}
                <br />
                提交时间：{{ item.sbmtTime }}
              </div>
            </template>
          </ListItemMeta>
          <a-button type="link">
            <Tag color="blue"> 待审批 </Tag>
          </a-button>
        </ListItem>
      </template>
    </List>
    <div class="todo-list__all">
      <Tooltip placement="topRight">
        <template #title> 查看更多 </template>
        <EllipsisOutlined />
      </Tooltip>
    </div>
  </CollapseContainer>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { List, Tag, Tooltip } from 'ant-design-vue';
  import { CollapseContainer } from '/@/components/Container/index';

  import { EllipsisOutlined } from '@ant-design/icons-vue';
  import { todoList } from '../data';

  export default defineComponent({
    name: 'TodoList',
    components: {
      CollapseContainer,
      List,
      ListItem: List.Item,
      ListItemMeta: List.Item.Meta,
      Tag,
      Tooltip,
      EllipsisOutlined,
    },
    setup() {
      return { todoList };
    },
  });
</script>
<style lang="less" scoped>
  .todo-list {
    position: relative;

    &__total {
      display: inline-block;
      width: 20px;
      height: 20px;
      font-size: 12px;
      line-height: 20px;
      color: #fff;
      text-align: center;
      background: rgba(255, 0, 0, 0.7);
      border-radius: 50%;
    }

    &__all {
      position: absolute;
      top: 0;
      right: 10px;
      height: 56px;
      font-size: 24px;
      line-height: 56px;
      text-align: center;
      cursor: pointer;
    }

    &__item {
      padding: 8px;

      &-title {
        font-size: 14px;
        font-weight: normal;
        line-height: 22px;
        color: #1c1d21;
      }

      &-memo {
        font-size: 12px;
        font-weight: normal;
        line-height: 22px;
        color: #7c8087;
      }

      &-desc {
        font-size: 12px;
        line-height: 22px;
        color: #7c8087;
      }
    }
  }
</style>
