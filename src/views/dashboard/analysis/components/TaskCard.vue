<script lang="tsx">
  import { defineComponent, PropOptions } from 'compatible-vue';
  // import { SvgIcon } from '@/components/icon/index';
  import { Progress, Avatar } from 'ant-design-vue';

  import { useDesign } from '@/hooks/core/useDesign';

  import { GrowCardItem } from '../types';

  // interface Props {
  //   info: GrowCardItem;
  // }
  export default defineComponent({
    name: 'GrowCard',
    props: {
      info: {
        type: Object,
        default: null,
      } as PropOptions<GrowCardItem>,
    },
    setup() {
      const { prefixCls } = useDesign('grow-card');

      return () => {
        return (
          <div class={prefixCls}>
            <div class={`${prefixCls}-header`}>
              <div class={`${prefixCls}__info`}>
                <span class={`${prefixCls}__title`}>开发任务</span>
                <span class={`${prefixCls}__desc`}>任务简介</span>
              </div>
              <span class={[`${prefixCls}__tag`, 'green']}>进度正常</span>
            </div>

            <div class={[`${prefixCls}-body`, 'mt-5']}>
              <div class={`${prefixCls}__process-nfo`}>
                <span>进度</span>
                <span>70%</span>
              </div>
              <Progress percent={70} showInfo={false} />
            </div>
            <div class={[`${prefixCls}-footer`]}>
              <span class={`${prefixCls}__date`}>
                更新日期: <span>2020.7.12</span>
              </span>
              <div class={`${prefixCls}__avatar`}>
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                <Avatar>+3</Avatar>
              </div>
            </div>
          </div>
        );
      };
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-grow-card';
  .@{prefix-cls} {
    display: flex;
    width: calc(100% - 24px);
    height: 203px;
    padding: 24px 20px 12px 16px;
    margin: 0 12px 12px 12px;
    background: @white;
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
      color: #55d187;
      background: rgba(85, 209, 135, 0.16);
      border-radius: 6px;
    }

    &__info {
      display: flex;
      flex-direction: column;
    }

    &__title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      line-height: 24px;
      color: #2c3a61;
    }

    &__desc {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      line-height: 21px;
      color: #8181a5;
    }

    // &-body {
    // }
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
