import type { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router'

export const getRawRoute = (
  route: RouteLocationNormalized,
): RouteLocationNormalized => {
  if (!route) {
    return route
  }
  const { matched, ...opt } = route
  return {
    ...opt,
    matched: (matched
      ? matched.map((item) => ({
          meta: item.meta,
          name: item.name,
          path: item.path,
        }))
      : undefined) as RouteRecordNormalized[],
  }
}
