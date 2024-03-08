<template>
  <div :class="prefixCls">
    <ImageSliderCaptcha ref="sliderRef" v-if="type === 'SLIDER'" :type="type" v-bind="$attrs" />
  </div>
</template>

<script setup lang="ts">
  import type { ImageCaptchaType } from '@/components/Verify';
  import ImageSliderCaptcha from './components/ImageSliderCaptcha.vue';
  import { ref } from 'vue';
  import { useDesign } from '@/hooks/web/useDesign';

  const { prefixCls } = useDesign('smart-component-imageCaptcha');

  /**
   * 图片验证码
   */
  defineProps({
    type: {
      type: String as PropType<ImageCaptchaType>,
      required: true,
    },
  });

  const sliderRef = ref();

  const refresh = () => {
    sliderRef.value.refresh();
  };
  defineExpose({ refresh });
</script>

<style lang="less"></style>
