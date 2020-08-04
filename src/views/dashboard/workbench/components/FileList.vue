<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { CollapseContainer } from '@/components/container/index';

  import { useDesign } from '@/hooks/core/useDesign';

  import { ApexCharts } from '@/components/charts/index';
  export default defineComponent({
    name: 'FileList',
    setup() {
      const { prefixCls } = useDesign('file-list');

      const chartOptions = {
        chart: {
          height: 450,
          type: 'rangeBar',
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '80%',
          },
        },
        xaxis: {
          type: 'datetime',
        },
        stroke: {
          width: 1,
        },
        fill: {
          type: 'solid',
          opacity: 0.6,
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
        },
      };

      const series = [
        {
          name: 'Bob',
          data: [
            {
              x: 'Design',
              y: [new Date('2019-03-05').getTime(), new Date('2019-03-08').getTime()],
            },
            {
              x: 'Code',
              y: [new Date('2019-03-02').getTime(), new Date('2019-03-05').getTime()],
            },
            {
              x: 'Code',
              y: [new Date('2019-03-05').getTime(), new Date('2019-03-07').getTime()],
            },
            {
              x: 'Test',
              y: [new Date('2019-03-03').getTime(), new Date('2019-03-09').getTime()],
            },
            {
              x: 'Test',
              y: [new Date('2019-03-08').getTime(), new Date('2019-03-11').getTime()],
            },
            {
              x: 'Validation',
              y: [new Date('2019-03-11').getTime(), new Date('2019-03-16').getTime()],
            },
            {
              x: 'Design',
              y: [new Date('2019-03-01').getTime(), new Date('2019-03-03').getTime()],
            },
          ],
        },
        {
          name: 'Joe',
          data: [
            {
              x: 'Design',
              y: [new Date('2019-03-02').getTime(), new Date('2019-03-05').getTime()],
            },
            {
              x: 'Test',
              y: [new Date('2019-03-06').getTime(), new Date('2019-03-16').getTime()],
            },
            {
              x: 'Code',
              y: [new Date('2019-03-03').getTime(), new Date('2019-03-07').getTime()],
            },
            {
              x: 'Deployment',
              y: [new Date('2019-03-20').getTime(), new Date('2019-03-22').getTime()],
            },
            {
              x: 'Design',
              y: [new Date('2019-03-10').getTime(), new Date('2019-03-16').getTime()],
            },
          ],
        },
        {
          name: 'Dan',
          data: [
            {
              x: 'Code',
              y: [new Date('2019-03-10').getTime(), new Date('2019-03-17').getTime()],
            },
            {
              x: 'Validation',
              y: [new Date('2019-03-05').getTime(), new Date('2019-03-09').getTime()],
            },
          ],
        },
      ];
      return () => (
        // <div class={prefixCls}>
        <CollapseContainer class={prefixCls} title="分析" canExpan={false}>
          <ApexCharts
            type="rangeBar"
            height="350"
            class="mt-10 mb-10"
            options={chartOptions}
            series={series}
          ></ApexCharts>
        </CollapseContainer>
        // </div>
      );
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-file-list';
  .@{prefix-cls} {
    /deep/ .@{namespace}-collapse-container__body {
      height: 360px;
    }
  }
</style>
