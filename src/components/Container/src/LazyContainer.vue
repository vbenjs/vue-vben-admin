<template>
  <transition-group
    class="lazy-container"
    v-bind="$attrs"
    ref="elRef"
    :name="transitionName"
    :tag="tag"
    mode="out-in"
  >
    <div key="component" v-if="isInit">
      <slot :loading="loading" />
    </div>
    <div key="skeleton" v-else name="lazy-skeleton">
      <slot name="skeleton" v-if="$slots.skeleton" />
      <Skeleton v-else />
    </div>
  </transition-group>
</template>
<script lang="ts">
  import type { PropType } from 'vue';

  import { defineComponent, reactive, onMounted, ref, toRef, toRefs } from 'vue';

  import { Skeleton } from 'ant-design-vue';
  import { useTimeoutFn } from '@vueuse/core';
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
      // Waiting time, if the time is specified, whether visible or not, it will be automatically loaded after the specified time
      timeout: {
        type: Number as PropType<number>,
      },

      // The viewport where the component is located. If the component is scrolling in the page container, the viewport is the container
      viewport: {
        type: (typeof window !== 'undefined' ? window.HTMLElement : Object) as PropType<
          HTMLElement
        >,
        default: () => null,
      },

      // Preload threshold, css unit
      threshold: {
        type: String as PropType<string>,
        default: '0px',
      },

      // The scroll direction of the viewport, vertical represents the vertical direction, horizontal represents the horizontal direction
      direction: {
        type: String as PropType<'vertical' | 'horizontal'>,
        default: 'vertical',
      },

      // The label name of the outer container that wraps the component
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
          useTimeoutFn(() => {
            init();
          }, timeout);
      }

      function init() {
        state.loading = true;

        useTimeoutFn(() => {
          if (state.isInit) return;
          state.isInit = true;
          emit('init');
        }, props.maxWaitingTime || 80);
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
  .lazy-container {
    width: 100%;
    height: 100%;
  }
</style>
