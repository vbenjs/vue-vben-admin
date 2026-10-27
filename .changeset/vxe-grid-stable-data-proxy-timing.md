---
'@vben/plugins': patch
---

fix(@vben/plugins): keep vxe grid data reference stable and wrap proxy ajax during setup

- Keep the `data` reference stable when unrelated reactive grid options change (same technique already used for `columns`). Previously `cloneDeep` produced a new array on every recompute, so VXE would overwrite data set through instance methods (`reloadData`, `setMergeCells`, ...) with stale option data.
- Wrap `proxyConfig.ajax` synchronously during setup instead of inside `init()`. `init()` awaits a tick after mount, so the wrapping no longer depends on its async timing: any `query()`/`reload()` after mount is guaranteed to go through the wrapped handlers.
- Wrapping is idempotent and runs a second time after `init()`'s initial option update, so callbacks installed via `setGridOptions()` (e.g. from a parent's `onMounted`) are wrapped as well.
