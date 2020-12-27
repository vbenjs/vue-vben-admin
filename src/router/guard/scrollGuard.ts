import type { RouteLocationNormalized, Router } from 'vue-router';

const isHash = (href: string) => {
  return /^#/.test(href);
};

export function createScrollGuard(router: Router) {
  const body = document.body;

  router.afterEach(async (to) => {
    // scroll top
    isHash((to as RouteLocationNormalized & { href: string })?.href) && body.scrollTo(0, 0);
    return true;
  });
}
