import { defineComponent, computed, unref, ref } from 'vue';
import { BasicDrawer } from '/@/components/Drawer/index';
import { Divider, Switch, Tooltip, InputNumber, Select } from 'ant-design-vue';
import Button from '/@/components/Button/index.vue';
import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum';
import { CopyOutlined, RedoOutlined, CheckOutlined } from '@ant-design/icons-vue';
import { appStore } from '/@/store/modules/app';
import { userStore } from '/@/store/modules/user';
import { ProjectConfig } from '/@/types/config';

import { useMessage } from '/@/hooks/web/useMessage';
import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';

import defaultSetting from '/@/settings/projectSetting';

import mixImg from '/@/assets/images/layout/menu-mix.svg';
import sidebarImg from '/@/assets/images/layout/menu-sidebar.svg';
import menuTopImg from '/@/assets/images/layout/menu-top.svg';
import { updateColorWeak, updateGrayMode } from '/@/setup/theme';
import { baseHandler } from './handler';
import {
  HandlerEnum,
  contentModeOptions,
  topMenuAlignOptions,
  menuTriggerOptions,
  routerTransitionOptions,
} from './const';
import { HEADER_PRESET_BG_COLOR_LIST, SIDE_BAR_BG_COLOR_LIST } from '/@/settings/colorSetting';

interface SwitchOptions {
  config?: DeepPartial<ProjectConfig>;
  def?: any;
  disabled?: boolean;
  handler?: Fn;
}

interface SelectConfig {
  options?: LabelValueOptions;
  def?: any;
  disabled?: boolean;
  handler?: Fn;
}

interface ThemeOptions {
  def?: string;
  handler?: Fn;
}

export default defineComponent({
  name: 'SettingDrawer',
  setup(_, { attrs }) {
    const { createSuccessModal, createMessage } = useMessage();

    const getProjectConfigRef = computed(() => {
      return appStore.getProjectConfig;
    });

    const getIsHorizontalRef = computed(() => {
      return unref(getProjectConfigRef).menuSetting.mode === MenuModeEnum.HORIZONTAL;
    });

    const getShowHeaderRef = computed(() => {
      return unref(getProjectConfigRef).headerSetting.show;
    });

    const getShowMenuRef = computed(() => {
      return unref(getProjectConfigRef).menuSetting.show && !unref(getIsHorizontalRef);
    });

    const getShowTabsRef = computed(() => {
      return unref(getProjectConfigRef).multiTabsSetting.show;
    });

    function handleCopy() {
      const { isSuccessRef } = useCopyToClipboard(
        JSON.stringify(unref(getProjectConfigRef), null, 2)
      );
      unref(isSuccessRef) &&
        createSuccessModal({
          title: '操作成功',
          content: '复制成功,请到 src/settings/projectSetting.ts 中修改配置！',
        });
    }

    function handleResetSetting() {
      try {
        appStore.commitProjectConfigState(defaultSetting);
        const { colorWeak, grayMode } = defaultSetting;
        // updateTheme(themeColor);
        updateColorWeak(colorWeak);
        updateGrayMode(grayMode);
        createMessage.success('重置成功！');
      } catch (error) {
        createMessage.error(error);
      }
    }

    function handleClearAndRedo() {
      localStorage.clear();
      userStore.resumeAllState();
      location.reload();
    }

    function renderSidebar() {
      const {
        menuSetting: { type, split },
      } = unref(getProjectConfigRef);

      const typeList = ref([
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
      ]);
      return [
        <div class={`setting-drawer__siderbar`}>
          {unref(typeList).map((item) => {
            const { title, type: ItemType, mode, src } = item;
            return (
              <Tooltip title={title} placement="bottom" key={title}>
                {{
                  default: () => (
                    <div
                      onClick={baseHandler.bind(null, HandlerEnum.CHANGE_LAYOUT, {
                        mode: mode,
                        type: ItemType,
                        split: unref(getIsHorizontalRef) ? false : undefined,
                      })}
                    >
                      <CheckOutlined class={['check-icon', type === ItemType ? 'active' : '']} />
                      <img src={src} />
                    </div>
                  ),
                }}
              </Tooltip>
            );
          })}
        </div>,
        renderSwitchItem('分割菜单', {
          handler: (e) => {
            baseHandler(HandlerEnum.MENU_SPLIT, e);
          },
          def: split,
          disabled: !unref(getShowMenuRef) || type !== MenuTypeEnum.MIX,
        }),
        // renderSelectItem('顶栏主题', {
        //   handler: (e) => {
        //     baseHandler(HandlerEnum.HEADER_THEME, e);
        //   },
        //   def: headerTheme,
        //   options: themeOptions,
        //   disabled: !unref(getShowHeaderRef),
        // }),
        // renderSelectItem('菜单主题', {
        //   handler: (e) => {
        //     baseHandler(HandlerEnum.MENU_THEME, e);
        //   },
        //   def: menuTheme,
        //   options: themeOptions,
        //   disabled: !unref(getShowMenuRef),
        // }),
      ];
    }
    /**
     * @description:
     */
    function renderFeatures() {
      const {
        contentMode,
        headerSetting: { fixed },
        menuSetting: {
          hasDrag,
          collapsed,
          showSearch,
          menuWidth,
          topMenuAlign,
          collapsedShowTitle,
          trigger,
          accordion,
        } = {},
      } = appStore.getProjectConfig;
      return [
        renderSwitchItem('侧边菜单拖拽', {
          handler: (e) => {
            baseHandler(HandlerEnum.MENU_HAS_DRAG, e);
          },
          def: hasDrag,
          disabled: !unref(getShowMenuRef),
        }),
        renderSwitchItem('侧边菜单搜索', {
          handler: (e) => {
            baseHandler(HandlerEnum.MENU_SHOW_SEARCH, e);
          },
          def: showSearch,
          disabled: !unref(getShowMenuRef),
        }),
        renderSwitchItem('侧边菜单手风琴模式', {
          handler: (e) => {
            baseHandler(HandlerEnum.MENU_ACCORDION, e);
          },
          def: accordion,
          disabled: !unref(getShowMenuRef),
        }),
        renderSwitchItem('折叠菜单', {
          handler: (e) => {
            baseHandler(HandlerEnum.MENU_COLLAPSED, e);
          },
          def: collapsed,
          disabled: !unref(getShowMenuRef),
        }),
        renderSwitchItem('折叠菜单显示名称', {
          handler: (e) => {
            baseHandler(HandlerEnum.MENU_COLLAPSED_SHOW_TITLE, e);
          },
          def: collapsedShowTitle,
          disabled: !unref(getShowMenuRef) || !collapsed,
        }),
        renderSwitchItem('固定header', {
          handler: (e) => {
            baseHandler(HandlerEnum.HEADER_FIXED, e);
          },
          def: fixed,
          disabled: !unref(getShowHeaderRef),
        }),
        renderSelectItem('顶部菜单布局', {
          handler: (e) => {
            baseHandler(HandlerEnum.MENU_TOP_ALIGN, e);
          },
          def: topMenuAlign,
          options: topMenuAlignOptions,
          disabled: !unref(getShowHeaderRef),
        }),
        renderSelectItem('菜单折叠按钮', {
          handler: (e) => {
            baseHandler(HandlerEnum.MENU_TRIGGER, e);
          },
          def: trigger,
          options: menuTriggerOptions,
        }),

        renderSelectItem('内容区域宽度', {
          handler: (e) => {
            baseHandler(HandlerEnum.CONTENT_MODE, e);
          },
          def: contentMode,
          options: contentModeOptions,
        }),
        <div class={`setting-drawer__cell-item`}>
          <span>自动锁屏</span>
          <InputNumber
            style="width:120px"
            size="small"
            min={0}
            onChange={(e: any) => {
              baseHandler(HandlerEnum.LOCK_TIME, e);
            }}
            defaultValue={appStore.getProjectConfig.lockTime}
            formatter={(value: string) => {
              if (parseInt(value) === 0) {
                return '0(不自动锁屏)';
              }
              return `${value}分钟`;
            }}
          />
        </div>,
        <div class={`setting-drawer__cell-item`}>
          <span>菜单展开宽度</span>
          <InputNumber
            style="width:120px"
            size="small"
            max={600}
            min={100}
            step={10}
            disabled={!unref(getShowMenuRef)}
            defaultValue={menuWidth}
            formatter={(value: string) => `${parseInt(value)}px`}
            onChange={(e: any) => {
              baseHandler(HandlerEnum.MENU_WIDTH, e);
            }}
          />
        </div>,
      ];
    }
    function renderTransition() {
      const { routerTransition, openRouterTransition, openPageLoading } = appStore.getProjectConfig;

      return (
        <>
          {renderSwitchItem('页面切换loading', {
            handler: (e) => {
              baseHandler(HandlerEnum.OPEN_PAGE_LOADING, e);
            },
            def: openPageLoading,
          })}
          {renderSwitchItem('切换动画', {
            handler: (e) => {
              baseHandler(HandlerEnum.OPEN_ROUTE_TRANSITION, e);
            },
            def: openRouterTransition,
          })}
          {renderSelectItem('路由动画', {
            handler: (e) => {
              baseHandler(HandlerEnum.ROUTER_TRANSITION, e);
            },
            def: routerTransition,
            options: routerTransitionOptions,
            disabled: !openRouterTransition,
          })}
        </>
      );
    }
    function renderContent() {
      const {
        grayMode,
        colorWeak,
        fullContent,
        showLogo,
        headerSetting: { show: showHeader },
        menuSetting: { show: showMenu },
        multiTabsSetting: { show: showMultiple, showQuick, showIcon: showTabIcon },
        showBreadCrumb,
        showBreadCrumbIcon,
      } = unref(getProjectConfigRef);
      return [
        renderSwitchItem('面包屑', {
          handler: (e) => {
            baseHandler(HandlerEnum.SHOW_BREADCRUMB, e);
          },
          def: showBreadCrumb,
          disabled: !unref(getShowHeaderRef),
        }),
        renderSwitchItem('面包屑图标', {
          handler: (e) => {
            baseHandler(HandlerEnum.SHOW_BREADCRUMB_ICON, e);
          },
          def: showBreadCrumbIcon,
          disabled: !unref(getShowHeaderRef),
        }),
        renderSwitchItem('标签页', {
          handler: (e) => {
            baseHandler(HandlerEnum.TABS_SHOW, e);
          },
          def: showMultiple,
        }),
        renderSwitchItem('标签页快捷按钮', {
          handler: (e) => {
            baseHandler(HandlerEnum.TABS_SHOW_QUICK, e);
          },
          def: showQuick,
          disabled: !unref(getShowTabsRef),
        }),
        renderSwitchItem('标签页图标', {
          handler: (e) => {
            baseHandler(HandlerEnum.TABS_SHOW_ICON, e);
          },
          def: showTabIcon,
          disabled: !unref(getShowTabsRef),
        }),
        renderSwitchItem('左侧菜单', {
          handler: (e) => {
            baseHandler(HandlerEnum.MENU_SHOW_SIDEBAR, e);
          },
          def: showMenu,
          disabled: unref(getIsHorizontalRef),
        }),
        renderSwitchItem('顶栏', {
          handler: (e) => {
            baseHandler(HandlerEnum.HEADER_SHOW, e);
          },
          def: showHeader,
        }),
        renderSwitchItem('Logo', {
          handler: (e) => {
            baseHandler(HandlerEnum.SHOW_LOGO, e);
          },
          def: showLogo,
        }),
        renderSwitchItem('全屏内容', {
          handler: (e) => {
            baseHandler(HandlerEnum.FULL_CONTENT, e);
          },
          def: fullContent,
        }),
        renderSwitchItem('灰色模式', {
          handler: (e) => {
            baseHandler(HandlerEnum.GRAY_MODE, e);
          },
          def: grayMode,
        }),
        renderSwitchItem('色弱模式', {
          handler: (e) => {
            baseHandler(HandlerEnum.COLOR_WEAK, e);
          },
          def: colorWeak,
        }),
      ];
    }

    function renderSelectItem(text: string, config?: SelectConfig) {
      const { handler, def, disabled = false, options } = config || {};
      const opt = def ? { value: def, defaultValue: def } : {};
      return (
        <div class={`setting-drawer__cell-item`}>
          <span>{text}</span>
          <Select
            {...opt}
            disabled={disabled}
            size="small"
            style={{ width: '120px' }}
            onChange={(e) => {
              handler && handler(e);
            }}
            options={options}
          />
        </div>
      );
    }

    function renderSwitchItem(text: string, options?: SwitchOptions) {
      const { handler, def, disabled = false } = options || {};
      const opt = def ? { checked: def } : {};
      return (
        <div class={`setting-drawer__cell-item`}>
          <span>{text}</span>
          <Switch
            {...opt}
            disabled={disabled}
            onChange={(e: any) => {
              handler && handler(e);
            }}
            checkedChildren="开"
            unCheckedChildren="关"
          />
        </div>
      );
    }

    function renderTheme() {
      const { headerBgColor, menuBgColor } = unref(getProjectConfigRef);
      return (
        <>
          <Divider>{() => '顶栏主题'}</Divider>
          {renderThemeItem(HEADER_PRESET_BG_COLOR_LIST, {
            def: headerBgColor,
            handler: (e) => {
              baseHandler(HandlerEnum.HEADER_THEME, e);
            },
          })}
          <Divider>{() => '菜单主题'}</Divider>
          {renderThemeItem(SIDE_BAR_BG_COLOR_LIST, {
            def: menuBgColor,
            handler: (e) => {
              baseHandler(HandlerEnum.MENU_THEME, e);
            },
          })}
        </>
      );
    }

    function renderThemeItem(colorList: string[], opt: ThemeOptions) {
      const { def, handler } = opt;
      return (
        <div class={`setting-drawer__theme-item`}>
          {colorList.map((item) => {
            return (
              <span
                onClick={() => handler && handler(item)}
                key={item}
                class={[def === item ? 'active' : '']}
                style={{
                  background: item,
                }}
              >
                <CheckOutlined class="icon" />
              </span>
            );
          })}
        </div>
      );
    }

    return () => (
      <BasicDrawer {...attrs} title="项目配置" width={300} wrapClassName="setting-drawer">
        {{
          default: () => (
            <>
              <Divider>{() => '导航栏模式'}</Divider>
              {renderSidebar()}

              {renderTheme()}

              <Divider>{() => '界面功能'}</Divider>
              {renderFeatures()}
              <Divider>{() => '界面显示'}</Divider>
              {renderContent()}
              <Divider>{() => '切换动画'}</Divider>
              {renderTransition()}
              <Divider />
              <div class="setting-drawer__footer">
                <Button type="primary" block onClick={handleCopy}>
                  {() => (
                    <>
                      <CopyOutlined class="mr-2" />
                      拷贝
                    </>
                  )}
                </Button>
                <Button block class="mt-2" onClick={handleResetSetting} color="warning">
                  {() => (
                    <>
                      <RedoOutlined class="mr-2" />
                      重置
                    </>
                  )}
                </Button>
                <Button block class="mt-2" onClick={handleClearAndRedo} color="error">
                  {() => (
                    <>
                      <RedoOutlined class="mr-2" />
                      清空缓存并返回登录页
                    </>
                  )}
                </Button>
              </div>
            </>
          ),
        }}
      </BasicDrawer>
    );
  },
});
