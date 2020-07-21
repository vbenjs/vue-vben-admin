<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { VirtualScroll } from '@/components/virtual-scroll/index';

  import { Divider } from 'ant-design-vue';

  const data: any[] = (() => {
    const arr: any[] = [];
    for (let index = 1; index < 10000; index++) {
      arr.push({
        title: '列表项' + index,
      });
    }
    return arr;
  })();
  export default defineComponent({
    name: 'VirtualScrollDemo',
    setup() {
      return () => (
        <div class="p-4 virtual-scroll-demo">
          <Divider>基础滚动示例</Divider>
          <div class="virtual-scroll-demo-wrap">
            <VirtualScroll
              itemHeight={41}
              items={data}
              height={300}
              width={300}
              scopedSlots={{
                default: ({ item }) => {
                  return <div class="virtual-scroll-demo__item">{item.title}</div>;
                },
              }}
            ></VirtualScroll>
          </div>
          <Divider>即使不可见，也预先加载30条数据，防止空白</Divider>

          <div class="virtual-scroll-demo-wrap">
            <VirtualScroll
              itemHeight={41}
              items={data}
              bench={30}
              height={300}
              width={300}
              scopedSlots={{
                default: ({ item }) => {
                  return <div class="virtual-scroll-demo__item">{item.title}</div>;
                },
              }}
            ></VirtualScroll>
          </div>
        </div>
      );
    },
  });
</script>
<style lang="less" scoped>
  .virtual-scroll-demo {
    &-wrap {
      display: flex;
      margin: 0 30%;
      background: #fff;
      justify-content: center;
    }

    /deep/ &__item {
      height: 40px;
      padding: 0 20px;
      line-height: 40px;
      border-bottom: 1px solid #ddd;
    }
  }
</style>
