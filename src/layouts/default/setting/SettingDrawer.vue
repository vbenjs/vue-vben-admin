<script lang="tsx">
  import { defineComponent, computed, unref } from 'compatible-vue';
  import { Drawer } from '@/components/drawer/index';
  import { Icon } from '@/components/icon/index';
  import { Divider, Switch, Tooltip, InputNumber, Select, Button } from 'ant-design-vue';

  import { MenuModeEnum, MenuTypeEnum, MenuThemeEnum } from '@/enums/menuEnum';
  import { ContentEnum } from '@/enums/appEnum';

  import { appStore } from '@/store/modules/app';
  import { ProjectConfig, MenuSetting } from '@/types/config';

  import { useDesign } from '@/hooks/core/useDesign';
  import { useMessage } from '@/hooks/core/useMessage';
  import { useCopyToClipboard } from '@/hooks/event/useCopyToClipboard';

  import { isBoolean } from '@/utils/is/index';

  import defultSetting from '@/settings/projectSetting';

  import {
    preDefineColors,
    updateTheme,
    updateColorWeak,
    updateGrayMode,
  } from '@/setup/theme/index';

  import mixImg from '@/assets/images/layout/menu-mix.svg';
  import sidebarImg from '@/assets/images/layout/menu-sidebar.svg';
  import menuTopImg from '@/assets/images/layout/menu-top.svg';

  const themeOptions = [
    {
      value: MenuThemeEnum.LIGHT,
      label: '亮色',
    },
    {
      value: MenuThemeEnum.DARK,
      label: '暗色',
    },
  ];
  const contentModeOptions = [
    {
      value: ContentEnum.FULL,
      label: '流式',
    },
    {
      value: ContentEnum.FIXED,
      label: '定宽',
    },
  ];
  export default defineComponent({
    name: 'SettingDrawer',
    setup(_, { listeners }) {
      const { prefixCls } = useDesign('setting-drawer');
      const { createSuccessModal, createMessage } = useMessage();

      const getisHorizontalRef = computed(() => {
        return appStore.getProjCfg.menuSetting.mode === MenuModeEnum.HORIZONTAL;
      });
      function handleSidebarChange({
        mode,
        menuWidth,
        show,
        hasDrag,
        collapsed,
        type,
        showSearch,
        theme,
      }: Partial<MenuSetting>) {
        const {
          mode: defMode,
          menuWidth: defMenuWidht,
          show: defShow,
          hasDrag: defHasDrag,
          collapsed: defCollapsed,
          type: defType,
          theme: defTheme,
          showSearch: defShowSearch,
        } = appStore.getProjCfg.menuSetting;

        const proCfg: Partial<ProjectConfig> = {
          menuSetting: {
            collapsed: isBoolean(collapsed) ? collapsed : defCollapsed,
            menuWidth: menuWidth || defMenuWidht,
            mode: mode || defMode,
            type: type || defType,
            showSearch: isBoolean(showSearch) ? showSearch : defShowSearch,
            show: isBoolean(show) ? show : defShow,
            hasDrag: isBoolean(hasDrag) ? hasDrag : defHasDrag,
            theme: theme || defTheme,
          },
        };
        appStore.commitProjCfgState(proCfg);
      }
      function handleMenuWidthChange(width: number) {
        handleSidebarChange({ menuWidth: width });
      }

      function handleMultipleCheckChange(show: boolean) {
        const defSetting = appStore.getProjCfg!.multiTabsSetting;
        const proCfg: Partial<ProjectConfig> = {
          multiTabsSetting: {
            ...defSetting,
            show,
          },
        };
        appStore.commitProjCfgState(proCfg);
      }

      function handleLockTimeChange(time: number) {
        appStore.commitProjCfgState({
          lockTime: time,
        });
      }
      function handleContentModeChange(mode: ContentEnum) {
        appStore.commitProjCfgState({
          contentMode: mode,
        });
      }
      function handleFullContentCheckChange(flag: boolean) {
        appStore.commitProjCfgState({
          fullContent: flag,
        });
      }
      function handleshowHeaderCheckChange(flag: boolean) {
        appStore.commitProjCfgState({
          headerSetting: {
            ...appStore.getProjCfg.headerSetting,
            show: flag,
          },
        });
      }
      function handleshowLogoCheckChange(flag: boolean) {
        appStore.commitProjCfgState({
          showLogo: flag,
        });
      }
      function handleThemeColorChange(themeColor: string) {
        appStore.commitProjCfgState({
          themeColor,
        });
        updateTheme(themeColor);
      }
      function handleColorWeakChange(colorWeak: boolean) {
        appStore.commitProjCfgState({
          colorWeak,
        });
        updateColorWeak(colorWeak);
      }
      function handleGrayModeChange(gray: boolean) {
        appStore.commitProjCfgState({
          grayMode: gray,
        });
        updateGrayMode(gray);
      }
      function handleshowSidebarCheckChange(flag: boolean) {
        handleSidebarChange({ show: flag });
      }
      function handleSidebarDrag(flag: boolean) {
        handleSidebarChange({ hasDrag: flag });
      }
      function handleShowSearch(flag: boolean) {
        handleSidebarChange({ showSearch: flag });
      }
      function handleSidebarCollapsed(flag: boolean) {
        handleSidebarChange({ collapsed: flag });
      }
      function handleMenuThemeChange(theme: MenuThemeEnum) {
        handleSidebarChange({ theme });
      }

      function handleHeaderThemeChange(theme: MenuThemeEnum) {
        appStore.commitProjCfgState({
          headerSetting: {
            ...appStore.getProjCfg.headerSetting,
            theme,
          },
        });
      }
      function handleCopy() {
        const { isSuccessRef } = useCopyToClipboard(JSON.stringify(appStore.getProjCfg, null, 2));
        unref(isSuccessRef) &&
          createSuccessModal({
            title: '操作成功',
            content: '复制成功,请到 src/settings/projectSetting.ts 中修改配置！',
          });
      }

      function handleResetSetting() {
        try {
          appStore.commitProjCfgState(defultSetting);
          const { themeColor, colorWeak, grayMode } = defultSetting;
          updateTheme(themeColor);
          updateColorWeak(colorWeak);
          updateGrayMode(grayMode);
          createMessage.success('重置成功！');
        } catch (error) {
          createMessage.error(error);
        }
      }
      function renderTheme() {
        const { getProjCfg } = appStore;
        const { themeColor } = getProjCfg;
        return (
          <div class={`${prefixCls}__theme-item`}>
            {preDefineColors.map((item) => {
              return (
                <span
                  onClick={handleThemeColorChange.bind(null, item)}
                  key={item}
                  class={[themeColor === item ? 'active' : '']}
                  style={{
                    background: item,
                  }}
                >
                  <Icon type="check" class={['icon']} />
                </span>
              );
            })}
          </div>
        );
      }

      function renderSidebar() {
        const { getProjCfg } = appStore;
        const {
          contentMode,
          headerSetting: { theme: headerTheme } = {},
          menuSetting: { type, theme: menuTheme } = {},
        } = getProjCfg;

        const typeList = [
          {
            title: '左侧菜单模式',
            mode: MenuModeEnum.INLINE,
            type: MenuTypeEnum.SIDEBAR,
            src: sidebarImg,
          },
          {
            title: '混合模式',
            mode: MenuModeEnum.INLINE,
            type: MenuTypeEnum.MIX,
            src: mixImg,
          },

          {
            title: '顶部菜单模式',
            mode: MenuModeEnum.HORIZONTAL,
            type: MenuTypeEnum.TOP_MENU,
            src: menuTopImg,
          },
        ];
        return [
          <div class={`${prefixCls}__siderbar`}>
            {typeList.map((item) => {
              const { title, type: ItemType, mode, src } = item;
              return (
                <Tooltip placement="bottom">
                  <template slot="title">{title}</template>
                  <div
                    onClick={handleSidebarChange.bind(null, {
                      mode: mode,
                      type: ItemType,
                    })}
                  >
                    <Icon type="check" class={['check-icon', type === ItemType ? 'active' : '']} />
                    <img src={src} class="" />
                  </div>
                </Tooltip>
              );
            })}
          </div>,
          <div class={`${prefixCls}__cell-item`}>
            <span>顶栏主题</span>
            <Select
              size="small"
              defaultValue={headerTheme}
              options={themeOptions}
              onChange={handleHeaderThemeChange}
            />
          </div>,
          <div class={`${prefixCls}__cell-item`}>
            <span>菜单主题</span>
            <Select
              disabled={unref(getisHorizontalRef)}
              size="small"
              defaultValue={menuTheme}
              options={themeOptions}
              onChange={handleMenuThemeChange}
            />
          </div>,
          <div class={`${prefixCls}__cell-item`}>
            <span>内容区域宽度</span>
            <Select
              disabled={!unref(getisHorizontalRef)}
              size="small"
              defaultValue={contentMode}
              options={contentModeOptions}
              onChange={handleContentModeChange}
            />
          </div>,
        ];
      }
      /**
       * @description:
       */
      function renderFeatures() {
        const { menuSetting: { hasDrag, collapsed, showSearch } = {} } = appStore.getProjCfg;
        return [
          <div class={`${prefixCls}__cell-item`}>
            <span>菜单可拖拽</span>
            <Switch
              disabled={unref(getisHorizontalRef)}
              checked={hasDrag}
              checkedChildren="开"
              unCheckedChildren="关"
              onChange={handleSidebarDrag}
            />
          </div>,
          <div class={`${prefixCls}__cell-item`}>
            <span>菜单可搜索</span>
            <Switch
              disabled={unref(getisHorizontalRef)}
              checked={showSearch}
              checkedChildren="开"
              unCheckedChildren="关"
              onChange={handleShowSearch}
            />
          </div>,
          <div class={`${prefixCls}__cell-item`}>
            <span>折叠菜单</span>
            <Switch
              disabled={unref(getisHorizontalRef)}
              checked={collapsed}
              checkedChildren="开"
              unCheckedChildren="关"
              onChange={handleSidebarCollapsed}
            />
          </div>,
          <div class={`${prefixCls}__cell-item`}>
            <span>自动锁屏</span>
            <InputNumber
              size="small"
              defaultValue={appStore.getProjCfg.lockTime}
              formatter={(value: string) => {
                if (parseInt(value) === 0) {
                  return '0(不自动锁屏)';
                }
                return `${value}分钟`;
              }}
              onChange={handleLockTimeChange}
            />
          </div>,
          <div class={`${prefixCls}__cell-item`}>
            <span>菜单展开宽度</span>
            <InputNumber
              disabled={unref(getisHorizontalRef)}
              size="small"
              max={600}
              min={100}
              step={10}
              defaultValue={appStore.getProjCfg.menuSetting.menuWidth}
              formatter={(value: string) => `${parseInt(value)}px`}
              onChange={handleMenuWidthChange}
            />
          </div>,
        ];
      }

      function renderContent() {
        const {
          grayMode,
          colorWeak,
          fullContent,
          showLogo,
          headerSetting: { show: showHeader } = {},
          menuSetting: { show: showMenu } = {},
          multiTabsSetting: { show: showMultiple } = {},
        } = appStore.getProjCfg;
        return [
          <div class={`${prefixCls}__cell-item`}>
            <span>标签页</span>
            <Switch
              checked={showMultiple}
              checkedChildren="开"
              unCheckedChildren="关"
              onChange={handleMultipleCheckChange}
            />
          </div>,

          <div class={`${prefixCls}__cell-item`}>
            <span>左侧菜单</span>
            <Switch
              disabled={unref(getisHorizontalRef)}
              checked={showMenu}
              checkedChildren="开"
              unCheckedChildren="关"
              onChange={handleshowSidebarCheckChange}
            />
          </div>,

          <div class={`${prefixCls}__cell-item`}>
            <span>顶栏</span>
            <Switch
              checked={showHeader}
              checkedChildren="开"
              unCheckedChildren="关"
              onChange={handleshowHeaderCheckChange}
            />
          </div>,

          <div class={`${prefixCls}__cell-item`}>
            <span>菜单头</span>
            <Switch
              checked={showLogo}
              checkedChildren="开"
              unCheckedChildren="关"
              onChange={handleshowLogoCheckChange}
            />
          </div>,
          <div class={`${prefixCls}__cell-item`}>
            <span>全屏内容</span>
            <Switch
              checked={fullContent}
              checkedChildren="开"
              unCheckedChildren="关"
              onChange={handleFullContentCheckChange}
            />
          </div>,
          <div class={`${prefixCls}__cell-item`}>
            <span>灰色模式</span>
            <Switch
              checked={grayMode}
              checkedChildren="开"
              unCheckedChildren="关"
              onChange={handleGrayModeChange}
            />
          </div>,
          <div class={`${prefixCls}__cell-item`}>
            <span>色弱模式</span>
            <Switch
              checked={colorWeak}
              checkedChildren="开"
              unCheckedChildren="关"
              onChange={handleColorWeakChange}
            />
          </div>,
        ];
      }

      return () => (
        // 自定义modal需要写这个 on={listeners}
        <Drawer on={listeners} title="系统配置" width={300} wrapClassName="setting-drawer">
          <Divider>主题颜色</Divider>
          {renderTheme()}
          <Divider>导航栏模式</Divider>
          {renderSidebar()}
          <Divider>界面功能</Divider>
          {renderFeatures()}
          <Divider>界面显示</Divider>
          {renderContent()}
          <Divider />
          <div class="setting-drawer__footer">
            <Button type="primary" block onClick={handleCopy}>
              <Icon type="copy" /> 拷贝
            </Button>
            <Button block class="mt-2" onClick={handleResetSetting}>
              <Icon type="redo" />
              重置
            </Button>
          </div>
        </Drawer>
      );
    },
  });
</script>
<style lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-setting-drawer';

  .setting-drawer {
    .ant-drawer-body {
      padding-top: 0;
    }

    &__footer {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
  .@{prefix-cls} {
    &__cell-item {
      display: flex;
      justify-content: space-between;
      margin: 16px 0;
    }

    &__theme-item {
      display: flex;
      flex-wrap: wrap;
      margin: 16px 0;

      span {
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-top: 10px;
        margin-right: 10px;
        cursor: pointer;
        border-radius: 4px;

        svg {
          display: none;
        }

        &.active {
          svg {
            display: inline-block;
            margin-left: 4px;
            font-size: 0.8em;
            fill: #fff;
          }
        }
      }
    }

    &__siderbar {
      display: flex;

      > div {
        position: relative;

        .check-icon {
          position: absolute;
          top: 40%;
          left: 40%;
          display: none;
          color: @primary-color;

          &.active {
            display: inline-block;
          }
        }
      }

      img {
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }
</style>
