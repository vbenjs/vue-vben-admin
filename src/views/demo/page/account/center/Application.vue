<template>
  <List :class="prefixCls">
    <Row :gutter="16">
      <template v-for="item in applicationList" :key="item.title">
        <Col :span="6">
          <ListItem>
            <Card :hoverable="true" :class="`${prefixCls}__card`">
              <div :class="`${prefixCls}__card-title`">
                <Icon class="icon" v-if="item.icon" :icon="item.icon" :color="item.color" />
                {{ item.title }}
              </div>
              <div :class="`${prefixCls}__card-num`">
                活跃用户：<span>{{ item.active }}</span> 万
              </div>
              <div :class="`${prefixCls}__card-num`">
                新增用户：<span>{{ item.new }}</span>
              </div>
              <Icon
                :class="`${prefixCls}__card-download`"
                v-if="item.download"
                :icon="item.download"
              />
            </Card>
          </ListItem>
        </Col>
      </template>
    </Row>
  </List>
</template>
<script lang="ts" setup>
  import { List, Card, Row, Col } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { applicationList } from './data';

  const ListItem = List.Item;

  const prefixCls = 'account-center-application';
</script>
<style lang="less">
  .account-center-application {
    &__card {
      width: 100%;
      margin-bottom: -12px;

      .ant-card-body {
        padding: 16px;
      }

      &-title {
        margin-bottom: 5px;
        font-size: 16px;
        font-weight: 500;

        .icon {
          margin-top: -5px;
          font-size: 22px;
        }
      }

      &-num {
        margin-left: 24px;
        color: @text-color-secondary;
        line-height: 36px;

        span {
          margin-left: 5px;
          font-size: 18px;
        }
      }

      &-download {
        float: right;
        color: @primary-color;
        font-size: 20px !important;
      }
    }
  }
</style>
