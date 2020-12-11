import { withInstall } from '../util';

import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

export const VScroll = createAsyncComponent(() => import('./src/index'));

withInstall(VScroll);
