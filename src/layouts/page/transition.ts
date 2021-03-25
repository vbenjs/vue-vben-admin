import type { FunctionalComponent } from 'vue';
import type { RouteLocation } from 'vue-router';

export interface DefaultContext {
  Component: FunctionalComponent & { type: Indexable };
  route: RouteLocation;
}

export function getTransitionName({
  route,
  openCache,
  cacheTabs,
  enableTransition,
  def,
}: Pick<DefaultContext, 'route'> & {
  enableTransition: boolean;
  openCache: boolean;
  def: string;
  cacheTabs: string[];
}) {
  if (!enableTransition) {
    return null;
  }

  const isInCache = cacheTabs.includes(route.name as string);
  const transitionName = 'fade-slide';
  let name: string | null = transitionName;

  if (openCache) {
    name = isInCache && route.meta.loaded ? transitionName : null;
  }
  return name || route.meta.transitionName || def;
}
