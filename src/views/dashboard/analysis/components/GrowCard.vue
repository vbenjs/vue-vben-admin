<template>
  <div class="grow-card">
    <div class="grow-card-header">
      <div class="grow-card__info">
        <p class="grow-card__title">
          {{ info.title }}
        </p>
        <CountTo prefix="$" :startVal="1" :endVal="info.price" />
      </div>
      <img :src="info.icon" />
    </div>
    <div class="grow-card-footer" :class="{ 'is-up': info.up }">
      <Statistic :value="info.percent">
        <template #prefix>
          <img :src="info.up ? riseSvg : downSvg" />
        </template>
      </Statistic>
      <span class="grow-card__mom">{{ info.mom }}</span>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { Statistic } from 'ant-design-vue';
  import { CountTo } from '/@/components/CountTo/index';

  import riseSvg from '/@/assets/svg/dashboard/analysis-rise.svg';
  import downSvg from '/@/assets/svg/dashboard/analysis-down.svg';
  import { GrowCardItem } from '../types';

  export default defineComponent({
    components: { Statistic, CountTo },
    props: {
      info: {
        type: Object as PropType<GrowCardItem>,
        default: null,
      },
    },
    setup() {
      return {
        riseSvg,
        downSvg,
      };
    },
  });
</script>
<style lang="less">
  .grow-card {
    display: flex;
    width: calc(100% - 12px);
    height: 158px;
    padding: 16px 16px 12px 16px;
    // margin: 0 12px 12px 12px;
    cursor: pointer;
    background: @white;
    border-radius: 4px;
    box-shadow: 6px 6px 54px 0 rgba(0, 0, 0, 0.05);
    flex-direction: column;

    &:hover {
      box-shadow: 6px 6px 54px 0 rgba(0, 0, 0, 0.1);
    }

    &-header {
      display: flex;
      width: 100%;
      justify-content: space-between;
    }

    &__title {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      letter-spacing: 0;
      color: @text-color-base;
      opacity: 0.7;
    }

    &__info {
      span {
        font-family: NeoSans;
        font-size: 26px;
        line-height: 38px;
      }
    }

    &-footer {
      display: flex;
      width: 100%;
      margin-top: 24px;
      align-items: center;

      .ant-statistic-content-value {
        color: @error-color;
      }

      .ant-statistic-content-prefix svg {
        width: 0.98rem !important;
        height: 0.98rem !important;
      }

      &.is-up {
        .ant-statistic-content-value {
          color: @success-color;
        }
      }
    }

    &__mom {
      display: inline-block;
      padding-left: 10px;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      line-height: 22px;
      letter-spacing: 0;
      color: #606060;
    }
  }
</style>
