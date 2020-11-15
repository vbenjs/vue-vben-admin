<template>
  <div :class="prefixCls">
    <Row :class="`${prefixCls}-top`">
      <Col :span="9" :class="`${prefixCls}-col`">
        <Row>
          <Col :span="8">
            <div :class="`${prefixCls}-top__avatar`">
              <img width="70" :src="headerImg" />
              <span>Serati Ma</span>
              <div>海纳百川，有容乃大</div>
            </div>
          </Col>
          <Col :span="16">
            <div :class="`${prefixCls}-top__detail`">
              <template v-for="(detail, index) in details" :key="index">
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
        <CollapseContainer title="标签" :canExpan="false">
          <template v-for="(tag, index) in tags" :key="index">
            <Tag class="mb-2">{{ tag }}</Tag>
          </template>
        </CollapseContainer>
      </Col>
      <Col :span="8" :class="`${prefixCls}-col`">
        <CollapseContainer :class="`${prefixCls}-top__team`" title="团队" :canExpan="false">
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
            <component :is="item.component" />
          </TabPane>
        </template>
      </Tabs>
    </div>
  </div>
</template>

<script lang="ts">
  import { Row, Col, Tag, Tabs } from 'ant-design-vue';
  import { defineComponent } from 'vue';
  import { CollapseContainer } from '/@/components/Container/index';
  import Icon from '/@/components/Icon/index';
  import Article from './Article.vue';
  import Application from './Application.vue';
  import Project from './Project.vue';

  import headerImg from '/@/assets/images/header.jpg';
  import { tags, teams, details, achieveList } from './data';

  export default defineComponent({
    components: {
      CollapseContainer,
      Icon,
      Row,
      Col,
      Tag,
      Tabs,
      TabPane: Tabs.TabPane,
      Article,
      Application,
      Project,
    },
    setup() {
      return {
        prefixCls: 'account-center',
        headerImg,
        tags,
        teams,
        details,
        achieveList,
      };
    },
  });
</script>
<style lang="less" scoped>
  .account-center {
    &-col:not(:last-child) {
      padding: 0 10px;

      &:not(:last-child) {
        border-right: 1px dashed rgb(206, 206, 206, 0.5);
      }
    }

    &-top {
      padding: 10px;
      margin: 16px 16px 12px 16px;
      background: #fff;
      border-radius: 3px;

      &__avatar {
        text-align: center;

        img {
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
        padding-left: 20px;
        margin-top: 15px;
      }

      &__team {
        &-item {
          display: inline-block;
          padding: 4px 18px;
        }

        span {
          margin-left: 3px;
        }
      }
    }

    &-bottom {
      padding: 10px;
      margin: 0 16px 16px 16px;
      background: #fff;
      border-radius: 3px;
    }
  }
</style>
