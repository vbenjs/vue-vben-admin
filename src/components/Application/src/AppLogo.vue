<template>
  <div
    class="app-logo anticon"
    :class="{ theme, 'collapsed-show-title': getCollapsedShowTitle }"
    @click="handleGoHome"
  >
    <img src="/@/assets/images/logo.png" />
    <div class="app-logo__title ml-2 ellipsis" v-show="showTitle">{{ globSetting.title }}</div>
  </div>
</template>
<script lang="ts">
  import type { PropType } from 'vue';
  import { defineComponent } from 'vue';

  import { useGlobSetting } from '/@/hooks/setting';
  import { useGo } from '/@/hooks/web/usePage';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';

  import { PageEnum } from '/@/enums/pageEnum';

  export default defineComponent({
    name: 'AppLogo',
    props: {
      /**
       * The theme of the current parent component
       */
      theme: {
        type: String as PropType<string>,
      },
      showTitle: {
        type: Boolean,
        default: true,
      },
    },
    setup() {
      const { getCollapsedShowTitle } = useMenuSetting();
      const globSetting = useGlobSetting();
      const go = useGo();

      function handleGoHome(): void {
        go(PageEnum.BASE_HOME);
      }

      return {
        handleGoHome,
        globSetting,
        getCollapsedShowTitle,
      };
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '../../../design/index.less';

  .app-logo {
    display: flex;
    align-items: center;
    padding-left: 10px;
    cursor: pointer;

    &.collapsed-show-title {
      padding-left: 20px;
    }

    &.light {
      border-bottom: 1px solid @border-color-base;
    }

    &.light &__title {
      color: @primary-color;
    }

    &.dark &__title {
      color: @white;
    }

    &__title {
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
