<template>
  <transition-group v-bind="$attrs" ref="elRef" :name="transitionName" :tag="tag">
    <div key="component" v-if="isInit">
      <slot :loading="loading" />
    </div>
    <div key="skeleton">
      <slot name="skeleton" v-if="$slots.skeleton" />
      <Skeleton v-else />
    </div>
  </transition-group>
</template>
<script lang="ts">
  import type { PropType } from 'vue';

  import {
    defineComponent,
    reactive,
    onMounted,
    ref,
    unref,
    onUnmounted,
    toRef,
    toRefs,
  } from 'vue';

  import { Skeleton } from 'ant-design-vue';
  import { useRaf } from '/@/hooks/event/useRaf';
  import { useTimeout } from '/@/hooks/core/useTimeout';
  import { useIntersectionObserver } from '/@/hooks/event/useIntersectionObserver';
  interface State {
    isInit: boolean;
    loading: boolean;
    intersectionObserverInstance: IntersectionObserver | null;
  }
  export default defineComponent({
    name: 'LazyContainer',
    components: { Skeleton },
    props: {
      // 等待时间，如果指定了时间，不论可见与否，在指定时间之后自动加载
      timeout: {
        type: Number as PropType<number>,
        default: 0,
        // default: 8000,
      },
      // 组件所在的视口，如果组件是在页面容器内滚动，视口就是该容器
      viewport: {
        type: (typeof window !== 'undefined' ? window.HTMLElement : Object) as PropType<
          HTMLElement
        >,
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

      // transition name
      transitionName: {
        type: String as PropType<string>,
        default: 'lazy-container',
      },
    },
    emits: ['init'],
    setup(props, { emit }) {
      const elRef = ref<any>(null);
      const state = reactive<State>({
        isInit: false,
        loading: false,
        intersectionObserverInstance: null,
      });

      onMounted(() => {
        immediateInit();
        initIntersectionObserver();
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
          if (state.isInit) return;
          callback();
        }, props.maxWaitingTime || 80);

        const { requestAnimationFrame } = useRaf();

        return requestAnimationFrame;
      }

      function initIntersectionObserver() {
        const { timeout, direction, threshold } = props;
        if (timeout) return;
        // According to the scrolling direction to construct the viewport margin, used to load in advance
        let rootMargin: string = '0px';
        switch (direction) {
          case 'vertical':
            rootMargin = `${threshold} 0px`;
            break;
          case 'horizontal':
            rootMargin = `0px ${threshold}`;
            break;
        }

        try {
          const { stop, observer } = useIntersectionObserver({
            rootMargin,
            target: toRef(elRef.value, '$el'),
            onIntersect: (entries: any[]) => {
              const isIntersecting = entries[0].isIntersecting || entries[0].intersectionRatio;
              if (isIntersecting) {
                init();
                if (observer) {
                  stop();
                }
              }
            },
            root: toRef(props, 'viewport'),
          });
        } catch (e) {
          init();
        }
      }
      return {
        elRef,
        ...toRefs(state),
      };
    },
  });
</script>
<style lang="less">
  .lazy-container-enter {
    opacity: 0;
  }

  .lazy-container-enter-to {
    opacity: 1;
  }

  .lazy-container-enter-from,
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
