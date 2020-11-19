/**
 * Configure and register global directives
 */
import type { App } from 'vue';
import { setupPermissionDirective } from './permission';

export function setupGlobDirectives(app: App) {
  setupPermissionDirective(app);
}
