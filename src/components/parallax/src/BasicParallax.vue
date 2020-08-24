<script lang="tsx">
  import { defineComponent, reactive, onMounted, ref, unref, computed } from 'compatible-vue';
  import { basicProps } from './props';
  import { BasicProps } from './types';

  import { useDesign } from '@/hooks/core/useDesign';
  import { useEvent } from '@/hooks/event/useEvent';

  import { getSlot } from '@/utils/helper/tsxHelper';
  import { isObject } from '@/utils/is/index';
  export default defineComponent({
    name: 'BasicParallax',
    props: basicProps,
    setup(props: BasicProps, { listeners, slots }) {
      const { prefixCls, prefixVar } = useDesign('parallax');
      const imgRef = ref<HTMLImageElement | null>(null);
      const wrapRef = ref<HTMLDivElement | null>(null);

      const isBootedRef = ref(false);
      const translatableState = reactive({
        elOffsetTop: 0,
        parallax: 0,
        parallaxDist: 0,
        percentScrolled: 0,
        scrollTop: 0,
        windowHeight: 0,
        windowBottom: 0,
      });
      const getScrollWrapElRef = computed(() => {
        const el = document.querySelector(`.${prefixVar}-default-layout__main.fixed`);
        const { getContainer } = props;
        if (!isObject(getContainer)) {
          return el;
        }
        return unref(getContainer);
      });
      function calcDimensions() {
        const wrapEl = unref(wrapRef);
        const scrollWrapEl = unref(getScrollWrapElRef);
        if (!wrapEl || !scrollWrapEl) {
          return;
        }

        const offset = wrapEl.getBoundingClientRect();
        const { scrollTop, windowHeight } = translatableState;

        translatableState.scrollTop = window.pageYOffset;
        translatableState.parallaxDist = getObjHeight() - parseInt(props.height as string);
        translatableState.elOffsetTop = offset.top + scrollTop;
        translatableState.windowHeight = window.innerHeight;
        translatableState.windowBottom = scrollTop + windowHeight;
      }
      function listener() {
        const scrollWrapEl = unref(getScrollWrapElRef);

        const eventData = {
          el: scrollWrapEl,
          name: 'scroll',
          listener: translate,
          options: false,
          wait: 0,
        };
        useEvent(eventData);
        useEvent(eventData);
      }
      function translate() {
        calcDimensions();

        translatableState.percentScrolled =
          (translatableState.windowBottom - translatableState.elOffsetTop) /
          (parseInt((props.height as unknown) as string) + translatableState.windowHeight);

        translatableState.parallax = Math.abs(
          Math.round(translatableState.parallaxDist * translatableState.percentScrolled)
        );
      }

      function getObjHeight() {
        const imgEl = unref(imgRef);
        return imgEl ? imgEl.naturalHeight : 0;
      }
      function init() {
        const img = unref(imgRef);
        if (!img) {
          return;
        }
        if (img.complete) {
          translate();
          listener();
          isBootedRef.value = true;
        } else {
          useEvent({
            el: img,
            name: 'load',
            listener: () => {
              translate();
              setTimeout(() => {
                translate();
              }, 0);
              listener();
              isBootedRef.value = true;
            },
            options: false,
            wait: 0,
          });
        }
      }
      onMounted(() => {
        init();
      });
      const getStyle = computed(() => {
        return {
          display: 'block',
          opacity: unref(isBootedRef) ? 1 : 0,
          transform: `translate(-50%, ${translatableState.parallax}px)`,
        };
      });
      return () => {
        const { src, srcset, alt, height } = props;
        return (
          <div
            class={prefixCls}
            on={listeners}
            ref={wrapRef}
            style={{
              height: `${height}px`,
            }}
          >
            <div class={`${prefixCls}__image-container`}>
              <img
                style={unref(getStyle)}
                class={`${prefixCls}__image`}
                src={src}
                srcset={srcset}
                alt={alt}
                ref={imgRef}
              />
            </div>
            <div class={`${prefixCls}__content`}>{getSlot(slots)}</div>
          </div>
        );
      };
    },
  });
</script>
<style scoped lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-parallax';

  .@{prefix-cls} {
    position: relative;
    z-index: 0;
    overflow: hidden;

    &__image-container {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
      contain: strict;
    }

    &__image {
      position: absolute;
      bottom: 0;
      left: 50%;
      z-index: 1;
      display: none;
      min-width: 100%;
      min-height: 100%;
      transform: translate(-50%, 0);
      transition: opacity 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
      will-change: transform;
    }

    &__content {
      position: relative;
      z-index: 2;
      display: flex;
      height: 100%;
      padding: 0 1rem;
      color: @white;
      flex-direction: column;
      justify-content: center;
    }
  }
</style>
