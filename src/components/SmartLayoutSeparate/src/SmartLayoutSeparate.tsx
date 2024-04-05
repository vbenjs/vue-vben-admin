import { defineComponent, computed, toRefs, ref, watch, unref } from 'vue';
import type { PropType, Ref, StyleValue } from 'vue';

import { Divider } from 'ant-design-vue';
import { isFinite, endsWith, replace, parseInt, toNumber } from 'lodash-es';

import './SmartLayoutSeparate.less';

enum Layout {
  'LEFT_RIGHT_LAYOUT' = 'leftRight',
  'TOP_BOTTOM_LAYOUT' = 'topBottom',
}

const sizeType = {
  type: [Number, String] as PropType<number | string>,
  validator(value: string | number) {
    if (!isFinite(value)) {
      // @ts-ignore
      return endsWith(value, '%') || endsWith(value, 'px');
    }
    return true;
  },
};

/**
 * 支持分隔拖拽的layout
 * @author shizhongming
 */
export default defineComponent({
  name: 'SmartLayoutSeparate',
  props: {
    //布局，默认左右布局
    layout: {
      type: String as PropType<string>,
      default: Layout.LEFT_RIGHT_LAYOUT,
      validator(value: string) {
        // @ts-ignore
        return [Layout.LEFT_RIGHT_LAYOUT, Layout.TOP_BOTTOM_LAYOUT].includes(value);
      },
    },
    // 是否可拖拽
    draggable: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    // 尺寸，如果是number类型，按照百分比分隔
    firstSize: sizeType,
    secondSize: sizeType,
    showLine: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    lineStyle: {
      type: [Object, String] as PropType<StyleValue | string>,
    },
    highLineStyle: {
      type: [Object, String] as PropType<StyleValue | string>,
      default: () => {
        return {
          'border-left': '2px solid rgb(24, 144, 255)',
        };
      },
    },
  },
  setup(props, { slots }) {
    const { layout, draggable, firstSize, secondSize, showLine } = toRefs(props);
    if (unref(firstSize) && unref(secondSize)) {
      throw new Error('firstSize和secondSize不能同时设置');
    }
    if (!unref(firstSize) && !unref(secondSize)) {
      firstSize.value = 50;
    }
    // 是否是设置了第一尺寸
    const computedIsFirstSize = computed(() => unref(firstSize) !== undefined);
    // 是否是左右布局
    const isLeftRight = computed(() => layout.value === Layout.LEFT_RIGHT_LAYOUT);
    // 拖拽是否初始化
    const dividerRef = ref<HTMLElement | null>(null);
    const dragVue = useDrag(isLeftRight, draggable);

    /**
     * 外层DIV class 计算属性
     */
    const computedContainerClassList = computed(() => {
      // 外层DIV容器class
      const containerClassList = ['smart-layout-separate'];
      if (isLeftRight.value) {
        containerClassList.push('left-right-layout');
      } else {
        containerClassList.push('top-bottom-layout');
      }
      return containerClassList;
    });
    /**
     * 分割线class
     */
    const computedLineClass = computed(() => {
      // 分割线样式
      const dividerClassList: Array<string> = ['drag-line'];
      // 添加高亮设置
      if (dragVue.isMouseDown && dragVue.isMouseDown.value === true) {
        dividerClassList.push('high-light');
      }
      if (draggable.value) {
        dividerClassList.push('draggable');
      }
      return dividerClassList;
    });

    /**
     * layout样式计算属性
     */
    const layoutStyle = computed(() => {
      const { xLength, yLength } = dragVue;
      const firstStyle: StyleValue = {};
      const firstSizeValue = firstSize.value;
      const secondSizeValue = unref(secondSize);
      const sizeValue = firstSizeValue || secondSizeValue;
      const isFirstSize = unref(computedIsFirstSize);
      let firstValue = '';
      let secondValue = '';
      const addValue = isLeftRight.value ? xLength.value : yLength.value;
      if (isFinite(sizeValue) || isFinite(toNumber(sizeValue))) {
        // 按照百分比处理
        if (isFirstSize) {
          firstValue = toNumber(sizeValue) + addValue + 'px';
          secondValue = `calc(100% - ${firstValue})`;
        } else {
          secondValue = toNumber(sizeValue) - addValue + 'px';
          firstValue = `calc(100% - ${secondValue})`;
        }
      } else {
        // @ts-ignore
        if (endsWith(sizeValue, '%')) {
          // @ts-ignore
          const size = parseInt(replace(sizeValue, '%'));
          if (isFirstSize) {
            firstValue = `calc(${size}% ${addValue > 0 ? '+' : '-'} ${Math.abs(addValue)}px)`;
            secondValue = `calc(${100 - size}% ${addValue < 0 ? '+' : '-'} ${Math.abs(
              addValue,
            )}px)`;
          } else {
            secondValue = `calc(${size}% ${addValue < 0 ? '+' : '-'} ${Math.abs(addValue)}px)`;
            firstValue = `calc(${100 - size}% ${addValue > 0 ? '+' : '-'} ${Math.abs(addValue)}px)`;
          }
          // @ts-ignore
        } else if (endsWith(sizeValue, 'px')) {
          // @ts-ignore
          const size = parseInt(replace(sizeValue, 'px'));
          if (isFirstSize) {
            firstValue = size + addValue + 'px';
            secondValue = `calc(100% - ${firstValue})`;
          } else {
            secondValue = size - addValue + 'px';
            firstValue = `calc(100% - ${secondValue})`;
          }
        }
      }
      const secondStyle: any = {};
      if (isLeftRight.value) {
        firstStyle.width = firstValue;
        secondStyle.width = secondValue;
      } else {
        firstStyle.height = firstValue;
        secondStyle.height = secondValue;
      }
      return {
        firstStyle,
        secondStyle,
      };
    });

    const computedFirstContainerClass = computed(() => {
      const classList = ['full-height'];
      if (showLine.value) {
        classList.push('first-outer');
      }
      return classList;
    });

    const computedSecondContainerClass = computed(() => {
      const classList: string[] = [];
      if (showLine.value) {
        classList.push('second-outer');
      }
      return classList;
    });

    return () => {
      const { onLineMouseDown, dragLineStyle } = dragVue;
      const { first, second } = slots;
      return (
        <div class={computedContainerClassList.value}>
          {/* 第一块区域，左或者上 */}
          <div class="first-container" style={layoutStyle.value.firstStyle}>
            <div class={computedFirstContainerClass.value}>{first ? first() : ''}</div>
            {/* 分割线 */}
            {props.showLine ? (
              <div
                ref={dividerRef}
                style={dragLineStyle && dragLineStyle.value}
                onMousedown={(e) => draggable.value && onLineMouseDown && onLineMouseDown(e)}
                class={computedLineClass.value}
              >
                <Divider
                  style={props.lineStyle}
                  type={isLeftRight.value ? 'vertical' : 'horizontal'}
                />
              </div>
            ) : (
              ''
            )}
          </div>
          {/* 第二块区域，右或者下 */}
          <div class={computedSecondContainerClass.value} style={layoutStyle.value.secondStyle}>
            {second ? second() : ''}
          </div>
        </div>
      );
    };
  },
});

/**
 * 支持拖拽
 * @param isLeftRight 是否是左右布局
 * @param draggable
 */
const useDrag = (isLeftRight: Ref<boolean>, draggable: Ref<boolean>) => {
  // 鼠标是否按下
  const isMouseDown = ref(false);
  // 鼠标拖动时 lined XY坐标
  const lineDownX = ref(0);
  const lineDownY = ref(0);
  // 初始化状态的 x y位置
  let initX = -1;
  let initY = -1;
  let lineDefaultX = -1;
  let lineDefaultY = -1;
  // 分割线样式
  const dragLineStyle = ref<StyleValue>();
  // 左右方向移动距离
  const xLength = ref(0);
  // Y方向移动距离
  const yLength = ref(0);

  /**
   * 重置函数
   */
  const reset = () => {
    initX = -1;
    initY = -1;
    lineDefaultX = -1;
    lineDefaultY = -1;
    lineDownX.value = 0;
    lineDownY.value = 0;
    xLength.value = 0;
    yLength.value = 0;
  };

  watch([isLeftRight, draggable], reset);

  /**
   * 监控 x y 变化改变line样式
   */
  watch([lineDownX, lineDownY], () => {
    if (lineDefaultX === -1 || lineDefaultY === -1) {
      return;
    }
    if (isLeftRight.value) {
      dragLineStyle.value = {
        right: lineDefaultX - lineDownX.value - 5 + 'px',
      };
    } else {
      dragLineStyle.value = {
        bottom: lineDefaultY - lineDownY.value - 5 + 'px',
      };
    }
  });
  /**
   * 分割线鼠标点击事件
   */
  const onLineMouseDown = (downE: MouseEvent) => {
    if (initX === -1) {
      initX = downE.clientX;
    }
    if (initY === -1) {
      initY = downE.clientY;
    }

    lineDefaultX = downE.clientX;
    lineDefaultY = downE.clientY;

    isMouseDown.value = true;
    document.onmousemove = (e) => {
      lineDownX.value = e.clientX;
      lineDownY.value = e.clientY;
    };
    document.onmouseup = (e) => {
      xLength.value = e.clientX - initX;
      yLength.value = e.clientY - initY;

      dragLineStyle.value = {};
      isMouseDown.value = false;
      // 移除响应事件
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };
  return {
    onLineMouseDown,
    isMouseDown,
    dragLineStyle,
    xLength,
    yLength,
  };
};
