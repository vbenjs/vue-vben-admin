<template>
  <div :class="$attrs.class" :style="getWrapperStyle">
    <img
      v-show="isReady"
      ref="imgElRef"
      :src="src"
      :alt="alt"
      :crossorigin="crossorigin"
      :style="getImageStyle"
    />
  </div>
</template>
<script lang="ts">
  import type { CSSProperties } from 'vue';

  import { defineComponent, onMounted, ref, unref, computed } from 'vue';

  import Cropper from 'cropperjs';
  import 'cropperjs/dist/cropper.css';

  type Options = Cropper.Options;

  const defaultOptions: Cropper.Options = {
    aspectRatio: 16 / 9,
    zoomable: true,
    zoomOnTouch: true,
    zoomOnWheel: true,
    cropBoxMovable: true,
    cropBoxResizable: true,
    toggleDragModeOnDblclick: true,
    autoCrop: true,
    background: true,
    highlight: true,
    center: true,
    responsive: true,
    restore: true,
    checkCrossOrigin: true,
    checkOrientation: true,
    scalable: true,
    modal: true,
    guides: true,
    movable: true,
    rotatable: true,
  };
  export default defineComponent({
    name: 'CropperImage',
    props: {
      src: {
        type: String,
        required: true,
      },
      alt: {
        type: String,
      },
      height: {
        type: [String, Number],
        default: '360px',
      },
      crossorigin: {
        type: String as PropType<'' | 'anonymous' | 'use-credentials' | undefined>,
        default: undefined,
      },
      imageStyle: {
        type: Object as PropType<CSSProperties>,
        default: () => ({}),
      },
      options: {
        type: Object as PropType<Options>,
        default: () => ({}),
      },
    },
    emits: ['cropperedInfo'],
    setup(props, ctx) {
      const imgElRef = ref<ElRef<HTMLImageElement>>(null);
      const cropper: any = ref<Nullable<Cropper>>(null);

      const isReady = ref(false);

      const getImageStyle = computed((): CSSProperties => {
        return {
          height: props.height,
          maxWidth: '100%',
          ...props.imageStyle,
        };
      });

      const getWrapperStyle = computed((): CSSProperties => {
        const { height } = props;
        return { height: `${height}`.replace(/px/, '') + 'px' };
      });

      async function init() {
        const imgEl = unref(imgElRef);
        if (!imgEl) {
          return;
        }
        cropper.value = new Cropper(imgEl, {
          ...defaultOptions,
          ready: () => {
            isReady.value = true;
          },
          ...props.options,
        });
      }

      // event: return base64 and width and height information after cropping
      const croppered = (): void => {
        let imgInfo = cropper.value.getData();
        cropper.value.getCroppedCanvas().toBlob((blob) => {
          let fileReader: FileReader = new FileReader();
          fileReader.onloadend = (e: any) => {
            ctx.emit('cropperedInfo', {
              imgBase64: e.target.result,
              imgInfo,
            });
          };
          fileReader.readAsDataURL(blob);
        }, 'image/jpeg');
      };

      onMounted(init);

      return { imgElRef, getWrapperStyle, getImageStyle, isReady, croppered };
    },
  });
</script>
