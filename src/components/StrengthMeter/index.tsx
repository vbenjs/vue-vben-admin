import { withInstall } from '../util';

import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

export const StrengthMeter = createAsyncComponent(() => import('./src/index'));

withInstall(StrengthMeter);
