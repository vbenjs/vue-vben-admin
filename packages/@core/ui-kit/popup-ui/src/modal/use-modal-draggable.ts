/**
 * @copy https://github.com/element-plus/element-plus/blob/dev/packages/hooks/use-draggable/index.ts
 * 调整部分细节
 */

import { onBeforeUnmount, onMounted, ref, watchEffect } from 'vue';
import type { ComputedRef, Ref } from 'vue';

import { unrefElement } from '@vueuse/core';

export function useModalDraggable(
  targetRef: Ref<HTMLElement | undefined>,
  dragRef: Ref<HTMLElement | undefined>,
  draggable: ComputedRef<boolean>,
) {
  let transform = {
    offsetX: 0,
    offsetY: 0,
  };

  const dragging = ref(false);

  // let isFirstDrag = true;
  // let initialX = 0;
  // let initialY = 0;
  const onMousedown = (e: MouseEvent) => {
    const downX = e.clientX;
    const downY = e.clientY;

    if (!targetRef.value) {
      return;
    }

    // if (isFirstDrag) {
    //   const { x, y } = getInitialTransform(targetRef.value);
    //   initialX = x;
    //   initialY = y;
    // }

    const targetRect = targetRef.value.getBoundingClientRect();

    const { offsetX, offsetY } = transform;
    const targetLeft = targetRect.left;
    const targetTop = targetRect.top;
    const targetWidth = targetRect.width;
    const targetHeight = targetRect.height;
    const docElement = document.documentElement;
    const clientWidth = docElement.clientWidth;
    const clientHeight = docElement.clientHeight;

    const minLeft = -targetLeft + offsetX;
    const minTop = -targetTop + offsetY;
    const maxLeft = clientWidth - targetLeft - targetWidth + offsetX;
    const maxTop = clientHeight - targetTop - targetHeight + offsetY;

    const onMousemove = (e: MouseEvent) => {
      let moveX = offsetX + e.clientX - downX;
      let moveY = offsetY + e.clientY - downY;
      // const x = isFirstDrag ? initialX : 0;
      // const y = isFirstDrag ? initialY : 0;
      moveX = Math.min(Math.max(moveX, minLeft), maxLeft);
      // + x;
      moveY = Math.min(Math.max(moveY, minTop), maxTop);
      //  + y;

      transform = {
        offsetX: moveX,
        offsetY: moveY,
      };

      if (targetRef.value) {
        targetRef.value.style.transform = `translate(${moveX}px, ${moveY}px)`;
        dragging.value = true;
      }
    };

    const onMouseup = () => {
      // isFirstDrag = false;
      dragging.value = false;
      document.removeEventListener('mousemove', onMousemove);
      document.removeEventListener('mouseup', onMouseup);
    };

    document.addEventListener('mousemove', onMousemove);
    document.addEventListener('mouseup', onMouseup);
  };

  const onDraggable = () => {
    const dragDom = unrefElement(dragRef);
    if (dragDom && targetRef.value) {
      dragDom.addEventListener('mousedown', onMousedown);
    }
  };

  const offDraggable = () => {
    const dragDom = unrefElement(dragRef);
    if (dragDom && targetRef.value) {
      dragDom.removeEventListener('mousedown', onMousedown);
    }
  };

  const resetPosition = () => {
    transform = {
      offsetX: 0,
      offsetY: 0,
    };
    const target = unrefElement(targetRef);
    if (target) {
      target.style.transform = 'none';
    }
  };

  onMounted(() => {
    watchEffect(() => {
      if (draggable.value) {
        onDraggable();
      } else {
        offDraggable();
      }
    });
  });

  onBeforeUnmount(() => {
    offDraggable();
  });

  return {
    dragging,
    resetPosition,
  };
}

// function getInitialTransform(target: HTMLElement) {
//   let x = 0;
//   let y = 0;
//   const transformValue = window.getComputedStyle(target)?.transform;
//   if (transformValue) {
//     const match = transformValue.match(/matrix\(([^)]+)\)/);
//     if (match) {
//       const values = match[1]?.split(', ') ?? [];
//       // 获取 translateX 值
//       x = Number.parseFloat(`${values[4]}`);
//       // 获取 translateY 值
//       y = Number.parseFloat(`${values[5]}`);
//     }
//   }
//   return { x, y };
// }
