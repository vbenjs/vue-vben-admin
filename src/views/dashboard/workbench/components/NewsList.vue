<template>
  <CollapseContainer class="news-list" title="动态" :canExpan="false">
    <ScrollContainer>
      <List>
        <template v-for="item in newList" :key="item.id">
          <ListItem class="news-list__item">
            <ListItemMeta>
              <template #avatar>
                <img :src="headerImg" class="news-list__item-avatar" />
              </template>
              <template #description>
                <div class="news-list__item-desc">
                  <div class="news-list__item-time mb-1">
                    {{ item.sendTime }}
                  </div>
                  <div class="news-list__item-title mb-1">
                    <span class="news-list__item-light">{{ item.sender }}&nbsp;</span>申请迭代
                    <span class="news-list__item-light">&nbsp;{{ item.title }}&nbsp;</span>发布
                  </div>
                  <div class="news-list__item-cnte p-2">
                    <span class="news-list__item-cnte__title"> {{ item.cnteId }}</span>
                    <br />
                    Status: {{ item.cnteStas }}
                    <br />
                    Repository: {{ item.cnteRepo }}
                    <br />
                  </div>
                </div>
              </template>
            </ListItemMeta>
          </ListItem>
        </template>
      </List>
    </ScrollContainer>
  </CollapseContainer>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { List } from 'ant-design-vue';
  import { CollapseContainer, ScrollContainer } from '/@/components/Container/index';
  import headerImg from '/@/assets/images/header.jpg';

  import { newList } from '../data';
  export default defineComponent({
    components: {
      List,
      ListItem: List.Item,
      ListItemMeta: List.Item.Meta,
      CollapseContainer,
      ScrollContainer,
    },
    setup() {
      return { newList, headerImg };
    },
  });
</script>
<style lang="less" scoped>
  .news-list {
    &__item {
      &-avatar {
        width: 35px;
        height: 35px;
        border-radius: 50%;
      }

      &-title {
        font-size: 14px;
        line-height: 22px;
        color: #000;
        opacity: 0.65;
      }

      &-time {
        font-size: 14px;
        line-height: 22px;
        color: #000;
        opacity: 0.45;
      }

      &-light {
        font-size: 14px;
        line-height: 22px;
        color: #000;
        opacity: 0.85;
      }

      &-cnte {
        background: #eef3fb;
        border-radius: 2px;
        opacity: 0.6;

        &__title {
          font-size: 14px;
          line-height: 22px;
          color: rgba(0, 0, 0, 0.85);
        }
      }
    }
  }
</style>
