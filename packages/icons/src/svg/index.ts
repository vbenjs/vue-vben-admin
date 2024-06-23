import { createIcon } from '@vben-core/iconify';

import { loadSvgIcons } from './load';

let loaded = false;
if (!loaded) {
  loadSvgIcons();
  loaded = true;
}

const SvgAvatarIcon = createIcon('svg:avatar');
const SvgDownloadIcon = createIcon('svg:download');
const SvgCardIcon = createIcon('svg:card');
const SvgBellIcon = createIcon('svg:bell');
const SvgCakeIcon = createIcon('svg:cake');

export {
  SvgAvatarIcon,
  SvgBellIcon,
  SvgCakeIcon,
  SvgCardIcon,
  SvgDownloadIcon,
};
