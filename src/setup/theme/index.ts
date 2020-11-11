import { setCssVar } from '/@/hooks/web/useCssVar';
import { isHexColor, colorIsDark, lighten, darken } from '/@/utils/color';
import { appStore } from '/@/store/modules/app';
import { MenuThemeEnum } from '/@/enums/menuEnum';

const HEADER_BG_COLOR_VAR = '--header-bg-color';
const HEADER_BG_HOVER_COLOR_VAR = '--header-bg-hover-color';
const HEADER_MENU_ACTIVE_BG_COLOR_VAR = '--header-active-menu-bg-color';

const SIDER_DARK_BG_COLOR = '--sider-dark-bg-color';
const SIDER_DARK_DARKEN_BG_COLOR = '--sider-dark-darken-bg-color';
const SIDER_LIGHTEN_1_BG_COLOR = '--sider-dark-lighten-1-bg-color';
const SIDER_LIGHTEN_2_BG_COLOR = '--sider-dark-lighten-2-bg-color';

function toggleClass(flag: boolean, clsName: string) {
  const body = document.body;
  let { className } = body;
  className = className.replace(clsName, '');
  document.body.className = flag ? `${className} ${clsName} ` : className;
}

export const updateColorWeak = (colorWeak: boolean) => {
  toggleClass(colorWeak, 'color-weak');
};

export const updateGrayMode = (gray: boolean) => {
  toggleClass(gray, 'gray-mode');
};

export function updateHeaderBgColor(color: string) {
  if (!isHexColor(color)) return;
  // bg color
  setCssVar(HEADER_BG_COLOR_VAR, color);

  // hover color
  const hoverColor = lighten(color, 6);
  setCssVar(HEADER_BG_HOVER_COLOR_VAR, hoverColor);
  setCssVar(HEADER_MENU_ACTIVE_BG_COLOR_VAR, hoverColor);

  const isDark = colorIsDark(color);

  appStore.commitProjectConfigState({
    headerSetting: {
      theme: isDark ? MenuThemeEnum.DARK : MenuThemeEnum.LIGHT,
    },
  });
}

export function updateSidebarBgColor(color: string) {
  if (!isHexColor(color)) return;

  setCssVar(SIDER_DARK_BG_COLOR, color);
  setCssVar(SIDER_DARK_DARKEN_BG_COLOR, darken(color, 6));
  setCssVar(SIDER_LIGHTEN_1_BG_COLOR, lighten(color, 4));
  setCssVar(SIDER_LIGHTEN_2_BG_COLOR, lighten(color, 8));

  // only #ffffff is light
  const isLight = ['#fff', '#ffffff'].includes(color.toLowerCase());

  appStore.commitProjectConfigState({
    menuSetting: {
      theme: isLight ? MenuThemeEnum.LIGHT : MenuThemeEnum.DARK,
    },
  });
}
