<template>
  <div :class="prefixCls">
    <Row :class="`${prefixCls}-top`">
      <Col :span="9" :class="`${prefixCls}-col`">
        <Row>
          <Col :span="8">
            <div :class="`${prefixCls}-top__avatar`">
              <img width="70" :src="avatar" />
              <span>Vben</span>
              <div>海纳百川，有容乃大</div>
            </div>
          </Col>
          <Col :span="16">
            <div :class="`${prefixCls}-top__detail`">
              <template v-for="detail in details" :key="detail.title">
                <p>
                  <Icon :icon="detail.icon" />
                  {{ detail.title }}
                </p>
              </template>
            </div>
          </Col>
        </Row>
      </Col>
      <Col :span="7" :class="`${prefixCls}-col`">
        <CollapseContainer title="标签" :canExpand="false">
          <template v-for="tag in tags" :key="tag">
            <Tag class="mb-2">
              {{ tag }}
            </Tag>
          </template>
        </CollapseContainer>
      </Col>
      <Col :span="8" :class="`${prefixCls}-col`">
        <CollapseContainer :class="`${prefixCls}-top__team`" title="团队" :canExpand="false">
          <div v-for="(team, index) in teams" :key="index" :class="`${prefixCls}-top__team-item`">
            <Icon :icon="team.icon" :color="team.color" />
            <span>{{ team.title }}</span>
          </div>
        </CollapseContainer>
      </Col>
    </Row>
    <div :class="`${prefixCls}-bottom`">
      <Tabs>
        <template v-for="item in achieveList" :key="item.key">
          <TabPane :tab="item.name">
            <component :is="tabs[item.component]" />
          </TabPane>
        </template>
      </Tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { CollapseContainer } from '@/components/Container';
  import Icon from '@/components/Icon/Icon.vue';
  import { Col, Row, Tabs, Tag } from 'ant-design-vue';
  import { computed } from 'vue';
  import Application from './Application.vue';
  import Article from './Article.vue';
  import Project from './Project.vue';

  import headerImg from '@/assets/images/header.jpg';
  import { useUserStore } from '@/store/modules/user';
  import { achieveList, details, tags, teams } from './data';

  const userStore = useUserStore();
  const TabPane = Tabs.TabPane;
  const tabs = {
    Article,
    Application,
    Project,
  };
  const prefixCls = 'account-center';
  const avatar = computed(() => userStore.getUserInfo.avatar || headerImg);
</script>
<style lang="less" scoped>
  .account-center {
    &-col:not(:last-child) {
      padding: 0 10px;

      &:not(:last-child) {
        border-right: 1px dashed rgb(206 206 206 / 50%);
      }
    }

    &-top {
      margin: 16px 16px 12px;
      padding: 10px;
      border-radius: 3px;
      background-color: @component-background;

      &__avatar {
        text-align: center;

        img {
          margin: auto;
          border-radius: 50%;
        }

        span {
          display: block;
          font-size: 20px;
          font-weight: 500;
        }

        div {
          margin-top: 3px;
          font-size: 12px;
        }
      }

      &__detail {
        margin-top: 15px;
        padding-left: 20px;
      }

      &__team {
        &-item {
          display: inline-block;
          padding: 4px 24px;
        }

        span {
          margin-left: 3px;
        }
      }
    }

    &-bottom {
      margin: 0 16px 16px;
      padding: 10px;
      border-radius: 3px;
      background-color: @component-background;
    }
  }
</style>
