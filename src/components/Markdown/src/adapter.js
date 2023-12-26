// https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getUserMedia
// 推荐使用处理了约束的 adapter.js polyfill 来替代。

// 浏览器过老或过新都可能不存在
if (!navigator.mediaDevices) {
  navigator.mediaDevices = {};

  // 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia
  // 因为这样可能会覆盖已有的属性。这里我们只会在没有 getUserMedia 属性的时候添加它。
  if (!navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia = function (constraints) {
      // 首先，如果有 getUserMedia 的话，就获得它
      const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      // 一些浏览器根本没实现它 - 那么就返回一个 error 到 promise 的 reject 来保持一个统一的接口
      if (!getUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
      }
      // 否则，为老的 navigator.getUserMedia 方法包裹一个 Promise
      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }
}
