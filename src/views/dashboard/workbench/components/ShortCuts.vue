<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { Row, Col, Icon } from 'ant-design-vue';
  import { CollapseContainer } from '@/components/container/index';

  import { useDesign } from '@/hooks/core/useDesign';
  import wokbImg1 from '@/assets/images/dashboard/wokb/attendance.png';
  import wokbImg2 from '@/assets/images/dashboard/wokb/overtime.png';
  import wokbImg3 from '@/assets/images/dashboard/wokb/meal.png';
  import wokbImg4 from '@/assets/images/dashboard/wokb/leave.png';
  import wokbImg5 from '@/assets/images/dashboard/wokb/stamp.png';
  import wokbImg6 from '@/assets/images/dashboard/wokb/travel.png';
  import wokbImg7 from '@/assets/images/dashboard/wokb/performance.png';
  import wokbImg8 from '@/assets/images/dashboard/wokb/approve.png';
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
        <CollapseContainer class={prefixCls} title="快捷入口" canExpan={false}>
          <a-button slot="action" size="small" type="link">
            新建
          </a-button>
          <Row>
            {shortCuts.map((item, index) => {
              const { img, name } = item;
              return (
                <Col key={index} span={8} class={[`${prefixCls}__item`, 'p-3']}>
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
        cursor: pointer;
        background: lightgrey;
        border-radius: 50%;
      }
    }
  }
</style>
