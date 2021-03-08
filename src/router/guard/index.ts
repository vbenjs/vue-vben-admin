import router from '/@/router';

import { createProgressGuard } from './progressGuard';
import { createPermissionGuard } from './permissionGuard';
import { createPageLoadingGuard } from './pageLoadingGuard';
import { createTitleGuard } from './titleGuard';
import { createMessageGuard } from './messageGuard';
import { createScrollGuard } from './scrollGuard';
import { createHttpGuard } from './httpGuard';
import { createPageGuard } from './pageGuard';
import { createStateGuard } from './stateGuard';

createPageGuard(router);
createPageLoadingGuard(router);
createHttpGuard(router);
createScrollGuard(router);
createMessageGuard(router);
createTitleGuard(router);
createProgressGuard(router);
createPermissionGuard(router);
createStateGuard(router);
