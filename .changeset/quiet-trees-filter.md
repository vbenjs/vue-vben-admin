---
'@vben-core/shared': patch
---

fix(@vben-core/shared): keep filterTree from mutating the source tree

`filterTree` wrote the filtered child array back onto the source node (`node[childProps] = _filterTree(node[childProps])`), so every node that failed the predicate was permanently dropped from the input tree.

That input is a module-level constant in real apps: `generateRoutesByFrontend` filters `accessRoutes` on every login and role refresh. After a low-privilege user signed in, the routes removed for them were gone for every later session in the same page, so an admin would end up with an empty `/dashboard` submenu until a full page reload.

`filterTree` is now pure: matched nodes that own a child array are copied, nodes without children are still returned by reference.
