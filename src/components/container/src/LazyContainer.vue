<script lang="tsx">
  import {
    defineComponent,
    PropOptions,
    reactive,
    onMounted,
    ref,
    unref,
    onUnmounted,
  } from 'compatible-vue';

  import { Skeleton } from 'ant-design-vue';
  import { useRaf } from '@/hooks/event/useRaf';
  import { useTimeout } from '@/hooks/core/useTimeout';
  import { getSlot } from '@/utils/helper/tsxHelper';

  interface State {
    isInit: boolean;
    loading: boolean;
    intersectionObserverInstance: IntersectionObserver | null;
  }
  export default defineComponent({
    name: 'LazyContainer',
    props: {
      // 等待时间，如果指定了时间，不论可见与否，在指定时间之后自动加载
      timeout: {
        type: Number,
        // default: 8000,
      } as PropOptions<number>,
      // 组件所在的视口，如果组件是在页面容器内滚动，视口就是该容器
      viewport: {
        type: typeof window !== 'undefined' ? window.HTMLElement : Object,
        default: () => null,
      } as PropOptions<HTMLElement>,
      // 预加载阈值, css单位
      threshold: {
        type: String,
        default: '0px',
      } as PropOptions<string>,

      // 视口的滚动方向, vertical代表垂直方向，horizontal代表水平方向
      direction: {
        type: String,
        default: 'vertical',
      } as PropOptions<'vertical' | 'horizontal'>,
      // 包裹组件的外层容器的标签名
      tag: {
        type: String,
        default: 'div',
      } as PropOptions<string>,

      maxWaitingTime: {
        type: Number,
        default: 80,
      } as PropOptions<number>,

      // 是否在不可见的时候销毁
      autoDestory: {
        type: Boolean,
        default: false,
      } as PropOptions<boolean>,

      // transition 动画name
      transitionName: {
        tpye: String,
        default: 'lazy-container',
      } as PropOptions<string>,
    },
    setup(props, { listeners, emit, slots }) {
      const elRef = ref<any>(null);
      const state = reactive<State>({
        isInit: false,
        loading: false,
        intersectionObserverInstance: null,
      });

      // 如果有设置延时时间，则立即执行
      function immediateInit() {
        const { timeout } = props;
        timeout &&
          useTimeout(() => {
            init();
          }, timeout);
      }

      function init() {
        // 此时说明骨架组件即将被切换
        emit('beforeInit');
        // 此时可以准备加载懒加载组件的资源
        state.loading = true;

        requestAnimationFrameFn(() => {
          state.isInit = true;
          emit('init');
        });
      }
      function requestAnimationFrameFn(callback: () => any) {
        // 防止等待太久没有执行回调
        // 设置最大等待时间
        useTimeout(() => {
          if (state.isInit) {
            return;
          }
          callback();
        }, props.maxWaitingTime || 80);

        const { requestAnimationFrame } = useRaf();

        return requestAnimationFrame;
      }
      function initIntersectionObserver() {
        const { timeout, direction, threshold, viewport } = props;
        if (timeout) {
          return;
        }
        // 根据滚动方向来构造视口外边距，用于提前加载
        let rootMargin;
        switch (direction) {
          case 'vertical':
            rootMargin = `${threshold} 0px`;
            break;
          case 'horizontal':
            rootMargin = `0px ${threshold}`;
            break;
        }
        try {
          // 观察视口与组件容器的交叉情况
          state.intersectionObserverInstance = new window.IntersectionObserver(
            intersectionHandler,
            {
              rootMargin,
              root: viewport,
              threshold: [0, Number.MIN_VALUE, 0.01],
            }
          );

          const el = unref(elRef);

          state.intersectionObserverInstance.observe(el.$el);
        } catch (e) {
          init();
        }
      }
      // 交叉情况变化处理函数
      function intersectionHandler(entries) {
        const isIntersecting = entries[0].isIntersecting || entries[0].intersectionRatio;
        if (isIntersecting) {
          init();
          if (state.intersectionObserverInstance) {
            const el = unref(elRef);
            state.intersectionObserverInstance.unobserve(el.$el);
          }
        }
        // else {
        //   const { autoDestory } = props;
        //   autoDestory && destory();
        // }
      }
      // function destory() {
      //   emit('beforeDestory');
      //   state.loading = false;
      //   nextTick(() => {
      //     emit('destory');
      //   });
      // }

      immediateInit();
      onMounted(() => {
        initIntersectionObserver();
      });
      onUnmounted(() => {
        // 在组件销毁前取消观察
        if (state.intersectionObserverInstance) {
          const el = unref(elRef);
          state.intersectionObserverInstance.unobserve(el.$el);
        }
      });

      function renderContent() {
        const { isInit, loading } = state;
        if (isInit) {
          return <div key="component">{getSlot(slots, 'default', { loading })}</div>;
        }
        if (slots.skeleton) {
          return <div key="skeleton">{getSlot(slots, 'skeleton') || <Skeleton />}</div>;
        }
        return null;
      }
      return () => {
        const { tag, transitionName } = props;
        return (
          <transition-group
            ref={elRef}
            name={transitionName}
            style={{ position: 'relative' }}
            tag={tag}
            on={listeners}
          >
            {renderContent()}
          </transition-group>
        );
      };
    },
  });
</script>
<style scoped>
  .lazy-container-enter {
    opacity: 0;
  }

  .lazy-container-enter-to {
    opacity: 1;
  }

  .lazy-container-enter-active {
    position: absolute;
    top: 0;
    width: 100%;
    transition: opacity 0.3s 0.2s;
  }

  .lazy-container-leave {
    opacity: 1;
  }

  .lazy-container-leave-to {
    opacity: 0;
  }

  .lazy-container-leave-active {
    transition: opacity 0.5s;
  }
</style>
