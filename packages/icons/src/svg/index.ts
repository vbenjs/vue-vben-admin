import { createIcon } from '@vben-core/iconify';

import { loadSvgIcons } from './load';

let loaded = false;
if (!loaded) {
  loadSvgIcons();
  loaded = true;
}

const SvgAvatarIcon = createIcon('svg:avatar');

export { SvgAvatarIcon };
