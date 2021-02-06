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
  const r = getRoute(lastChangeRoute);
  mitt.emit(key, r);
  lastChangeTab = r;
}

export function listenerLastChangeTab(
  callback: (route: RouteLocationNormalized) => void,
  immediate = true
) {
  mitt.on(key, callback);
  immediate && lastChangeTab && callback(lastChangeTab);
}

export function removeTabChangeListener() {
  mitt.clear();
}
