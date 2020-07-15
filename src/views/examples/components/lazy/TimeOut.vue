<script lang="tsx">
  import { defineComponent } from 'compatible-vue';

  import { Alert, Skeleton } from 'ant-design-vue';

  import { LazyContainer } from '@/components/container/index';
  import TargetContent from './TargetContent.vue';

  export default defineComponent({
    name: 'LazyTimeOutDemo',
    setup() {
      return () => (
        <div class="p-4 lazy-timeout-demo">
          <Alert
            message="延时加载示例"
            description="不过是否可见,都会在1秒后加载"
            type="info"
            show-icon
            class="my-5"
          />
          <LazyContainer
            timeout={1000}
            onInit={() => {
              console.log('加载完成');
            }}
          >
            <div class="lazy-timeout-demo-wrap">
              <TargetContent />
            </div>
            {
              // 加载之前显示的骨架屏幕
            }
            <Skeleton slot="skeleton" rows={10} />
          </LazyContainer>
        </div>
      );
    },
  });
</script>
<style lang="less" scoped>
  .lazy-timeout-demo {
    &-wrap {
      display: flex;
      width: 100%;
      height: 400px;
      padding: 20px;
      background: #fff;
      justify-content: center;
    }
  }
</style>
