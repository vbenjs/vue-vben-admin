<script lang="tsx">
  import { defineComponent } from 'compatible-vue';

  import { Alert, Skeleton } from 'ant-design-vue';

  import { LazyContainer } from '@/components/container/index';
  import TargetContent from './TargetContent.vue';

  export default defineComponent({
    name: 'LazyTransitionDemo',
    setup() {
      return () => (
        <div class="p-4 lazy-timeout-demo">
          <Alert
            message="自定义过度动画示例"
            description="替换组件内部的过渡动画"
            type="info"
            show-icon
          />
          <LazyContainer
            class="custom-lazy"
            transitionName="custom"
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
      height: 400px;
      padding: 20px;
      margin-top: 20px;
      background: #fff;
      justify-content: center;
    }

    /deep/ .custom-lazy {
      .custom-enter {
        opacity: 0;
        transform: scale(0.4) translate(100%);
      }

      .custom-enter-to {
        opacity: 1;
      }

      .custom-enter-active {
        position: absolute;
        top: 0;
        width: 100%;
        transition: all 0.5s;
      }

      .custom-leave {
        opacity: 1;
      }

      .custom-leave-to {
        opacity: 0;
        transform: scale(0.4) translate(-100%);
      }

      .custom-leave-active {
        transition: all 0.5s;
      }
    }
  }
</style>
