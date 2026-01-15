---
"@vben-core/popup-ui": patch
---

fix: improve connection handling for external modals

Fix a bug where the `__vbenModalConnected` flag was set before verifying that the parent's `extendApi` call succeeds. If `Object.setPrototypeOf` throws an error, the flag remains `true` despite the connection being incomplete, preventing subsequent child modals from retrying the connection.

