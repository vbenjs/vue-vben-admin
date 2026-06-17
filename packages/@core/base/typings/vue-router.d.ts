import type { RouteMeta as IRouteMeta } from './dist/index.d.mts';

import 'vue-router';

declare module 'vue-router' {
  // oxlint-disable-next-line typescript/no-empty-object-type
  interface RouteMeta extends IRouteMeta {}
}
