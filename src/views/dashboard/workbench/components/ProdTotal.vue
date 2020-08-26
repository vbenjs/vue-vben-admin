<script lang="tsx">
  import { defineComponent, computed, unref } from 'compatible-vue';
  import { Row, Col } from 'ant-design-vue';
  import { useDesign } from '@/hooks/core/useDesign';
  import { wokbStore } from '../store';
  // import {ProdTypeEnum} from '@/api/dashboard/model/wokbModel'
  export default defineComponent({
    name: 'ProdTotal',
    setup() {
      const { prefixCls } = useDesign('prod-total');
      const getProdList = computed(() => {
        return wokbStore.getProdList;
      });

      return () => (
        <Row class={prefixCls}>
          {unref(getProdList).map((item, index) => {
            return (
              <Col key={index} xs={12} sm={6} class={`${prefixCls}__item`}>
                <div class={[`${prefixCls}__item-label`, `${prefixCls}__item-label--${index}`]}>
                  {item.type}
                </div>
                <div class={`${prefixCls}__item-value`}>{item.amount}</div>
              </Col>
            );
          })}
        </Row>
      );
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-prod-total';
  .@{prefix-cls} {
    padding: 24px;
    background: #fff;

    // &__item:first-of-type {
    //   color: red;

    //   &::after {
    //     display: inline-block;
    //     width: 1px;
    //     height: 100%;
    //     background: #000;
    //     content: '';
    //     opacity: 0.09;
    //   }
    // }

    &__item {
      &-label {
        font-size: 14px;
        line-height: 22px;
        color: #1c1d21;

        &::before {
          display: inline-block;
          width: 6px;
          height: 6px;
          margin-right: 8px;
          vertical-align: 2px;
          border-radius: 50%;
          content: '';
        }

        &--0 {
          &::before {
            display: none;
          }
        }

        &--1 {
          &::before {
            background: #1c1d21;
            opacity: 0.45;
          }
        }

        &--2 {
          &::before {
            background: #0593ff;
          }
        }

        &--3 {
          &::before {
            background: #ed6f6f;
          }
        }
      }

      &-value {
        font-size: 30px;
        line-height: 38px;
        color: #1c1d21;
      }
    }
  }
</style>
