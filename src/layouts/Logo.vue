<template>
  <div class="app-logo" @click="handleGoHome" :style="wrapStyle">
    <img :src="logo" />
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
  import { MenuTypeEnum } from '../enums/menuEnum';

  import logo from '/@/assets/images/logo.png';

  import { menuStore } from '../store/modules/menu';
  import { appStore } from '../store/modules/app';

  export default defineComponent({
    name: 'Logo',
    props: {
      showTitle: {
        type: Boolean as PropType<boolean>,
        default: true,
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
        logo,
        wrapStyle,
      };
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '../design/index.less';

  .app-logo {
    display: flex;
    align-items: center;
    padding-left: 16px;
    cursor: pointer;
    justify-content: center;

    .logo-title {
      display: none;
      font-size: 16px;
      font-weight: 400;
      .respond-to(medium,{
       display: block;
     });
    }
  }
</style>
