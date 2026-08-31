---
'@vben-core/layout-ui': patch
---

fix(@vben-core/layout-ui): guard sidebar hover handlers in mobile drawer mode

移动端抽屉模式不存在 hover 语义。resize 跨断点时浏览器会对正在卸载/重排的侧栏派发合成 mouseenter/mouseleave，`handleMouseleave` 缺少 `isMobile` 守卫会把折叠态写入 `collapse` 并经 v-model 链持久化，导致窗口放大后侧栏保持折叠（#8274）。本次为 `handleMouseenter`/`handleMouseleave` 增加 `isMobile` 守卫，并附 4 项回归测试（移动端 mouseenter/mouseleave 不写状态、桌面端行为不变）。
