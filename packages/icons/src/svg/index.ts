import { createIconifyIcon } from '@vben-core/icons';

import { loadSvgIcons } from './load';

let loaded = false;
if (!loaded) {
  loadSvgIcons();
  loaded = true;
}

const SvgAvatar1Icon = createIconifyIcon('svg:avatar-1');
const SvgAvatar2Icon = createIconifyIcon('svg:avatar-2');
const SvgAvatar3Icon = createIconifyIcon('svg:avatar-3');
const SvgAvatar4Icon = createIconifyIcon('svg:avatar-4');
const SvgDownloadIcon = createIconifyIcon('svg:download');
const SvgCardIcon = createIconifyIcon('svg:card');
const SvgBellIcon = createIconifyIcon('svg:bell');
const SvgCakeIcon = createIconifyIcon('svg:cake');

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
