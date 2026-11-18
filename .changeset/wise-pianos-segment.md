---
'@vben/plugins': minor
'@vben-core/form-ui': patch
'@vben-core/composables': patch
---

feat(vxe-table): segmented layout for the search form and table body.

- add `segmented` (`false` / `zone` / `card`) to split the grid into two sections with independently customizable radius and background via `sectionOptions` (`form` / `body` surfaces, `gap`, fullscreen background)
- add `formClass` for the form surface
- extend `separator` with `class`, `style` and `fullBleed`; the separator is now an in-flow decorative element, and the full-bleed width is measured from the actual grid padding (works with custom `gridClass` padding and fullscreen)
- layout changes (search form toggle, collapse/expand, mode switches) now trigger `grid.recalculate(true)` automatically
- segmented modes validate the effective `layouts` and report violations in the console
- use 8px surface insets and row gaps for compact grid search forms without trailing field/action padding; standalone forms retain their existing default spacing and noncompact forms retain validation space
- remove the pager's redundant fixed-height whitespace and preserve table edge insets when the toolbar or pager is absent
- account for row gaps and runtime layout options when calculating collapsed form rows
- in card mode the grid root padding is removed so both cards share the same outer footprint as the other layouts (in-card spacing is self-contained)

fix(composables): `usePriorityValue` now tracks props that are initially absent; previously the computed skipped reading `props[key]` when the raw prop was `undefined` at setup, so later prop updates were ignored.
