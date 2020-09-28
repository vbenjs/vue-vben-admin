<template>
  <div class="flex justify-items-center items-center cursor-pointer" @click="handleGoHome">
    <img :src="logo" />
    <div v-if="show" class="logo-title ml-2 text-xl hidden md:block font-logo ellipsis">{{
      globSetting.title
    }}</div>
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
      const { globSetting } = useSetting();
      const go = useGo();
      function handleGoHome() {
        go(PageEnum.BASE_HOME);
      }
      const showRef = ref<boolean>(!!props.showTitle);
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
