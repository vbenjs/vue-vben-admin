<script lang="tsx">
  import {
    defineComponent,
    ref,
    computed,
    unref,
    reactive,
    watch,
    getCurrentInstance,
  } from 'compatible-vue';
  import { useDesign } from '@/hooks/core/useDesign';
  import { useTimeout } from '@/hooks/core/useTimeout';
  import { useEvent } from '@/hooks/event/useEvent';
  import { Icon } from '@/components/icon/index';

  import { basicProps } from './props';
  import { getSlot } from '@/utils/helper/tsxHelper';
  export default defineComponent({
    name: 'BaseDargVerify',
    props: basicProps,
    setup(props, { emit, slots }) {
      const state = reactive({
        isMoving: false,
        isPassing: false,
        moveDistance: 0,
        toLeft: false,
        startTime: 0,
        endTime: 0,
      });

      const { prefixCls } = useDesign('base-dv');
      const wrapElRef = ref<HTMLDivElement | null>(null);
      const barElRef = ref<HTMLDivElement | null>(null);
      const contentElRef = ref<HTMLDivElement | null>(null);
      const actionElRef = ref<HTMLDivElement | null>(null);

      watch(
        () => state.isPassing,
        (isPassing) => {
          if (isPassing) {
            const { startTime, endTime } = state;
            const time = (endTime - startTime) / 1000;
            emit('success', { isPassing, time: time.toFixed(1) });
            emit('change', isPassing);
          }
        }
      );
      watch(
        () => props.value,
        (isPassing) => {
          state.isPassing = !!isPassing;
        },
        {
          immediate: true,
        }
      );

      const getActionStyleRef = computed(() => {
        const { height, actionStyle } = props;
        const h = `${parseInt(height!)}px`;
        return {
          left: 0,
          width: h,
          height: h,
          ...actionStyle,
        };
      });
      const getWrapStyleRef = computed(() => {
        const { height, width, circle, wrapStyle } = props;
        const h = parseInt(height!);
        const w = `${parseInt(width!)}px`;
        return {
          width: w,
          height: `${h}px`,
          lineHeight: `${h}px`,
          borderRadius: circle ? h / 2 + 'px' : 0,
          ...wrapStyle,
        };
      });

      const getBarStyleRef = computed(() => {
        const { height, circle, barStyle } = props;
        const h = parseInt(height!);
        return {
          height: `${h}px`,
          borderRadius: circle ? h / 2 + 'px 0 0 ' + h / 2 + 'px' : 0,
          ...barStyle,
        };
      });

      const getContentStyleRef = computed(() => {
        const { height, width, contentStyle } = props;
        const h = `${parseInt(height!)}px`;
        const w = `${parseInt(width!)}px`;

        return {
          height: h,
          width: w,
          ...contentStyle,
        };
      });

      function getEventPageX(e: MouseEvent | TouchEvent) {
        return (e as MouseEvent).pageX || (e as TouchEvent).touches[0].pageX;
      }

      useEvent({
        el: document,
        name: 'mouseup',
        listener: () => {
          if (state.isMoving) {
            resume();
          }
          // emit('end');
        },
      });
      // 开始拖拽
      function handleDragStart(e: MouseEvent | TouchEvent) {
        if (state.isPassing) {
          return;
        }

        const actionEl = unref(actionElRef);
        if (!actionEl) return;
        emit('start', e);
        state.moveDistance = getEventPageX(e) - parseInt(actionEl.style.left.replace('px', ''), 10);
        state.startTime = new Date().getTime();
        state.isMoving = true;
      }
      function getOffset(el: HTMLDivElement) {
        const actionWidth = parseInt(el.style.width);
        const { width } = props;
        const widthNum = parseInt(width!);
        const offset = widthNum - actionWidth - 6;
        return { offset, widthNum, actionWidth };
      }
      function handleDragMoving(e: MouseEvent | TouchEvent) {
        const { isMoving, moveDistance } = state;
        if (isMoving) {
          const actionEl = unref(actionElRef);
          const barEl = unref(barElRef);
          if (!actionEl || !barEl) return;
          const { offset, widthNum, actionWidth } = getOffset(actionEl);
          const moveX = getEventPageX(e) - moveDistance;

          emit('move', {
            event: e,
            moveDistance,
            moveX,
          });
          if (moveX > 0 && moveX <= offset) {
            actionEl.style.left = `${moveX}px`;
            barEl.style.width = `${moveX + actionWidth / 2}px`;
          } else if (moveX > offset) {
            actionEl.style.left = `${widthNum - actionWidth}px`;
            barEl.style.width = `${widthNum - actionWidth / 2}px`;
            if (!props.isSlot) {
              checkPass();
            }
          }
        }
      }

      function handleDragOver(e: MouseEvent | TouchEvent) {
        const { isMoving, isPassing, moveDistance } = state;
        if (isMoving && !isPassing) {
          emit('end', e);
          const actionEl = unref(actionElRef);
          const barEl = unref(barElRef);
          if (!actionEl || !barEl) return;
          const moveX = getEventPageX(e) - moveDistance;
          const { offset, widthNum, actionWidth } = getOffset(actionEl);
          if (moveX < offset) {
            if (!props.isSlot) {
              resume();
            } else {
              setTimeout(() => {
                if (!props.value) {
                  resume();
                } else {
                  const contentEl = unref(contentElRef);
                  if (contentEl) {
                    contentEl.style.width = `${parseInt(barEl.style.width)}px`;
                  }
                }
              }, 0);
            }
          } else {
            actionEl.style.left = `${widthNum - actionWidth}px`;
            barEl.style.width = `${widthNum - actionWidth / 2}px`;
            checkPass();
          }
          state.isMoving = false;
        }
      }

      function checkPass() {
        if (props.isSlot) {
          resume();
          return;
        }
        state.endTime = new Date().getTime();
        state.isPassing = true;
        state.isMoving = false;
      }

      function resume() {
        state.isMoving = false;
        state.isPassing = false;
        state.moveDistance = 0;
        state.toLeft = false;
        state.startTime = 0;
        state.endTime = 0;
        const actionEl = unref(actionElRef);
        const barEl = unref(barElRef);
        const contentEl = unref(contentElRef);
        if (!actionEl || !barEl || !contentEl) return;
        state.toLeft = true;
        useTimeout(() => {
          state.toLeft = false;
          actionEl.style.left = '0';
          barEl.style.width = '0';
          //  时间与动画时间保持一致
        }, 300);
        contentEl.style.width = unref(getContentStyleRef).width;
      }

      const instance = getCurrentInstance() as any;
      if (instance) {
        instance.resume = resume;
      }
      return () => {
        const renderBar = () => {
          const cls = [`${prefixCls}-bar`];
          if (state.toLeft) {
            cls.push('to-left');
          }
          return <div class={cls} ref={barElRef} style={unref(getBarStyleRef)} />;
        };

        const renderContent = () => {
          const cls = [`${prefixCls}-content`];
          const { isPassing } = state;
          const { text, successText } = props;
          if (isPassing) {
            cls.push('success');
          }
          return (
            <div class={cls} ref={contentElRef} style={unref(getContentStyleRef)}>
              {getSlot(slots, 'text', isPassing) || (isPassing ? successText : text)}
            </div>
          );
        };

        const renderAction = () => {
          const cls = [`${prefixCls}-action`];
          const { toLeft, isPassing } = state;
          if (toLeft) {
            cls.push('to-left');
          }
          return (
            <div
              class={cls}
              onMousedown={handleDragStart}
              onTouchstart={handleDragStart}
              style={unref(getActionStyleRef)}
              ref={actionElRef}
            >
              {getSlot(slots, 'actionIcon', isPassing) || (
                <Icon
                  type={isPassing ? 'check' : 'double-right'}
                  class={`${prefixCls}-action__icon`}
                />
              )}
            </div>
          );
        };

        return (
          <div
            class={prefixCls}
            ref={wrapElRef}
            style={unref(getWrapStyleRef)}
            onMousemove={handleDragMoving}
            onTouchmove={handleDragMoving}
            onMouseup={handleDragOver}
            onTouchend={handleDragOver}
          >
            {renderBar()}
            {renderContent()}
            {renderAction()}
          </div>
        );
      };
    },
  });
</script>
<style scoped lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-base-dv';

  @radius: 4px;
  .@{prefix-cls} {
    position: relative;
    overflow: hidden;
    text-align: center;
    background-color: rgb(238, 238, 238);
    border: 1px solid #ddd;
    border-radius: @radius;

    &-bar {
      position: absolute;
      width: 0;
      height: 36px;
      background: @success-color;
      border-radius: @radius;

      &.to-left {
        width: 0 !important;
        transition: width 0.3s;
      }
    }

    &-content {
      position: absolute;
      top: 0;
      font-size: 12px;
      user-select: none;

      &.success {
        color: @white;
      }
    }

    &-action {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      cursor: move;
      background: @white;
      border-radius: @radius;
      justify-content: center;
      align-items: center;

      &__icon {
        cursor: inherit;
      }

      &.to-left {
        left: 0 !important;
        transition: left 0.3s;
      }
    }
  }
</style>
