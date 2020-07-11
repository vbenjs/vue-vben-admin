<script lang="tsx">
  import { defineComponent, PropOptions } from 'compatible-vue';
  import { BasicMenu, MenuTreeItem } from '@/components/menu/index';
  import Logo from '@/layouts/Logo.vue';

  import { PageEnum } from '@/enums/pageEnum';
  import { MenuTypeEnum } from '@/enums/menuEnum';

  // hooks
  import { useGo } from '@/hooks/core/useRouter';
  import { useDesign } from '@/hooks/core/useDesign';

  // store
  import { appStore } from '@/store/modules/app';

  //
  import { buildMenu } from '@/router/buildMenu';
  // res
  import { RouteConfigEx } from '@/router/type';

  // import
  export default defineComponent({
    name: 'DefaultLayoutMenu',
    props: {
      theme: {
        type: String,
        default: '',
      } as PropOptions<string>,
    },
    setup(props) {
      const { prefixCls } = useDesign('layout-menu');

      function handleMenuClick({
        targetRoute,
      }: {
        menu?: MenuTreeItem;
        targetRoute: RouteConfigEx;
      }) {
        const { path } = targetRoute;
        // const { path, meta: { frameSrc } = {} } = targetRoute;
        if (path) {
          useGo({ path: path as PageEnum, replace: false });
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
            buildMenuFn={buildMenu}
            onMenuClick={handleMenuClick}
            type={menuType}
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
