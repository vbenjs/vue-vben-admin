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
            const { type, amount } = item;
            return (
              <Col
                key={index}
                xs={12}
                sm={6}
                class={[`${prefixCls}__item`, `${prefixCls}__item-${index}`]}
              >
                <div class={['img', `${prefixCls}__item-${index}-img`]} />
                <div>{amount}</div>
                <span>{type}</span>
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
    padding: 12px 4px 12px 12px;
    background: #fff;

    &__item {
      display: inline-block;
      width: calc(25% - 8px);
      padding: 20px 10px;
      margin-right: 8px;
      border-radius: 4px;

      span {
        font-size: 14px;
        line-height: 28px;
      }

      div {
        font-size: 26px;
      }

      .img {
        float: left;
        width: 62px;
        height: 62px;
      }

      &-0 {
        background: rgba(254, 97, 178, 0.1);

        &-img {
          background: url(~@/assets/images/dashboard/wokb/datashow1.png) no-repeat;
        }

        div {
          color: #fe61b2;
        }
      }

      &-1 {
        background: rgba(254, 163, 64, 0.1);

        &-img {
          background: url(~@/assets/images/dashboard/wokb/datashow2.png) no-repeat;
        }

        div {
          color: #fea340;
        }
      }

      &-2 {
        background: rgba(172, 70, 255, 0.1);

        &-img {
          background: url(~@/assets/images/dashboard/wokb/datashow3.png) no-repeat;
        }

        div {
          color: #9e55ff;
        }
      }

      &-3 {
        background: rgba(0, 196, 186, 0.1);

        &-img {
          background: url(~@/assets/images/dashboard/wokb/datashow4.png) no-repeat;
        }

        div {
          color: #00c4ba;
        }
      }
    }
  }
</style>
