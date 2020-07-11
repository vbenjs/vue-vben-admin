import { routerInstance } from '@/router/index';
import store from '@/store/index';
import { createMain } from '@/setup/main/index';

const { getRouteInstance } = routerInstance;

/**
 * @description: create app
 */
createMain({ router: getRouteInstance(), store });
