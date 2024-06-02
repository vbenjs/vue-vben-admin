import 'vue-router';

import type { RouteMeta as IRouteMeta } from '@vben-core/typings';

declare module 'vue-router' {
  interface RouteMeta extends IRouteMeta {}
}
