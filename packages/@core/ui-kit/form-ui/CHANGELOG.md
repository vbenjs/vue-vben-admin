# @vben-core/form-ui

## 5.8.0

### Patch Changes

- fix(@vben-core/form-ui): 修复动态表单定义下重置时恢复到挂载时固化的旧默认值的问题。表单定义动态变化后（如抽屉中先编辑再新增），部分依赖定义默认值的字段初始值会丢失；现在 `reset()` 未显式指定重置值时，会按当前表单定义动态计算默认值，并同步校正底层默认值快照
- refactor(@vben-core/form-ui): 将表单定义默认值的计算逻辑抽取为公共函数，挂载初始化与重置共用

- [#7978](https://github.com/vbenjs/vue-vben-admin/pull/7978) [`9ffd42f`](https://github.com/vbenjs/vue-vben-admin/commit/9ffd42f013825f94278165027bc210a5314d3998) Thanks [@SaleriHQ](https://github.com/SaleriHQ)! - feat(@core/form-ui): 新增 useVbenForm 数组编辑器 VbenFormFieldArray

- Updated dependencies [[`142b544`](https://github.com/vbenjs/vue-vben-admin/commit/142b5442c2270090720a92671a0573cfe6974fa3)]:
  - @vben-core/shadcn-ui@5.8.0
  - @vben-core/icons@5.8.0
  - @vben-core/shared@5.8.0
  - @vben-core/typings@5.8.0
  - @vben-core/composables@5.8.0
