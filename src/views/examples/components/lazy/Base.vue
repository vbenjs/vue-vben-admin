<script lang="tsx">
  import { defineComponent } from 'compatible-vue';

  import { Alert, Skeleton } from 'ant-design-vue';
  import TargetContent from './TargetContent.vue';
  import { LazyContainer } from '@/components/container/index';
  export default defineComponent({
    name: 'LazyBaseDemo',
    setup() {
      return () => (
        <div class="p-4 lazy-base-demo">
          <Alert
            message="基础示例"
            description="向下滚动到可见区域才会加载组件"
            type="info"
            show-icon
          />
          <div class="lazy-base-demo-wrap">
            <h1>向下滚动</h1>
            <LazyContainer
              onInit={() => {
                console.log('加载完成');
              }}
            >
              <TargetContent />
              {
                // 加载之前显示的骨架屏幕
              }
              <Skeleton slot="skeleton" rows={10} />
            </LazyContainer>
          </div>
        </div>
      );
    },
  });
</script>
<style lang="less" scoped>
  .lazy-base-demo {
    &-wrap {
      display: flex;
      width: 50%;
      height: 2000px;
      margin: 20px auto;
      text-align: center;
      background: #fff;
      justify-content: center;
      flex-direction: column;
      align-items: center;
    }

    h1 {
      height: 1300px;
      margin: 20px 0;
    }
  }
</style>
