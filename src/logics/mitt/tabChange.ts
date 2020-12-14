/**
 * Used to monitor routing changes to change the status of menus and tabs. There is no need to monitor the route, because the route status change is affected by the page rendering time, which will be slow
 */

import Mitt from '/@/utils/mitt';
import type { RouteLocationNormalized } from 'vue-router';
import { getRoute } from '/@/router/helper/routeHelper';

const mitt = new Mitt();

const key = Symbol();

let lastChangeTab: RouteLocationNormalized;

export function setLastChangeTab(lastChangeRoute: RouteLocationNormalized) {
  mitt.emit(key, getRoute(lastChangeRoute));
  lastChangeTab = getRoute(lastChangeRoute);
}

export function listenerLastChangeTab(
  callback: (route: RouteLocationNormalized) => void,
  immediate = true
) {
  mitt.on(key, callback);
  if (immediate) {
    callback(lastChangeTab);
  }
}
