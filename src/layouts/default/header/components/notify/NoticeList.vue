<template>
  <a-list :class="prefixCls">
    <template v-for="item in list" :key="item.id">
      <a-list-item class="list-item">
        <a-list-item-meta>
          <template #title>
            <div class="title">
              {{ item.title }}
              <div class="extra" v-if="item.extra">
                <a-tag class="tag" :color="item.color">
                  {{ item.extra }}
                </a-tag>
              </div>
            </div>
          </template>

          <template #avatar>
            <a-avatar v-if="item.avatar" class="avatar" :src="item.avatar" />
            <span v-else> {{ item.avatar }}</span>
          </template>

          <template #description>
            <div>
              <div class="description">
                {{ item.description }}
              </div>
              <div class="datetime">
                {{ item.datetime }}
              </div>
            </div>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
</template>
<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { ListItem } from './data';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { List, Avatar, Tag } from 'ant-design-vue';
  export default defineComponent({
    components: {
      [Avatar.name]: Avatar,
      [List.name]: List,
      [List.Item.name]: List.Item,
      AListItemMeta: List.Item.Meta,
      [Tag.name]: Tag,
    },
    props: {
      list: {
        type: Array as PropType<ListItem[]>,
        default: () => [],
      },
    },
    setup() {
      const { prefixCls } = useDesign('header-notify-list');
      return { prefixCls };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-header-notify-list';

  .@{prefix-cls} {
    &::-webkit-scrollbar {
      display: none;
    }

    &-item {
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
