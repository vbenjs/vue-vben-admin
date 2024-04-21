/**
 * Configure and register global directives
 */
import type { App } from 'vue';
import { setupPermissionDirective } from './permission';
import { setupLoadingDirective } from './loading';
import { setupEllipsisDirective } from './ellipsis';

export function setupGlobDirectives(app: App) {
  setupPermissionDirective(app);
  setupLoadingDirective(app);
  setupEllipsisDirective(app);
}
