<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { Row, Col, Icon, Button } from 'ant-design-vue';
  import { CollapseContainer } from '@/components/container/index';

  import { useDesign } from '@/hooks/core/useDesign';
  import wokbImg1 from '@/assets/images/dashboard/wokb/考勤@2x.png';
  import wokbImg2 from '@/assets/images/dashboard/wokb/加班@2x.png';
  import wokbImg3 from '@/assets/images/dashboard/wokb/餐补@2x.png';
  import wokbImg4 from '@/assets/images/dashboard/wokb/请假@2x.png';
  import wokbImg5 from '@/assets/images/dashboard/wokb/用章@2x.png';
  import wokbImg6 from '@/assets/images/dashboard/wokb/差旅@2x.png';
  import wokbImg7 from '@/assets/images/dashboard/wokb/绩效@2x.png';
  import wokbImg8 from '@/assets/images/dashboard/wokb/审批@2x.png';
  export default defineComponent({
    name: 'ShortCuts',
    setup() {
      const { prefixCls } = useDesign('shortcuts');
      const shortCuts = [
        {
          img: wokbImg1,
          name: '考勤记录',
        },
        {
          img: wokbImg2,
          name: '加班申请',
        },
        {
          img: wokbImg3,
          name: '餐补申请',
        },
        {
          img: wokbImg4,
          name: '请假',
        },
        {
          img: wokbImg5,
          name: '用章申请',
        },
        {
          img: wokbImg6,
          name: '差旅报销',
        },
        {
          img: wokbImg7,
          name: '绩效申请',
        },
        {
          img: wokbImg8,
          name: '审批',
        },
      ];

      return () => (
        // <div class={prefixCls}>ellipsis
        <CollapseContainer class={prefixCls} title="快捷入口" canExpan={false}>
          <Button slot="action" size="small">
            新建
          </Button>
          <Row>
            {shortCuts.map((item) => {
              const { img, name } = item;
              return (
                <Col span={8} class={[`${prefixCls}__item`, 'p-3']}>
                  <img src={img} class={[`${prefixCls}__item-img`, 'mb-2']} />
                  <br />
                  <span>{name}</span>
                </Col>
              );
            })}
            <Col span={8} class={[`${prefixCls}__item`, 'p-3']}>
              <span class={[`${prefixCls}__item-all`, 'mb-2']}>
                <Icon type="right" />
              </span>
              <br />
              <span>查看全部</span>
            </Col>
          </Row>
        </CollapseContainer>
        // </div>
      );
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-shortcuts';
  .@{prefix-cls} {
    &__item {
      text-align: center;

      &-img {
        width: 36px;
      }

      &-all {
        display: inline-block;
        width: 36px;
        height: 36px;
        line-height: 36px;
        color: #000;
        background: lightgrey;
        border-radius: 50%;
      }
    }
  }
</style>
