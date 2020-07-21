<script lang="tsx">
  import { defineComponent, ref, unref, computed, reactive, watch } from 'compatible-vue';

  import { FadeTransition } from '@/components/transition/index';
  import { Icon, SvgIcon } from '@/components/icon/index';

  import { useDesign } from '@/hooks/core/useDesign';

  import { basicProps } from './props';
  import { Props } from './types';

  enum StatueEnum {
    LOADING,
    DONE,
    FAIL,
  }
  interface ImgState {
    currentUrl: string;
    imgScale: number;
    imgRotate: number;
    imgTop: number;
    imgLeft: number;
    currentIndex: number;
    status: StatueEnum;
    moveX: number;
    moveY: number;
  }
  export default defineComponent({
    name: 'ImagePreview',
    props: basicProps,
    setup(props: Props) {
      const { prefixCls } = useDesign('img-preview');

      const imgState = reactive<ImgState>({
        currentUrl: '',
        imgScale: 1,
        imgRotate: 0,
        imgTop: 0,
        imgLeft: 0,
        status: StatueEnum.LOADING,
        currentIndex: 0,
        moveX: 0,
        moveY: 0,
      });
      const wrapElRef = ref<HTMLDivElement | null>(null);
      const imgElRef = ref<HTMLImageElement | null>(null);

      // 初始化
      function init() {
        initMouseWheel();
        const { index, imageList } = props;

        if (!imageList || !imageList.length) {
          throw new Error('imageList is undefined');
        }
        imgState.currentIndex = index;
        handleIChangeImage(imageList[index]);
      }

      // 重置
      function initState() {
        imgState.imgScale = 1;
        imgState.imgRotate = 0;
        imgState.imgTop = 0;
        imgState.imgLeft = 0;
      }

      // 初始化鼠标滚轮事件
      function initMouseWheel() {
        const wrapEl = unref(wrapElRef);
        if (!wrapEl) {
          return;
        }
        (wrapEl as any).onmousewheel = scrollFunc;
        // 火狐浏览器没有onmousewheel事件，用DOMMouseScroll代替
        document.body.addEventListener('DOMMouseScroll', scrollFunc);
        // 禁止火狐浏览器下拖拽图片的默认事件
        document.ondragstart = function () {
          return false;
        };
      }

      // 监听鼠标滚轮
      function scrollFunc(e: any) {
        e = e || window.event;
        e.delta = e.wheelDelta || -e.detail;

        e.preventDefault();
        if (e.delta > 0) {
          // 滑轮向上滚动
          scaleFunc(0.015);
        }
        if (e.delta < 0) {
          // 滑轮向下滚动
          scaleFunc(-0.015);
        }
      }
      // 缩放函数
      function scaleFunc(num: number) {
        if (imgState.imgScale <= 0.2 && num < 0) return;
        imgState.imgScale += num;
      }

      // 旋转图片
      function rotateFunc(deg: number) {
        imgState.imgRotate += deg;
      }

      // 鼠标事件
      function handleMouseUp() {
        const imgEl = unref(imgElRef);
        if (!imgEl) {
          return;
        }
        imgEl.onmousemove = null;
      }

      // 更换图片
      function handleIChangeImage(url: string) {
        imgState.status = StatueEnum.LOADING;
        const img = new Image();
        img.src = url;
        img.onload = () => {
          imgState.currentUrl = url;
          imgState.status = StatueEnum.DONE;
        };
        img.onerror = () => {
          imgState.status = StatueEnum.FAIL;
        };
      }

      // 关闭
      function handleClose() {
        const { instance } = props;
        if (instance) {
          instance.show = false;
        }
        // 移除火狐浏览器下的鼠标滚动事件
        document.body.removeEventListener('DOMMouseScroll', scrollFunc);
        // 恢复火狐及Safari浏览器下的图片拖拽
        document.ondragstart = null;
      }
      // 图片复原
      function resume() {
        initState();
      }

      // 上一页下一页
      function handleChange(direction: 'left' | 'right') {
        const { currentIndex } = imgState;
        const { imageList } = props;
        if (direction === 'left') {
          imgState.currentIndex--;
          if (currentIndex <= 0) {
            imgState.currentIndex = imageList.length - 1;
          }
        }
        if (direction === 'right') {
          imgState.currentIndex++;
          if (currentIndex >= imageList.length - 1) {
            imgState.currentIndex = 0;
          }
        }
        handleIChangeImage(imageList[imgState.currentIndex]);
      }

      function handleAddMoveListener(e: MouseEvent) {
        e = e || window.event;
        imgState.moveX = e.clientX;
        imgState.moveY = e.clientY;
        const imgEl = unref(imgElRef);
        if (imgEl) {
          imgEl.onmousemove = moveFunc;
        }
      }

      function moveFunc(e: MouseEvent) {
        e = e || window.event;
        e.preventDefault();
        const movementX = e.clientX - imgState.moveX;
        const movementY = e.clientY - imgState.moveY;
        imgState.imgLeft += movementX;
        imgState.imgTop += movementY;
        imgState.moveX = e.clientX;
        imgState.moveY = e.clientY;
      }

      // 获取图片样式
      const getImageStyle = computed(() => {
        const { imgScale, imgRotate, imgTop, imgLeft } = imgState;
        return {
          transform: `scale(${imgScale}) rotate(${imgRotate}deg)`,
          marginTop: `${imgTop}px`,
          marginLeft: `${imgLeft}px`,
        };
      });

      const getIsMultipleImage = computed(() => {
        const { imageList } = props;
        return imageList.length > 1;
      });
      watch(
        () => props.show,
        (show) => {
          if (show) {
            init();
          }
        }
      );
      watch(
        () => props.imageList,
        () => {
          initState();
        }
      );

      const renderClose = () => {
        return (
          <div class={`${prefixCls}__close`} onClick={handleClose}>
            <Icon class={`${prefixCls}__close-icon`} type="close"></Icon>
          </div>
        );
      };
      const renderIndex = () => {
        if (!unref(getIsMultipleImage)) {
          return null;
        }
        const { currentIndex } = imgState;
        const { imageList } = props;
        return (
          <div class={`${prefixCls}__index`}>
            {currentIndex + 1} / {imageList.length}
          </div>
        );
      };

      const renderController = () => {
        return (
          <div class={`${prefixCls}__controller`}>
            <div class={`${prefixCls}__controller-item`} onClick={() => scaleFunc(-0.15)}>
              <SvgIcon type="unscale"></SvgIcon>
            </div>
            <div class={`${prefixCls}__controller-item`} onClick={() => scaleFunc(0.15)}>
              <SvgIcon type="scale"></SvgIcon>
            </div>
            <div class={`${prefixCls}__controller-item`} onClick={resume}>
              <SvgIcon type="resume"></SvgIcon>
            </div>
            <div class={`${prefixCls}__controller-item`} onClick={() => rotateFunc(-90)}>
              <SvgIcon type="unrotate"></SvgIcon>
            </div>
            <div class={`${prefixCls}__controller-item`} onClick={() => rotateFunc(90)}>
              <SvgIcon type="p-rotate"></SvgIcon>
            </div>
          </div>
        );
      };

      const renderArrow = (direction: 'left' | 'right') => {
        if (!unref(getIsMultipleImage)) {
          return null;
        }
        return (
          <div class={[`${prefixCls}__arrow`, direction]} onClick={() => handleChange(direction)}>
            <Icon type={direction}></Icon>
          </div>
        );
      };
      return () => (
        <FadeTransition>
          {props.show && (
            <div class={prefixCls} ref={wrapElRef} onMouseup={handleMouseUp}>
              <div class={`${prefixCls}-content`}>
                <img
                  style={unref(getImageStyle)}
                  class={`${prefixCls}-image`}
                  ref={imgElRef}
                  src={imgState.currentUrl}
                  onMousedown={handleAddMoveListener}
                />
                {renderClose()}
                {renderIndex()}
                {renderController()}
                {renderArrow('left')}
                {renderArrow('right')}
              </div>
            </div>
          )}
        </FadeTransition>
      );
    },
  });
</script>
<style scoped lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-img-preview';

  .@{prefix-cls} {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.5);
    user-select: none;

    &-content {
      display: flex;
      width: 100%;
      height: 100%;
      color: #fff;
      justify-content: center;
      align-items: center;
    }

    &-image {
      cursor: pointer;
      transition: transform 0.3s;
    }

    &__close {
      position: absolute;
      top: -40px;
      right: -40px;
      width: 80px;
      height: 80px;
      overflow: hidden;
      color: #fff;
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      transition: all 0.2s;

      &-icon {
        position: absolute;
        top: 46px;
        left: 16px;
        font-size: 16px;
      }

      &:hover {
        background-color: rgba(0, 0, 0, 0.8);
      }
    }

    &__index {
      position: absolute;
      bottom: 5%;
      left: 50%;
      padding: 0 22px;
      font-size: 16px;
      background: rgba(109, 109, 109, 0.6);
      border-radius: 15px;
      transform: translateX(-50%);
    }

    &__controller {
      position: absolute;
      bottom: 10%;
      left: 50%;
      width: 260px;
      height: 44px;
      padding: 0 22px;
      margin-left: -139px;
      background: rgba(109, 109, 109, 0.6);
      border-radius: 22px;

      &-item {
        display: inline-block;
        padding: 0 9px;
        font-size: 24px;
        line-height: 44px;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          transform: scale(1.2);
        }
      }
    }

    &__arrow {
      position: absolute;
      top: 50%;
      width: 50px;
      height: 50px;
      font-size: 28px;
      line-height: 50px;
      text-align: center;
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      transition: all 0.2s;

      &:hover {
        background-color: rgba(0, 0, 0, 0.8);
      }

      &.left {
        left: 50px;
      }

      &.right {
        right: 50px;
      }
    }
  }
</style>
