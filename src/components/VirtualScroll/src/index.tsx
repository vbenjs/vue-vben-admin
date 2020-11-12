import { defineComponent, computed, ref, unref, reactive, onMounted, watch, nextTick } from 'vue';
import { useEventListener } from '/@/hooks/event/useEventListener';

import { convertToUnit } from '/@/components/util';
import { props as basicProps } from './props';
import { getSlot } from '/@/utils/helper/tsxHelper';
import './index.less';

const prefixCls = 'virtual-scroll';
export default defineComponent({
  name: 'VirtualScroll',
  props: basicProps,
  setup(props, { slots }) {
    const wrapElRef = ref<HTMLDivElement | null>(null);
    const state = reactive({
      first: 0,
      last: 0,
      scrollTop: 0,
    });

    const getBenchRef = computed(() => {
      return parseInt(props.bench as string, 10);
    });

    const getItemHeightRef = computed(() => {
      return parseInt(props.itemHeight as string, 10);
    });

    const getFirstToRenderRef = computed(() => {
      return Math.max(0, state.first - unref(getBenchRef));
    });

    const getLastToRenderRef = computed(() => {
      return Math.min((props.items || []).length, state.last + unref(getBenchRef));
    });

    const getContainerStyleRef = computed(() => {
      return {
        height: convertToUnit((props.items || []).length * unref(getItemHeightRef)),
      };
    });

    const getWrapStyleRef = computed((): object => {
      const styles: Record<string, string> = {};
      const height = convertToUnit(props.height);
      const minHeight = convertToUnit(props.minHeight);
      const minWidth = convertToUnit(props.minWidth);
      const maxHeight = convertToUnit(props.maxHeight);
      const maxWidth = convertToUnit(props.maxWidth);
      const width = convertToUnit(props.width);

      if (height) styles.height = height;
      if (minHeight) styles.minHeight = minHeight;
      if (minWidth) styles.minWidth = minWidth;
      if (maxHeight) styles.maxHeight = maxHeight;
      if (maxWidth) styles.maxWidth = maxWidth;
      if (width) styles.width = width;
      return styles;
    });

    watch([() => props.itemHeight, () => props.height], () => {
      onScroll();
    });

    function getLast(first: number): number {
      const wrapEl = unref(wrapElRef);
      if (!wrapEl) {
        return 0;
      }
      const height = parseInt(props.height || 0, 10) || wrapEl.clientHeight;

      return first + Math.ceil(height / unref(getItemHeightRef));
    }

    function getFirst(): number {
      return Math.floor(state.scrollTop / unref(getItemHeightRef));
    }

    function onScroll() {
      const wrapEl = unref(wrapElRef);
      if (!wrapEl) {
        return;
      }
      state.scrollTop = wrapEl.scrollTop;
      state.first = getFirst();
      state.last = getLast(state.first);
    }

    function renderChildren() {
      const { items = [] } = props;
      return items.slice(unref(getFirstToRenderRef), unref(getLastToRenderRef)).map(genChild);
    }

    function genChild(item: any, index: number) {
      index += unref(getFirstToRenderRef);

      const top = convertToUnit(index * unref(getItemHeightRef));
      return (
        <div class={`${prefixCls}__item`} style={{ top }} key={index}>
          {getSlot(slots, 'default', { index, item })}
        </div>
      );
    }

    onMounted(() => {
      state.last = getLast(0);
      nextTick(() => {
        const wrapEl = unref(wrapElRef);
        if (!wrapEl) {
          return;
        }
        useEventListener({
          el: wrapEl,
          name: 'scroll',
          listener: onScroll,
          wait: 0,
        });
      });
    });
    return () => (
      <div class={prefixCls} style={unref(getWrapStyleRef)} ref={wrapElRef}>
        <div class={`${prefixCls}__container`} style={unref(getContainerStyleRef)}>
          {renderChildren()}
        </div>
      </div>
    );
  },
});
