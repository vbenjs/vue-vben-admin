import type { RouteLocationNormalizedLoaded } from 'vue-router';

type MatchedRoutes = RouteLocationNormalizedLoaded['matched'];

interface BreadcrumbRoute {
  matched: MatchedRoutes;
  meta: RouteLocationNormalizedLoaded['meta'];
}

type BreadcrumbRouteResolver = (path: string) => { matched: MatchedRoutes };

/**
 * 解析用于渲染当前面包屑的路由匹配记录。
 */
export function resolveBreadcrumbMatches(
  route: BreadcrumbRoute,
  resolveRoute: BreadcrumbRouteResolver,
): MatchedRoutes {
  const { activePath, breadcrumbUseActivePath } = route.meta;

  if (!breadcrumbUseActivePath || !activePath) {
    return route.matched;
  }

  const activeMatches = resolveRoute(activePath).matched;
  if (activeMatches.length === 0) {
    return route.matched;
  }

  const seen = new Set(activeMatches.map((match) => match.name ?? match.path));
  const currentMatches = route.matched.filter((match) => {
    const key = match.name ?? match.path;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });

  return [...activeMatches, ...currentMatches];
}
