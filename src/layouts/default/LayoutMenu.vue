<script lang="tsx">
  import { defineComponent, PropOptions } from 'compatible-vue';
  import { BasicMenu, MenuItem } from '@/components/menu/index';
  import Logo from '@/layouts/Logo.vue';

  import { pageEnum } from '@/enums/pageEnum';
  import { MenuTypeEnum } from '@/enums/menuEnum';

  // hooks
  import { useGo } from '@/hooks/core/useRouter';
  import { useDesign } from '@/hooks/core/useDesign';

  // store
  import { appStore } from '@/store/modules/app';
  import { menuStore } from '@/store/modules/menu';
  import { buildMenuList } from '@/hooks/core/useAuth';
  // res
  import { RouteConfigEx } from '@/router/types';

  // import
  export default defineComponent({
    name: 'DefaultLayoutMenu',
    props: {
      theme: {
        type: String,
        default: '',
      } as PropOptions<string>,
    },
    setup(props, { root }) {
      const { prefixCls } = useDesign('layout-menu');

      function handleMenuClick({ targetRoute }: { menu?: MenuItem; targetRoute: RouteConfigEx }) {
        const { path } = targetRoute;
        // const { path, meta: { frameSrc } = {} } = targetRoute;
        if (path) {
          useGo({ path: path as pageEnum, replace: false, router: root.$router });
        }
      }
      return () => {
        const { getProjCfg } = appStore;
        const {
          showLogo,
          menuSetting: { type: menuType, mode, theme, collapsed, showSearch },
        } = getProjCfg;

        const isSidebarType = menuType === MenuTypeEnum.SIDEBAR;
        const isShowLogo = showLogo && isSidebarType;
        const themeData = props.theme || theme;

        return (
          <BasicMenu
            buildMenuFn={buildMenuList}
            onMenuClick={handleMenuClick}
            type={menuType}
            lastBuildTime={menuStore.getLastBuildTimeState}
            mode={mode}
            class={prefixCls}
            theme={themeData}
            showLogo={isShowLogo}
            search={showSearch}
          >
            <template slot="header">
              {isShowLogo && (
                <Logo showTitle={!collapsed} class={[`${prefixCls}__logo`, themeData]} />
              )}
            </template>
          </BasicMenu>
        );
      };
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-layout-menu';

  .@{prefix-cls} {
    /deep/ &__logo {
      padding: 10px;

      img {
        .size(34px);
      }

      &.light {
        .@{namespace}-logo__title {
          color: @text-color-base;
        }
      }

      &.dark {
        .@{namespace}-logo__title {
          color: #fff;
        }
      }
    }
  }
</style>
