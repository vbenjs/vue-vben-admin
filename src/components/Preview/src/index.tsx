import { defineComponent, ref, unref, computed, reactive, watchEffect } from 'vue';

import { basicProps } from './props';
import { Props } from './types';
import './index.less';

import { CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons-vue';

import resumeSvg from '/@/assets/svg/preview/resume.svg';
import rotateSvg from '/@/assets/svg/preview/p-rotate.svg';
import scaleSvg from '/@/assets/svg/preview/scale.svg';
import unScaleSvg from '/@/assets/svg/preview/unscale.svg';
import loadingSvg from '/@/assets/images/loading.svg';
import unRotateSvg from '/@/assets/svg/preview/unrotate.svg';
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
  show: boolean;
}

const prefixCls = 'img-preview';
export default defineComponent({
  name: 'ImagePreview',
  props: basicProps,
  setup(props: Props) {
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
      show: props.show,
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
      if (!imgEl) return;
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
    function handleClose(e: MouseEvent) {
      e && e.stopPropagation();
      imgState.show = false;
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

    watchEffect(() => {
      if (props.show) {
        init();
      }
      if (props.imageList) {
        initState();
      }
    });

    const renderClose = () => {
      return (
        <div class={`${prefixCls}__close`} onClick={handleClose}>
          <CloseOutlined class={`${prefixCls}__close-icon`} />
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
            <img src={unScaleSvg} />
          </div>
          <div class={`${prefixCls}__controller-item`} onClick={() => scaleFunc(0.15)}>
            <img src={scaleSvg} />
          </div>
          <div class={`${prefixCls}__controller-item`} onClick={resume}>
            <img src={resumeSvg} />
          </div>
          <div class={`${prefixCls}__controller-item`} onClick={() => rotateFunc(-90)}>
            <img src={unRotateSvg} />
          </div>
          <div class={`${prefixCls}__controller-item`} onClick={() => rotateFunc(90)}>
            <img src={rotateSvg} />
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
          {direction === 'left' ? <LeftOutlined /> : <RightOutlined />}
        </div>
      );
    };

    return () => {
      return (
        imgState.show && (
          <div class={prefixCls} ref={wrapElRef} onMouseup={handleMouseUp}>
            <div class={`${prefixCls}-content`}>
              <img
                width="32"
                src={loadingSvg}
                class={[
                  `${prefixCls}-image`,
                  imgState.status === StatueEnum.LOADING ? '' : 'hidden',
                ]}
              />
              <img
                style={unref(getImageStyle)}
                class={[`${prefixCls}-image`, imgState.status === StatueEnum.DONE ? '' : 'hidden']}
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
        )
      );
    };
  },
});
