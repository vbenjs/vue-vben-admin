---
'@vben/common-ui': patch
---

fix: keep the IconPicker on a single v-model contract and map it in form adapters

The IconPicker now exchanges its value exclusively through v-model. `modelValueProp` only describes the protocol of the configured inner input ('value' for antd/naive, 'model-value' for element-plus). Adapters bridge the outer form binding via `modelPropNameMap` (IconPicker: 'modelValue'), following the existing RichEditor pattern. This fixes the web-ele adapter losing the initial, typed and selected value, and removes the attrs-scraping fallback: binding the picker through a `value` attribute no longer works — use v-model or map it in the form config.
