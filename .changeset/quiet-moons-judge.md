---
'@vben-core/tabs-ui': patch
'@vben-core/typings': patch
'@vben/common-ui': patch
'@vben/types': patch
'@vben/vite-config': patch
'@vben/vsh': patch
---

fix: resolve existing type errors surfaced by workspace-wide typecheck

Note: `@vben-core/typings` removes the `./vue-router` export subpath and
renames the underlying interface to `VbenRouteMeta` — the vue-router
`RouteMeta` augmentation now activates via the package barrel (or the
`@vben/types` re-export), and `@vben/types`' `global.d.ts` no longer
re-declares it.
