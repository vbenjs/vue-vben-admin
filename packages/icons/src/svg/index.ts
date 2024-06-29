import { createIcon } from '@vben-core/iconify';

import { loadSvgIcons } from './load';

let loaded = false;
if (!loaded) {
  loadSvgIcons();
  loaded = true;
}

const SvgAvatar1Icon = createIcon('svg:avatar-1');
const SvgAvatar2Icon = createIcon('svg:avatar-2');
const SvgAvatar3Icon = createIcon('svg:avatar-3');
const SvgAvatar4Icon = createIcon('svg:avatar-4');
const SvgDownloadIcon = createIcon('svg:download');
const SvgCardIcon = createIcon('svg:card');
const SvgBellIcon = createIcon('svg:bell');
const SvgCakeIcon = createIcon('svg:cake');

export {
  SvgAvatar1Icon,
  SvgAvatar2Icon,
  SvgAvatar3Icon,
  SvgAvatar4Icon,
  SvgBellIcon,
  SvgCakeIcon,
  SvgCardIcon,
  SvgDownloadIcon,
};
