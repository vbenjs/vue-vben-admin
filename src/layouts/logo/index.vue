<template>
  <div class="app-logo anticon" :class="theme" @click="handleGoHome" :style="wrapStyle">
    <img src="/@/assets/images/logo.png" />
    <div v-if="show" class="logo-title ml-2 ellipsis">{{ globSetting.title }}</div>
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, PropType, ref, watch } from 'vue';
  // hooks
  import { useSetting } from '/@/hooks/core/useSetting';
  import { useTimeout } from '/@/hooks/core/useTimeout';
  import { useGo } from '/@/hooks/web/usePage';

  import { PageEnum } from '/@/enums/pageEnum';
  import { MenuTypeEnum } from '/@/enums/menuEnum';

  import { menuStore } from '/@/store/modules/menu';
  import { appStore } from '/@/store/modules/app';

  export default defineComponent({
    name: 'Logo',
    props: {
      showTitle: {
        type: Boolean as PropType<boolean>,
        default: true,
      },
      theme: {
        type: String,
      },
    },
    setup(props) {
      const showRef = ref<boolean>(!!props.showTitle);
      const { globSetting } = useSetting();
      const go = useGo();

      function handleGoHome() {
        go(PageEnum.BASE_HOME);
      }

      watch(
        () => props.showTitle,
        (show: boolean) => {
          if (show) {
            useTimeout(() => {
              showRef.value = show;
            }, 280);
          } else {
            showRef.value = show;
          }
        }
      );

      const wrapStyle = computed(() => {
        const { getCollapsedState } = menuStore;
        const {
          menuSetting: { menuWidth, type },
        } = appStore.getProjectConfig;
        const miniWidth = { minWidth: `${menuWidth}px` };
        if (type !== MenuTypeEnum.SIDEBAR) {
          return miniWidth;
        }
        return getCollapsedState ? {} : miniWidth;
      });

      return {
        handleGoHome,
        globSetting,
        show: showRef,
        wrapStyle,
      };
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '../../design/index.less';

  .app-logo {
    display: flex;
    align-items: center;
    padding-left: 16px;
    cursor: pointer;
    // justify-content: center;
    &.light {
      border-bottom: 1px solid @border-color-base;
    }

    .logo-title {
      font-size: 18px;
      font-weight: 700;
      opacity: 0;
      transition: all 0.5s;
      .respond-to(medium,{
       opacity: 1;
     });
    }
  }
</style>
