interface Runtime {
  vm?: Vue;
}

const runtime: Runtime = {};

/**
 * @description: 获取vue实例
 */
export function getRuntimeVM(): Vue {
  if (runtime.vm) {
    return runtime.vm;
  }
  throw new ReferenceError('Not found vue instance.');
}

/**
 * @description: 设置vue实例
 */
export function setRuntimeVM(this: Vue, vue?: Vue) {
  const vm = this || vue;
  if (typeof vm.$options.setup === 'function') {
    runtime.vm = vm;
  }
}
