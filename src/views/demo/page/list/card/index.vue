<template>
  <PageWrapper :class="prefixCls" title="卡片列表">
    <template #headerContent>
      基于Vue Next, TypeScript, Ant Design Vue实现的一套完整的企业级后台管理系统。
      <div :class="`${prefixCls}__link`">
        <a><Icon icon="bx:bx-paper-plane" color="#1890ff" /><span>开始</span></a>
        <a><Icon icon="carbon:warning" color="#1890ff" /><span>简介</span></a>
        <a><Icon icon="ion:document-text-outline" color="#1890ff" /><span>文档</span></a>
      </div>
    </template>

    <div :class="`${prefixCls}__content`">
      <List>
        <Row :gutter="16">
          <template v-for="item in cardList" :key="item.title">
            <Col :span="6">
              <List.Item>
                <Card :hoverable="true" :class="`${prefixCls}__card`">
                  <div :class="`${prefixCls}__card-title`">
                    <Icon class="icon" v-if="item.icon" :icon="item.icon" :color="item.color" />
                    {{ item.title }}
                  </div>
                  <div :class="`${prefixCls}__card-detail`">
                    基于Vue Next, TypeScript, Ant Design Vue实现的一套完整的企业级后台管理系统
                  </div>
                </Card>
              </List.Item>
            </Col>
          </template>
        </Row>
      </List>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import Icon from '@/components/Icon/Icon.vue';
  import { cardList } from './data';
  import { PageWrapper } from '@/components/Page';
  import { Card, Row, Col, List } from 'ant-design-vue';

  const prefixCls = 'list-card';
</script>
<style lang="less" scoped>
  .list-card {
    &__link {
      margin-top: 10px;
      font-size: 14px;

      a {
        margin-right: 30px;
      }

      span {
        margin-left: 5px;
      }
    }

    &__card {
      width: 100%;
      margin-bottom: -8px;

      .ant-card-body {
        padding: 16px;
      }

      &-title {
        margin-bottom: 5px;
        color: @text-color-base;
        font-size: 16px;
        font-weight: 500;

        .icon {
          margin-top: -5px;
          margin-right: 10px;
          font-size: 38px !important;
        }
      }

      &-detail {
        padding-top: 10px;
        padding-left: 30px;
        color: @text-color-secondary;
        font-size: 14px;
      }
    }
  }
</style>
