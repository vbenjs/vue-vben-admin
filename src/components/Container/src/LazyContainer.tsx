import type { PropType } from 'vue';

import {
  defineComponent,
  reactive,
  onMounted,
  ref,
  unref,
  onUnmounted,
  TransitionGroup,
} from 'vue';

import { Skeleton } from 'ant-design-vue';
import { useRaf } from '/@/hooks/event/useRaf';
import { useTimeout } from '/@/hooks/core/useTimeout';
import { getListeners, getSlot } from '/@/utils/helper/tsxHelper';

import './LazyContainer.less';

interface State {
  isInit: boolean;
  loading: boolean;
  intersectionObserverInstance: IntersectionObserver | null;
}
export default defineComponent({
  name: 'LazyContainer',
  emits: ['before-init', 'init'],
  props: {
    // 等待时间，如果指定了时间，不论可见与否，在指定时间之后自动加载
    timeout: {
      type: Number as PropType<number>,
      default: 8000,
      // default: 8000,
    },
    // 组件所在的视口，如果组件是在页面容器内滚动，视口就是该容器
    viewport: {
      type: (typeof window !== 'undefined' ? window.HTMLElement : Object) as PropType<HTMLElement>,
      default: () => null,
    },
    // 预加载阈值, css单位
    threshold: {
      type: String as PropType<string>,
      default: '0px',
    },

    // 视口的滚动方向, vertical代表垂直方向，horizontal代表水平方向
    direction: {
      type: String as PropType<'vertical' | 'horizontal'>,
      default: 'vertical',
    },
    // 包裹组件的外层容器的标签名
    tag: {
      type: String as PropType<string>,
      default: 'div',
    },

    maxWaitingTime: {
      type: Number as PropType<number>,
      default: 80,
    },

    // 是否在不可见的时候销毁
    autoDestory: {
      type: Boolean as PropType<boolean>,
      default: false,
    },

    // transition name
    transitionName: {
      type: String as PropType<string>,
      default: 'lazy-container',
    },
  },
  setup(props, { attrs, emit, slots }) {
    const elRef = ref<any>(null);
    const state = reactive<State>({
      isInit: false,
      loading: false,
      intersectionObserverInstance: null,
    });

    // If there is a set delay time, it will be executed immediately
    function immediateInit() {
      const { timeout } = props;
      timeout &&
        useTimeout(() => {
          init();
        }, timeout);
    }

    function init() {
      // At this point, the skeleton component is about to be switched
      emit('before-init');
      // At this point you can prepare to load the resources of the lazy-loaded component
      state.loading = true;

      requestAnimationFrameFn(() => {
        state.isInit = true;
        emit('init');
      });
    }
    function requestAnimationFrameFn(callback: () => any) {
      // Prevent waiting too long without executing the callback
      // Set the maximum waiting time
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
      // According to the scrolling direction to construct the viewport margin, used to load in advance
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
        // Observe the intersection of the viewport and the component container
        state.intersectionObserverInstance = new window.IntersectionObserver(intersectionHandler, {
          rootMargin,
          root: viewport,
          threshold: [0, Number.MIN_VALUE, 0.01],
        });

        const el = unref(elRef);

        state.intersectionObserverInstance.observe(el.$el);
      } catch (e) {
        init();
      }
    }
    // Cross-condition change handling function
    function intersectionHandler(entries: any[]) {
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
      // Cancel the observation before the component is destroyed
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
        <TransitionGroup ref={elRef} name={transitionName} tag={tag} {...getListeners(attrs)}>
          {() => renderContent()}
        </TransitionGroup>
      );
    };
  },
});
