---
'@vben/plugins': patch
---

fix(@vben/plugins): keep vxe grid data reference stable and wrap proxy ajax during setup

- Keep the `data` reference stable when unrelated reactive grid options change (same technique already used for `columns`). Previously `cloneDeep` produced a new array on every recompute, so VXE would overwrite data set through instance methods (`reloadData`, `setMergeCells`, ...) with stale option data.
- Wrap `proxyConfig.ajax` synchronously during setup instead of inside `init()`. `init()` awaits a tick after mount, so the wrapping no longer depends on its async timing: any `query()`/`reload()` after mount is guaranteed to go through the wrapped handlers.
- Wrapping is idempotent and runs a second time after `init()`'s initial option update, so callbacks installed via `setGridOptions()` (e.g. from a parent's `onMounted`) are wrapped as well.
- The wrapped handler resolves the form-value getter at call time from a per-api binding, so when the grid unmounts and remounts with the same api, queries read the current mount's form values instead of the previous mount's.
- A watcher re-wraps `proxyConfig.ajax` callbacks whenever they are replaced after `init()` (e.g. through `api.setGridOptions()`), so later `query()`/`reload()` calls still receive the form values.
- When `gridOptions` is supplied as a prop (priority over api state), the wrapped callbacks are also applied in-place to the cloned options actually passed to `VxeGrid`, so queries still inject the form values; the parent's prop object is never mutated. Wrappers are reused per api and per source function, keeping the callback reference stable across option recomputes.
