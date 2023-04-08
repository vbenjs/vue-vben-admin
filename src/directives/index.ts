/**
 * Configure and register global directives
 */
import type { App } from 'vue';

import { setupEllipsisDirective } from './ellipsis';
import { setupLoadingDirective } from './loading';
import { setupPermissionDirective } from './permission';

export function setupGlobDirectives(app: App) {
  setupPermissionDirective(app);
  setupLoadingDirective(app);
  setupEllipsisDirective(app);
}
