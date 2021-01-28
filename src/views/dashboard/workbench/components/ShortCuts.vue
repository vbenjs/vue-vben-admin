<template>
  <CollapseContainer class="shortcuts" title="快捷入口" :canExpan="false">
    <template #action>
      <a-button size="small" type="link"> 新建 </a-button>
    </template>
    <a-row>
      <template v-for="item in shortCuts" :key="item.img">
        <a-col :span="8" class="p-3 shortcuts__item">
          <img :src="item.img" class="mb-2 shortcuts__item-img" />
          <br />
          <span>{{ item.name }}</span>
        </a-col>
      </template>

      <a-col :span="8" class="p-3 shortcuts__item">
        <span class="mb-2 shortcuts__item-all">
          <RightOutlined />
        </span>
        <br />
        <span>查看全部</span>
      </a-col>
    </a-row>
  </CollapseContainer>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Row, Col } from 'ant-design-vue';
  import { CollapseContainer } from '/@/components/Container/index';

  import { RightOutlined } from '@ant-design/icons-vue';
  import wokbImg1 from '/@/assets/images/dashboard/wokb/attendance.png';
  import wokbImg2 from '/@/assets/images/dashboard/wokb/overtime.png';
  import wokbImg3 from '/@/assets/images/dashboard/wokb/meal.png';
  import wokbImg4 from '/@/assets/images/dashboard/wokb/leave.png';
  import wokbImg5 from '/@/assets/images/dashboard/wokb/stamp.png';
  import wokbImg6 from '/@/assets/images/dashboard/wokb/travel.png';
  import wokbImg7 from '/@/assets/images/dashboard/wokb/performance.png';
  import wokbImg8 from '/@/assets/images/dashboard/wokb/approve.png';
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
  export default defineComponent({
    components: { [Row.name]: Row, [Col.name]: Col, CollapseContainer, RightOutlined },
    setup() {
      return { shortCuts };
    },
  });
</script>
<style lang="less" scoped>
  .shortcuts {
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
