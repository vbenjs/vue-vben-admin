<script lang="tsx">
  import { defineComponent, ref, unref } from 'compatible-vue';

  import { Alert, Skeleton } from 'ant-design-vue';

  import { LazyContainer } from '@/components/container/index';
  import TargetContent from './TargetContent.vue';

  export default defineComponent({
    name: 'LazyViewportDemo',
    setup() {
      const elRef = ref<any>(null);
      return () => (
        <div class="p-4 lazy-viewport-demo" ref={elRef}>
          <Alert
            message="特定视口示例"
            description="向下滚动到可见区域才会加载组件"
            type="info"
            show-icon
          />
          <div class="wrap ">
            <h1>向下滚动</h1>
            {unref(elRef) && (
              <LazyContainer
                viewport={unref(elRef)}
                onInit={() => {
                  console.log('加载完成');
                }}
              >
                <TargetContent class="content" />

                {
                  // 加载之前显示的骨架屏幕
                }
                <Skeleton slot="skeleton" rows={10} />
              </LazyContainer>
            )}
          </div>
        </div>
      );
    },
  });
</script>
<style lang="less" scoped>
  .lazy-viewport-demo {
    .wrap {
      width: 50%;
      height: 500px;
      padding: 30px;
      margin: 0 auto;
      margin-top: 20px;
      overflow: auto;
      text-align: center;
      background: #fff;

      .content {
        margin: 0 auto;
      }
    }

    h1 {
      height: 1300px;
      margin: 20px 0;
    }
  }
</style>
