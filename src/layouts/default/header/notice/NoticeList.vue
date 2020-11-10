<template>
  <List class="list">
    <template v-for="item in list" :key="item.id">
      <ListItem class="list__item">
        <ListItemMeta>
          <template #title>
            <div class="title">
              {{ item.title }}
              <div class="extra" v-if="item.extra">
                <Tag class="tag" :color="item.color">
                  {{ item.extra }}
                </Tag>
              </div>
            </div>
          </template>
          <template #avatar>
            <Avatar v-if="item.avatar" class="avatar" :src="item.avatar" />
            <span v-else> {{ item.avatar }}</span>
          </template>
          <template #description>
            <div>
              <div class="description">{{ item.description }}</div>
              <div class="datetime">{{ item.datetime }}</div>
            </div>
          </template>
        </ListItemMeta>
      </ListItem>
    </template>
  </List>
</template>
<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { List, Avatar, Tag } from 'ant-design-vue';
  import { ListItem } from './data';

  export default defineComponent({
    props: {
      list: {
        type: Array as PropType<Array<ListItem>>,
        default: () => [],
      },
    },
    components: {
      List,
      ListItem: List.Item,
      ListItemMeta: List.Item.Meta,
      Avatar,
      Tag,
    },
    setup(props) {
      const { list = [] } = props;
      return {
        list,
      };
    },
  });
</script>
<style lang="less" scoped>
  .list {
    &::-webkit-scrollbar {
      display: none;
    }

    &__item {
      padding: 6px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s;

      .title {
        margin-bottom: 8px;
        font-weight: normal;

        .extra {
          float: right;
          margin-top: -1.5px;
          margin-right: 0;
          font-weight: normal;

          .tag {
            margin-right: 0;
          }
        }

        .avatar {
          margin-top: 4px;
        }

        .description {
          font-size: 12px;
          line-height: 18px;
        }

        .datetime {
          margin-top: 4px;
          font-size: 12px;
          line-height: 18px;
        }
      }
    }
  }
</style>
