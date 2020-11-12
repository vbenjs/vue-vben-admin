import { Modal } from 'ant-design-vue';
import { defineComponent, watchEffect } from 'vue';
import { basicProps } from './props';
import { useTimeoutFn } from '@vueuse/core';
import { extendSlots } from '/@/utils/helper/tsxHelper';

export default defineComponent({
  name: 'Modal',
  inheritAttrs: false,
  props: basicProps,
  setup(props, { attrs, slots }) {
    const getStyle = (dom: any, attr: any) => {
      return getComputedStyle(dom)[attr];
    };
    const drag = (wrap: any) => {
      if (!wrap) return;
      wrap.setAttribute('data-drag', props.draggable);
      const dialogHeaderEl = wrap.querySelector('.ant-modal-header');
      const dragDom = wrap.querySelector('.ant-modal');

      if (!dialogHeaderEl || !dragDom || !props.draggable) return;

      dialogHeaderEl.style.cursor = 'move';

      dialogHeaderEl.onmousedown = (e: any) => {
        if (!e) return;
        // 鼠标按下，计算当前元素距离可视区的距离
        const disX = e.clientX;
        const disY = e.clientY;
        const screenWidth = document.body.clientWidth; // body当前宽度
        const screenHeight = document.documentElement.clientHeight; // 可见区域高度(应为body高度，可某些环境下无法获取)

        const dragDomWidth = dragDom.offsetWidth; // 对话框宽度
        const dragDomheight = dragDom.offsetHeight; // 对话框高度

        const minDragDomLeft = dragDom.offsetLeft;

        const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;
        const minDragDomTop = dragDom.offsetTop;
        const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight;
        // 获取到的值带px 正则匹配替换
        const domLeft = getStyle(dragDom, 'left');
        const domTop = getStyle(dragDom, 'top');
        let styL = +domLeft;
        let styT = +domTop;

        // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
        if (domLeft.includes('%')) {
          styL = +document.body.clientWidth * (+domLeft.replace(/%/g, '') / 100);
          styT = +document.body.clientHeight * (+domTop.replace(/%/g, '') / 100);
        } else {
          styL = +domLeft.replace(/px/g, '');
          styT = +domTop.replace(/px/g, '');
        }

        document.onmousemove = function (e) {
          // 通过事件委托，计算移动的距离
          let left = e.clientX - disX;
          let top = e.clientY - disY;

          // 边界处理
          if (-left > minDragDomLeft) {
            left = -minDragDomLeft;
          } else if (left > maxDragDomLeft) {
            left = maxDragDomLeft;
          }

          if (-top > minDragDomTop) {
            top = -minDragDomTop;
          } else if (top > maxDragDomTop) {
            top = maxDragDomTop;
          }

          // 移动当前元素
          dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;
        };

        document.onmouseup = () => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      };
    };

    const handleDrag = () => {
      const dragWraps = document.querySelectorAll('.ant-modal-wrap');
      for (const wrap of dragWraps as any) {
        if (!wrap) continue;
        const display = getStyle(wrap, 'display');
        const draggable = wrap.getAttribute('data-drag');
        if (display !== 'none') {
          // 拖拽位置
          (draggable === null || props.destroyOnClose) && drag(wrap);
        }
      }
    };

    watchEffect(() => {
      if (!props.visible) {
        return;
      }
      useTimeoutFn(() => {
        handleDrag();
      }, 30);
    });

    return () => {
      const propsData = { ...attrs, ...props } as any;
      return <Modal {...propsData}>{extendSlots(slots)}</Modal>;
    };
  },
});
