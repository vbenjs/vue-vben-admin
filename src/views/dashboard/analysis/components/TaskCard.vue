<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}-header`">
      <div :class="`${prefixCls}__info`">
        <span :class="`${prefixCls}__title`">{{ info.title }}</span>
        <span :class="`${prefixCls}__desc`">{{ info.desc }}</span>
      </div>
      <span :class="`${prefixCls}__tag ${info.status}`">{{ info.text }}</span>
    </div>

    <div :class="`${prefixCls}-body mt-5`">
      <div :class="`${prefixCls}__process-nfo`">
        <span>进度</span>
        <span>{{ info.percent }}%</span>
      </div>
      <Progress :percent="info.percent" :showInfo="false" :status="info.status" />
    </div>
    <div :class="`${prefixCls}-footer`">
      <span :class="`${prefixCls}__date`">
        更新日期: <span>{{ info.updateTime }}</span>
      </span>
      <div :class="`${prefixCls}__avatar`">
        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        <Avatar>+3</Avatar>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, PropType } from 'vue';
  import { Progress, Avatar } from 'ant-design-vue';

  import { TaskItem } from '../types';

  export default defineComponent({
    name: 'GrowCard',
    components: { Progress, Avatar },
    props: {
      info: {
        type: Object as PropType<TaskItem>,
        default: null,
      },
    },
    setup(props) {
      return {
        prefixCls: 'task-card',
        text: computed(() => {
          const { status } = props.info || {};
          return status === 'active'
            ? '进度正常'
            : status === 'exception'
            ? '进度滞后'
            : '项目完成';
        }),
      };
    },
  });
</script>
<style lang="less" scoped>
  .task-card {
    display: flex;
    width: calc(100% - 24px);
    height: 199px;
    padding: 24px 20px 12px 16px;
    margin: 0 12px 12px 12px;
    background: #fff;
    border: 1px solid #ececf2;
    border-radius: 12px;
    flex-direction: column;

    &-header {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
    }

    &__tag {
      display: inline-block;
      padding: 4px 6px;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      border-radius: 6px;

      &.success {
        color: #55d187;
        background: rgba(85, 209, 135, 0.16);
      }

      &.warn {
        color: #ffa07d;
        background: #ffd16416;
      }

      &.done {
        color: #0593ff;
        background: #0593ff16;
      }
    }

    &__info {
      display: flex;
      flex-direction: column;
    }

    &__title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      line-height: 24px;
      color: rgba(0, 0, 0, 0.85);
    }

    &__desc {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      line-height: 21px;
      color: #8181a5;
    }

    &__process-nfo {
      display: flex;
      justify-content: space-between;

      span {
        font-size: 14px;
        line-height: 21px;
        color: #8181a5;
      }
    }

    &-footer {
      display: flex;
      width: 100%;
      margin-top: 16px;
      align-items: center;
      justify-content: space-between;
    }

    &__date {
      font-size: 12px;
      line-height: 21px;
      color: #2c3a61;

      span {
        color: #7c8087;
      }
    }

    &__avatar {
      display: flex;
    }
  }
</style>
