import type { ProjectConfig } from '/@/types/config';

import defaultSetting from '/@/settings/projectSetting';

import { defineComponent, computed, unref, FunctionalComponent } from 'vue';
import { BasicDrawer } from '/@/components/Drawer/index';
import { Divider, Switch, Tooltip, InputNumber, Select } from 'ant-design-vue';
import Button from '/@/components/Button/index.vue';
import { CopyOutlined, RedoOutlined, CheckOutlined } from '@ant-design/icons-vue';

import { MenuTypeEnum } from '/@/enums/menuEnum';
import { appStore } from '/@/store/modules/app';

import { useMessage } from '/@/hooks/web/useMessage';
import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';
import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';

import { updateColorWeak, updateGrayMode } from '/@/setup/theme';

import { baseHandler } from './handler';

import {
  HandlerEnum,
  contentModeOptions,
  topMenuAlignOptions,
  menuTriggerOptions,
  routerTransitionOptions,
  menuTypeList,
} from './enum';

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

interface ThemePickerProps {
  colorList: string[];
  handler: Fn;
  def: string;
}

const { createSuccessModal, createMessage } = useMessage();

/**
 * Menu type Picker comp
 */
const MenuTypePicker: FunctionalComponent = () => {
  const { getIsHorizontal, getMenuType } = useMenuSetting();
  return (
    <div class={`setting-drawer__siderbar`}>
      {menuTypeList.map((item) => {
        const { title, type: ItemType, mode, src } = item;
        return (
          <Tooltip title={title} placement="bottom" key={title}>
            {{
              default: () => (
                <div
                  onClick={baseHandler.bind(null, HandlerEnum.CHANGE_LAYOUT, {
                    mode: mode,
                    type: ItemType,
                    split: unref(getIsHorizontal) ? false : undefined,
                  })}
                >
                  <CheckOutlined
                    class={['check-icon', unref(getMenuType) === ItemType ? 'active' : '']}
                  />
                  <img src={src} />
                </div>
              ),
            }}
          </Tooltip>
        );
      })}
    </div>
  );
};

const ThemePicker: FunctionalComponent<ThemePickerProps> = (props) => {
  return (
    <div class={`setting-drawer__theme-item`}>
      {props.colorList.map((color) => {
        return (
          <span
            onClick={() => props.handler?.(color)}
            key={color}
            class={[props.def === color ? 'active' : '']}
            style={{
              background: color,
            }}
          >
            <CheckOutlined class="icon" />
          </span>
        );
      })}
    </div>
  );
};

/**
 * FooterButton component
 */
const FooterButton: FunctionalComponent = () => {
  const { getRootSetting } = useRootSetting();
  function handleCopy() {
    const { isSuccessRef } = useCopyToClipboard(JSON.stringify(unref(getRootSetting), null, 2));
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
    appStore.resumeAllState();
    location.reload();
  }

  return (
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
  );
};

export default defineComponent({
  name: 'SettingDrawer',
  setup(_, { attrs }) {
    const {
      getContentMode,
      getShowFooter,
      getShowBreadCrumb,
      getShowBreadCrumbIcon,
      getShowLogo,
      getFullContent,
      getColorWeak,
      getGrayMode,
    } = useRootSetting();

    const {
      getOpenPageLoading,
      getBasicTransition,
      getEnableTransition,
      getOpenNProgress,
    } = useTransitionSetting();

    const {
      getIsHorizontal,
      getShowMenu,
      getMenuType,
      getTrigger,
      getCollapsedShowTitle,
      getMenuFixed,
      getCollapsed,
      getShowSearch,
      getCanDrag,
      getTopMenuAlign,
      getAccordion,
      getMenuWidth,
      getMenuBgColor,
      getIsTopMenu,
      getSplit,
    } = useMenuSetting();

    const { getShowHeader, getFixed: getHeaderFixed, getHeaderBgColor } = useHeaderSetting();

    const { getShowMultipleTab, getShowQuick } = useMultipleTabSetting();

    const getShowMenuRef = computed(() => {
      return unref(getShowMenu) && !unref(getIsHorizontal);
    });

    function renderSidebar() {
      return (
        <>
          <MenuTypePicker />
          {renderSwitchItem('分割菜单', {
            handler: (e) => {
              baseHandler(HandlerEnum.MENU_SPLIT, e);
            },
            def: unref(getSplit),
            disabled: !unref(getShowMenuRef) || unref(getMenuType) !== MenuTypeEnum.MIX,
          })}
        </>
      );
    }

    function renderTheme() {
      return (
        <>
          <Divider>{() => '顶栏主题'}</Divider>
          <ThemePicker
            colorList={HEADER_PRESET_BG_COLOR_LIST}
            def={unref(getHeaderBgColor)}
            handler={(e) => {
              baseHandler(HandlerEnum.HEADER_THEME, e);
            }}
          />
          <Divider>{() => '菜单主题'}</Divider>
          <ThemePicker
            colorList={SIDE_BAR_BG_COLOR_LIST}
            def={unref(getMenuBgColor)}
            handler={(e) => {
              baseHandler(HandlerEnum.MENU_THEME, e);
            }}
          />
        </>
      );
    }

    /**
     * @description:
     */
    function renderFeatures() {
      return [
        renderSwitchItem('侧边菜单拖拽', {
          handler: (e) => {
            baseHandler(HandlerEnum.MENU_HAS_DRAG, e);
          },
          def: unref(getCanDrag),
          disabled: !unref(getShowMenuRef),
        }),
        renderSwitchItem('侧边菜单搜索', {
          handler: (e) => {
            baseHandler(HandlerEnum.MENU_SHOW_SEARCH, e);
          },
          def: unref(getShowSearch),
          disabled: !unref(getShowMenuRef),
        }),
        renderSwitchItem('侧边菜单手风琴模式', {
          handler: (e) => {
            baseHandler(HandlerEnum.MENU_ACCORDION, e);
          },
          def: unref(getAccordion),
          disabled: !unref(getShowMenuRef),
        }),
        renderSwitchItem('折叠菜单', {
          handler: (e) => {
            baseHandler(HandlerEnum.MENU_COLLAPSED, e);
          },
          def: unref(getCollapsed),
          disabled: !unref(getShowMenuRef),
        }),
        renderSwitchItem('折叠菜单显示名称', {
          handler: (e) => {
            baseHandler(HandlerEnum.MENU_COLLAPSED_SHOW_TITLE, e);
          },
          def: unref(getCollapsedShowTitle),
          disabled: !unref(getShowMenuRef) || !unref(getCollapsed),
        }),
        renderSwitchItem('固定header', {
          handler: (e) => {
            baseHandler(HandlerEnum.HEADER_FIXED, e);
          },
          def: unref(getHeaderFixed),
          disabled: !unref(getShowHeader),
        }),
        renderSwitchItem('固定Siderbar', {
          handler: (e) => {
            baseHandler(HandlerEnum.MENU_FIXED, e);
          },
          def: unref(getMenuFixed),
          disabled: !unref(getShowMenuRef),
        }),
        renderSelectItem('顶部菜单布局', {
          handler: (e) => {
            baseHandler(HandlerEnum.MENU_TOP_ALIGN, e);
          },
          def: unref(getTopMenuAlign),
          options: topMenuAlignOptions,
          disabled: !unref(getShowHeader) || (!unref(getIsTopMenu) && !unref(getSplit)),
        }),
        renderSelectItem('菜单折叠按钮', {
          handler: (e) => {
            baseHandler(HandlerEnum.MENU_TRIGGER, e);
          },
          disabled: !unref(getShowMenuRef),
          def: unref(getTrigger),
          options: menuTriggerOptions,
        }),

        renderSelectItem('内容区域宽度', {
          handler: (e) => {
            baseHandler(HandlerEnum.CONTENT_MODE, e);
          },
          def: unref(getContentMode),
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
            defaultValue={unref(getMenuWidth)}
            formatter={(value: string) => `${parseInt(value)}px`}
            onChange={(e: any) => {
              baseHandler(HandlerEnum.MENU_WIDTH, e);
            }}
          />
        </div>,
      ];
    }

    function renderContent() {
      return [
        renderSwitchItem('面包屑', {
          handler: (e) => {
            baseHandler(HandlerEnum.SHOW_BREADCRUMB, e);
          },
          def: unref(getShowBreadCrumb),
          disabled: !unref(getShowHeader),
        }),
        renderSwitchItem('面包屑图标', {
          handler: (e) => {
            baseHandler(HandlerEnum.SHOW_BREADCRUMB_ICON, e);
          },
          def: unref(getShowBreadCrumbIcon),
          disabled: !unref(getShowHeader),
        }),
        renderSwitchItem('标签页', {
          handler: (e) => {
            baseHandler(HandlerEnum.TABS_SHOW, e);
          },
          def: unref(getShowMultipleTab),
        }),
        renderSwitchItem('标签页快捷按钮', {
          handler: (e) => {
            baseHandler(HandlerEnum.TABS_SHOW_QUICK, e);
          },
          def: unref(getShowQuick),
          disabled: !unref(getShowMultipleTab),
        }),

        renderSwitchItem('左侧菜单', {
          handler: (e) => {
            baseHandler(HandlerEnum.MENU_SHOW_SIDEBAR, e);
          },
          def: unref(getShowMenu),
          disabled: unref(getIsHorizontal),
        }),
        renderSwitchItem('顶栏', {
          handler: (e) => {
            baseHandler(HandlerEnum.HEADER_SHOW, e);
          },
          def: unref(getShowHeader),
        }),
        renderSwitchItem('Logo', {
          handler: (e) => {
            baseHandler(HandlerEnum.SHOW_LOGO, e);
          },
          def: unref(getShowLogo),
        }),
        renderSwitchItem('页脚', {
          handler: (e) => {
            baseHandler(HandlerEnum.SHOW_FOOTER, e);
          },
          def: unref(getShowFooter),
        }),
        renderSwitchItem('全屏内容', {
          handler: (e) => {
            baseHandler(HandlerEnum.FULL_CONTENT, e);
          },
          def: unref(getFullContent),
        }),
        renderSwitchItem('灰色模式', {
          handler: (e) => {
            baseHandler(HandlerEnum.GRAY_MODE, e);
          },
          def: unref(getGrayMode),
        }),
        renderSwitchItem('色弱模式', {
          handler: (e) => {
            baseHandler(HandlerEnum.COLOR_WEAK, e);
          },
          def: unref(getColorWeak),
        }),
      ];
    }

    function renderTransition() {
      return (
        <>
          {renderSwitchItem('顶部进度条', {
            handler: (e) => {
              baseHandler(HandlerEnum.OPEN_PROGRESS, e);
            },
            def: unref(getOpenNProgress),
          })}
          {renderSwitchItem('切换loading', {
            handler: (e) => {
              baseHandler(HandlerEnum.OPEN_PAGE_LOADING, e);
            },
            def: unref(getOpenPageLoading),
            disabled: !unref(getEnableTransition),
          })}

          {renderSwitchItem('切换动画', {
            handler: (e) => {
              baseHandler(HandlerEnum.OPEN_ROUTE_TRANSITION, e);
            },
            def: unref(getEnableTransition),
          })}

          {renderSelectItem('动画类型', {
            handler: (e) => {
              baseHandler(HandlerEnum.ROUTER_TRANSITION, e);
            },
            def: unref(getBasicTransition),
            options: routerTransitionOptions,
            disabled: !unref(getEnableTransition),
          })}
        </>
      );
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
              <FooterButton />
            </>
          ),
        }}
      </BasicDrawer>
    );
  },
});
