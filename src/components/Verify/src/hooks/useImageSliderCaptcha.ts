import type { CaptchaConfig, ImageCaptchaType } from '../typing';

import { ref, unref } from 'vue';
import { formatToDateTime } from '@/utils/dateUtil';

/**
 * 验证码hook
 */
export const useImageSliderCaptcha = (type: ImageCaptchaType) => {
  // 验证码配置信息
  const captchaConfigRef = ref<CaptchaConfig>({
    type,
    key: '',
  });

  /**
   * 初始化配置

   */
  const initConfig = (config: CaptchaConfig) => {
    captchaConfigRef.value = {
      ...config,
      startTime: new Date(),
      trackList: [],
      type,
    };
  };

  /**
   * 开始滑动
   * @param event
   */
  const start = (event: MouseEvent | TouchEvent) => {
    let startX;
    let startY;
    if (event instanceof MouseEvent) {
      startX = event.pageX;
      startY = event.pageY;
    } else {
      const targetTouches = event.targetTouches;
      startX = Math.round(targetTouches[0].pageX);
      startY = Math.round(targetTouches[0].pageY);
    }
    captchaConfigRef.value.startX = startX;
    captchaConfigRef.value.startY = startY;

    captchaConfigRef.value.trackList?.push({
      x: 0,
      y: 0,
      type: 'DOWN',
      t: new Date().getTime() - unref(captchaConfigRef).startTime!.getTime(),
    });
  };

  /**
   * 移动事件
   * @param e
   */
  const move = (e: MouseEvent | TouchEvent) => {
    let event: MouseEvent | Touch;
    if (e instanceof TouchEvent) {
      event = e.touches[0];
    } else {
      event = e;
    }
    const pageX = Math.round(event.pageX);
    const pageY = Math.round(event.pageY);
    const captchaConfig = unref(captchaConfigRef);
    captchaConfigRef.value.trackList?.push({
      x: pageX - captchaConfig.startX!,
      y: pageY - captchaConfig.startY!,
      type: 'MOVE',
      t: new Date().getTime() - captchaConfig.startTime!.getTime(),
    });
  };

  /**
   * 移动结束事件
   * @param e
   */
  const end = (e: MouseEvent | TouchEvent) => {
    let event: MouseEvent | Touch;
    if (e instanceof TouchEvent) {
      event = e.touches[0];
    } else {
      event = e;
    }
    const pageX = Math.round(event.pageX);
    const pageY = Math.round(event.pageY);
    captchaConfigRef.value.stopTime = new Date();
    const captchaConfig = unref(captchaConfigRef);
    captchaConfigRef.value.trackList?.push({
      x: pageX - captchaConfig.startX!,
      y: pageY - captchaConfig.startY!,
      type: 'UP',
      t: new Date().getTime() - captchaConfig.startTime!.getTime(),
    });
  };

  /**
   * 构建验证码参数
   */
  const createCaptchaParameter = () => {
    const captchaConfig = unref(captchaConfigRef);

    return {
      key: captchaConfig.key,
      type,
      image: {
        bgImageWidth: captchaConfig.bgImageWidth,
        bgImageHeight: captchaConfig.bgImageHeight,
        sliderImageWidth: captchaConfig.sliderImageWidth,
        sliderImageHeight: captchaConfig.sliderImageHeight,
        startSlidingTime: formatToDateTime(captchaConfig.startTime),
        endSlidingTime: formatToDateTime(captchaConfig.stopTime),
        trackList: captchaConfig.trackList,
      },
    };
  };

  return {
    initConfig,
    start,
    move,
    end,
    createCaptchaParameter,
  };
};
