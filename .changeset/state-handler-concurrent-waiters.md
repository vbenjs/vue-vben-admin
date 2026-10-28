---
'@vben-core/shared': patch
---

fix(@vben-core/shared): keep every pending `StateHandler` waiter so concurrent `waitForCondition()` calls are all settled when the condition flips, instead of only the last one
