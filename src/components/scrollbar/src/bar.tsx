import { renderThumbStyle, BAR_MAP } from './util';
import {
  defineComponent,
  PropOptions,
  computed,
  unref,
  inject,
  Ref,
  reactive,
  ref,
  onBeforeUnmount,
} from 'compatible-vue';
import { on, off } from '@/utils/domUtils';

export default defineComponent({
  name: 'Bar',
  props: {
    vertical: Boolean as PropOptions<boolean>,
    size: String as PropOptions<string>,
    move: Number as PropOptions<number>,
  },
  setup(props) {
    const thumbRef = ref<Nullable<HTMLDivElement>>(null);
    const elRef = ref<Nullable<HTMLDivElement>>(null);
    const commonState = reactive<KeyString>({});
    const getBarRef = computed(() => {
      return BAR_MAP[props.vertical ? 'vertical' : 'horizontal'];
    });
    const parentElRef = inject('scroll-bar-wrap') as Ref<Nullable<HTMLDivElement>>;

    function clickThumbHandler(e: MouseEvent & ChangeEvent) {
      const { ctrlKey, button, currentTarget } = e;
      // prevent click event of right button
      if (ctrlKey || button === 2 || !currentTarget) {
        return;
      }
      startDrag(e);
      const bar = unref(getBarRef);
      commonState[bar.axis] =
        currentTarget[bar.offset] -
        (e[bar.client] -
          ((currentTarget as unknown) as Element).getBoundingClientRect()[bar.direction]);
    }

    function clickTrackHandler(e: ChangeEvent) {
      const bar = unref(getBarRef);
      const offset = Math.abs(e.target.getBoundingClientRect()[bar.direction] - e[bar.client]);
      const thumbEl = unref(thumbRef);
      const parentEl = unref(parentElRef);
      const el = unref(elRef);
      if (!thumbEl || !el || !parentEl) return;
      const thumbHalf = thumbEl[bar.offset] / 2;
      const thumbPositionPercentage = ((offset - thumbHalf) * 100) / el[bar.offset];
      parentEl[bar.scroll] = (thumbPositionPercentage * parentEl[bar.scrollSize]) / 100;
    }

    function startDrag(e: Event) {
      e.stopImmediatePropagation();
      commonState.cursorDown = true;

      on(document, 'mousemove', mouseMoveDocumentHandler);
      on(document, 'mouseup', mouseUpDocumentHandler);
      document.onselectstart = () => false;
    }

    function mouseMoveDocumentHandler(e: ChangeEvent) {
      if (commonState.cursorDown === false) return;
      const bar = unref(getBarRef);
      const prevPage = commonState[bar.axis];
      const el = unref(elRef);
      const parentEl = unref(parentElRef);
      const thumbEl = unref(thumbRef);
      if (!prevPage || !el || !thumbEl || !parentEl) return;

      const offset = (el.getBoundingClientRect()[bar.direction] - e[bar.client]) * -1;
      const thumbClickPosition = thumbEl[bar.offset] - prevPage;
      const thumbPositionPercentage = ((offset - thumbClickPosition) * 100) / el[bar.offset];

      parentEl[bar.scroll] = (thumbPositionPercentage * parentEl[bar.scrollSize]) / 100;
    }

    function mouseUpDocumentHandler() {
      const bar = unref(getBarRef);
      commonState.cursorDown = false;
      commonState[bar.axis] = 0;
      off(document, 'mousemove', mouseMoveDocumentHandler);
      document.onselectstart = null;
    }

    onBeforeUnmount(() => {
      off(document, 'mouseup', mouseUpDocumentHandler);
    });
    return () => {
      const bar = unref(getBarRef);
      const { size, move } = props;
      return (
        <div
          class={['scrollbar__bar', 'is-' + bar.key]}
          onMousedown={clickTrackHandler}
          ref={elRef}
        >
          <div
            ref={thumbRef}
            class="scrollbar__thumb"
            onMousedown={clickThumbHandler}
            style={renderThumbStyle({ size, move, bar })}
          />
        </div>
      );
    };
  },
});
