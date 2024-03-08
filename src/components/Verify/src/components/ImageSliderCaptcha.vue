<template>
  <div :class="prefixCls" class="slider" :style="computedSliderStyle">
    <div class="content" :style="computedContentStyle">
      <div class="bg-img-div">
        <img ref="bgImageRef" :src="captchaDataRef.image?.backgroundImage" alt="" />
      </div>
      <div class="slider-img-div" :style="computedSliderTemplateStyle">
        <img ref="sliderImageRef" :src="captchaDataRef.image?.templateImage" alt="" />
      </div>
    </div>
    <div class="slider-move">
      <DragVerify
        ref="basicDragVerifyRef"
        :width="width"
        is-slot
        @start="handleStart"
        @end="handleEnd"
        @move="handleMove"
        :value="verifySuccessRef"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { type ImageCaptchaType, type MoveData } from '@/components/Verify';
  import { useDesign } from '@/hooks/web/useDesign';
  import { propTypes } from '@/utils/propTypes';
  import { computed, nextTick, onMounted, ref, unref } from 'vue';

  import DragVerify from '../DragVerify.vue';
  import { useImageSliderCaptcha } from '../hooks/useImageSliderCaptcha';
  import { loadCaptchaApi } from '../Verify.api';

  const { prefixCls } = useDesign('smart-component-imageSliderCaptcha');

  const props = defineProps({
    type: {
      type: String as PropType<ImageCaptchaType>,
      required: true,
      default: 'SLIDER',
    },
    // 图片宽度
    width: propTypes.number.def(320),
    api: {
      type: Function as PropType<(params: any) => Promise<Recordable>>,
      default: loadCaptchaApi,
    },
  });

  const emit = defineEmits(['end']);

  const basicDragVerifyRef = ref();
  const bgImageRef = ref();
  const sliderImageRef = ref();

  const verifySuccessRef = ref(true);

  /**
   * 验证码数据
   */
  const captchaDataRef = ref<Recordable>({});
  /**
   * X轴移动距离
   */
  const moveXRef = ref(0);

  const { initConfig, start, move, end, createCaptchaParameter } = useImageSliderCaptcha(
    props.type,
  );

  /**
   * 开始移动事件
   * @param event
   */
  const handleStart = (event: MouseEvent | TouchEvent) => {
    start(event);
  };

  /**
   * 停止移动事件
   * @param e
   */
  const handleEnd = async (e: MouseEvent | TouchEvent) => {
    end(e);
    const parameter = createCaptchaParameter();
    emit('end', parameter);
  };

  const handleMove = (data: MoveData) => {
    moveXRef.value = data.moveX;
    move(data.event);
  };

  /**
   * 刷新验证码
   */
  const refresh = async () => {
    captchaDataRef.value = await props.api(props.type);
    const bgImage = unref(bgImageRef);
    const sliderImage = unref(sliderImageRef);
    moveXRef.value = 0;
    basicDragVerifyRef.value?.resume();
    await nextTick(() => {
      initConfig({
        key: captchaDataRef.value.key,
        bgImageWidth: bgImage.width,
        bgImageHeight: bgImage.height,
        sliderImageWidth: sliderImage.width,
        sliderImageHeight: sliderImage.height,
      });
    });
  };
  onMounted(refresh);

  const computedContentHeight = computed(() => {
    return props.width / 1.64;
  });

  const computedSliderStyle = computed(() => {
    return {
      width: `${props.width}px`,
      height: `${unref(computedContentHeight) + 40}px`,
    };
  });
  const computedContentStyle = computed(() => {
    return {
      height: `${unref(computedContentHeight)}px`,
    };
  });
  /**
   * 滑块样式计算属性
   */
  const computedSliderTemplateStyle = computed(() => {
    const movePx = moveXRef.value;
    return {
      transform: `translate(${movePx}px, 0px)`,
    };
  });

  defineExpose({ refresh });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-smart-component-imageSliderCaptcha';

  .@{prefix-cls} {
    &.slider {
      z-index: 999;
      box-sizing: border-box;
      height: 260px;
      background-color: #fff;
      user-select: none;

      .bottom {
        width: 100%;
        height: 19px;
      }

      .content {
        position: relative;
        width: 100%;
      }

      .slider-move {
        position: relative;
        width: 100%;
      }
    }

    .bg-img-div {
      position: absolute;
      width: 100%;
      height: 100%;
      transform: translate(0, 0);
    }

    .slider-img-div {
      position: absolute;
      height: 100%;
      transform: translate(0, 0);
    }

    .bg-img-div img {
      width: 100%;
    }

    .slider-img-div img {
      height: 100%;
    }

    .refresh-btn,
    .close-btn {
      display: inline-block;
    }

    .slider-move {
      .slider-move-track {
        color: #88949d;
        font-size: 14px;
        line-height: 38px;
        text-align: center;
        white-space: nowrap;
        user-select: none;
      }

      .slider-move-btn {
        position: absolute;
        top: -12px;
        left: 0;
        width: 66px;
        height: 66px;
        transform: translate(0, 0);
        background-position: -5px 11.7%;
      }
    }

    .slider-move-btn:hover,
    .close-btn:hover,
    .refresh-btn:hover {
      cursor: pointer;
    }
  }
</style>
