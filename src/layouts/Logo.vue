<template>
  <div class="app-logo" @click="handleGoHome">
    <img :src="logo" />
    <div v-if="show" class="logo-title ml-1 mt-1 ellipsis">{{ globSetting.title }}</div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, watch } from 'vue';
  // hooks
  import { useSetting } from '/@/hooks/core/useSetting';

  import { PageEnum } from '/@/enums/pageEnum';
  import logo from '/@/assets/images/logo.png';
  import { useTimeout } from '/@/hooks/core/useTimeout';
  import { useGo } from '/@/hooks/web/usePage';

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

      return {
        handleGoHome,
        globSetting,
        show: showRef,
        logo,
      };
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '../design/index.less';

  .app-logo {
    display: flex;
    align-items: center;
    cursor: pointer;

    .logo-title {
      display: none;
      font-family: Georgia, serif;
      font-size: 16px;
      .respond-to(medium,{
       display: block;
     });
    }
  }
</style>
