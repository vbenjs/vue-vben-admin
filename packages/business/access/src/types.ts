import type {
  ComponentRecordType,
  RouteRecordStringComponent,
} from '@vben/types';
import type { RouteRecordRaw, Router } from 'vue-router';

interface GeneratorMenuAndRoutesOptions {
  fetchMenuListAsync?: () => Promise<RouteRecordStringComponent[]>;
  forbiddenComponent?: RouteRecordRaw['component'];
  layoutMap?: ComponentRecordType;
  pageMap?: ComponentRecordType;
  roles?: string[];
  router: Router;
  routes: RouteRecordRaw[];
}

export type { GeneratorMenuAndRoutesOptions };
