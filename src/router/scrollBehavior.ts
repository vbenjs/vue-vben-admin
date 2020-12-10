// see https://github.com/vuejs/vue-router-next/blob/master/playground/scrollWaiter.ts
import type { RouteLocationNormalized } from 'vue-router';
// class ScrollQueue {
//   private resolve: (() => void) | null = null;
//   private promise: Promise<any> | null = null;

//   add() {
//     this.promise = new Promise((resolve) => {
//       this.resolve = resolve as () => void;
//     });
//   }

//   flush() {
//     this.resolve && this.resolve();
//     this.resolve = null;
//     this.promise = null;
//   }

//   async wait() {
//     await this.promise;
//   }
// }
// const scrollWaiter = new ScrollQueue();

/**
 * Handles the scroll behavior on route navigation
 *
 * @param {object} to Route object of next page
 * @param {object} from Route object of previous page
 * @param {object} savedPosition Used by popstate navigations
 * @returns {(object|boolean)} Scroll position or `false`
 */
// @ts-ignore
export async function scrollBehavior(to, from, savedPosition) {
  // await scrollWaiter.wait();
  // Use predefined scroll behavior if defined, defaults to no scroll behavior
  const behavior = 'smooth';
  // Returning the `savedPosition` (if available) will result in a native-like
  // behavior when navigating with back/forward buttons
  if (savedPosition) {
    return { ...savedPosition, behavior };
  }

  // Scroll to anchor by returning the selector
  if (to.hash) {
    return { el: decodeURI(to.hash), behavior };
  }

  // Check if any matched route config has meta that discourages scrolling to top
  if (to.matched.some((m: RouteLocationNormalized) => m.meta.scrollToTop === false)) {
    // Leave scroll as it is
    return false;
  }

  // Always scroll to top
  return { left: 0, top: 0, behavior };
}
