import {
  Fragment,
  TransitionGroup,
  computed,
  customRef,
  defineComponent,
  effectScope,
  getCurrentInstance,
  getCurrentScope,
  h,
  inject,
  isReactive,
  isReadonly,
  isRef,
  markRaw,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  onScopeDispose,
  onUnmounted,
  onUpdated,
  provide,
  reactive,
  readonly,
  ref,
  shallowReactive,
  shallowRef,
  toRef,
  toRefs,
  unref,
  version,
  watch,
  watchEffect,
} from './chunk-Z6W6QRLO.js';

// ../node_modules/.pnpm/vitepress@1.2.2_@algolia+client-search@4.23.3_@types+node@20.12.12_async-validator@4.2.5_axio_5jctzjtewfbzj62xdve5deaagi/node_modules/vitepress/lib/vue-demi.mjs
var isVue2 = false;
var isVue3 = true;
function set(target, key, val) {
  if (Array.isArray(target)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }
  target[key] = val;
  return val;
}
function del(target, key) {
  if (Array.isArray(target)) {
    target.splice(key, 1);
    return;
  }
  delete target[key];
}

// ../node_modules/.pnpm/@vueuse+shared@10.9.0_vue@3.4.27_typescript@5.4.5_/node_modules/@vueuse/shared/index.mjs
function computedEager(fn, options) {
  var _a;
  const result = shallowRef();
  watchEffect(
    () => {
      result.value = fn();
    },
    {
      ...options,
      flush:
        (_a = options == null ? void 0 : options.flush) != null ? _a : 'sync',
    },
  );
  return readonly(result);
}
function computedWithControl(source, fn) {
  let v = void 0;
  let track;
  let trigger;
  const dirty = ref(true);
  const update = () => {
    dirty.value = true;
    trigger();
  };
  watch(source, update, { flush: 'sync' });
  const get2 = typeof fn === 'function' ? fn : fn.get;
  const set3 = typeof fn === 'function' ? void 0 : fn.set;
  const result = customRef((_track, _trigger) => {
    track = _track;
    trigger = _trigger;
    return {
      get() {
        if (dirty.value) {
          v = get2();
          dirty.value = false;
        }
        track();
        return v;
      },
      set(v2) {
        set3 == null ? void 0 : set3(v2);
      },
    };
  });
  if (Object.isExtensible(result)) result.trigger = update;
  return result;
}
function tryOnScopeDispose(fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn);
    return true;
  }
  return false;
}
function createEventHook() {
  const fns = /* @__PURE__ */ new Set();
  const off = (fn) => {
    fns.delete(fn);
  };
  const on = (fn) => {
    fns.add(fn);
    const offFn = () => off(fn);
    tryOnScopeDispose(offFn);
    return {
      off: offFn,
    };
  };
  const trigger = (...args) => {
    return Promise.all(Array.from(fns).map((fn) => fn(...args)));
  };
  return {
    on,
    off,
    trigger,
  };
}
function createGlobalState(stateFactory) {
  let initialized = false;
  let state;
  const scope = effectScope(true);
  return (...args) => {
    if (!initialized) {
      state = scope.run(() => stateFactory(...args));
      initialized = true;
    }
    return state;
  };
}
var localProvidedStateMap = /* @__PURE__ */ new WeakMap();
var provideLocal = (key, value) => {
  var _a;
  const instance = (_a = getCurrentInstance()) == null ? void 0 : _a.proxy;
  if (instance == null) throw new Error('provideLocal must be called in setup');
  if (!localProvidedStateMap.has(instance))
    localProvidedStateMap.set(instance, /* @__PURE__ */ Object.create(null));
  const localProvidedState = localProvidedStateMap.get(instance);
  localProvidedState[key] = value;
  provide(key, value);
};
var injectLocal = (...args) => {
  var _a;
  const key = args[0];
  const instance = (_a = getCurrentInstance()) == null ? void 0 : _a.proxy;
  if (instance == null) throw new Error('injectLocal must be called in setup');
  if (
    localProvidedStateMap.has(instance) &&
    key in localProvidedStateMap.get(instance)
  )
    return localProvidedStateMap.get(instance)[key];
  return inject(...args);
};
function createInjectionState(composable, options) {
  const key =
    (options == null ? void 0 : options.injectionKey) ||
    Symbol(composable.name || 'InjectionState');
  const useProvidingState = (...args) => {
    const state = composable(...args);
    provideLocal(key, state);
    return state;
  };
  const useInjectedState = () => injectLocal(key);
  return [useProvidingState, useInjectedState];
}
function createSharedComposable(composable) {
  let subscribers = 0;
  let state;
  let scope;
  const dispose = () => {
    subscribers -= 1;
    if (scope && subscribers <= 0) {
      scope.stop();
      state = void 0;
      scope = void 0;
    }
  };
  return (...args) => {
    subscribers += 1;
    if (!state) {
      scope = effectScope(true);
      state = scope.run(() => composable(...args));
    }
    tryOnScopeDispose(dispose);
    return state;
  };
}
function extendRef(ref2, extend, { enumerable = false, unwrap = true } = {}) {
  if (!isVue3 && !version.startsWith('2.7.')) {
    if (true)
      throw new Error('[VueUse] extendRef only works in Vue 2.7 or above.');
    return;
  }
  for (const [key, value] of Object.entries(extend)) {
    if (key === 'value') continue;
    if (isRef(value) && unwrap) {
      Object.defineProperty(ref2, key, {
        get() {
          return value.value;
        },
        set(v) {
          value.value = v;
        },
        enumerable,
      });
    } else {
      Object.defineProperty(ref2, key, { value, enumerable });
    }
  }
  return ref2;
}
function get(obj, key) {
  if (key == null) return unref(obj);
  return unref(obj)[key];
}
function isDefined(v) {
  return unref(v) != null;
}
function makeDestructurable(obj, arr) {
  if (typeof Symbol !== 'undefined') {
    const clone = { ...obj };
    Object.defineProperty(clone, Symbol.iterator, {
      enumerable: false,
      value() {
        let index = 0;
        return {
          next: () => ({
            value: arr[index++],
            done: index > arr.length,
          }),
        };
      },
    });
    return clone;
  } else {
    return Object.assign([...arr], obj);
  }
}
function toValue(r) {
  return typeof r === 'function' ? r() : unref(r);
}
var resolveUnref = toValue;
function reactify(fn, options) {
  const unrefFn =
    (options == null ? void 0 : options.computedGetter) === false
      ? unref
      : toValue;
  return function (...args) {
    return computed(() =>
      fn.apply(
        this,
        args.map((i) => unrefFn(i)),
      ),
    );
  };
}
function reactifyObject(obj, optionsOrKeys = {}) {
  let keys2 = [];
  let options;
  if (Array.isArray(optionsOrKeys)) {
    keys2 = optionsOrKeys;
  } else {
    options = optionsOrKeys;
    const { includeOwnProperties = true } = optionsOrKeys;
    keys2.push(...Object.keys(obj));
    if (includeOwnProperties) keys2.push(...Object.getOwnPropertyNames(obj));
  }
  return Object.fromEntries(
    keys2.map((key) => {
      const value = obj[key];
      return [
        key,
        typeof value === 'function'
          ? reactify(value.bind(obj), options)
          : value,
      ];
    }),
  );
}
function toReactive(objectRef) {
  if (!isRef(objectRef)) return reactive(objectRef);
  const proxy = new Proxy(
    {},
    {
      get(_, p, receiver) {
        return unref(Reflect.get(objectRef.value, p, receiver));
      },
      set(_, p, value) {
        if (isRef(objectRef.value[p]) && !isRef(value))
          objectRef.value[p].value = value;
        else objectRef.value[p] = value;
        return true;
      },
      deleteProperty(_, p) {
        return Reflect.deleteProperty(objectRef.value, p);
      },
      has(_, p) {
        return Reflect.has(objectRef.value, p);
      },
      ownKeys() {
        return Object.keys(objectRef.value);
      },
      getOwnPropertyDescriptor() {
        return {
          enumerable: true,
          configurable: true,
        };
      },
    },
  );
  return reactive(proxy);
}
function reactiveComputed(fn) {
  return toReactive(computed(fn));
}
function reactiveOmit(obj, ...keys2) {
  const flatKeys = keys2.flat();
  const predicate = flatKeys[0];
  return reactiveComputed(() =>
    typeof predicate === 'function'
      ? Object.fromEntries(
          Object.entries(toRefs(obj)).filter(
            ([k, v]) => !predicate(toValue(v), k),
          ),
        )
      : Object.fromEntries(
          Object.entries(toRefs(obj)).filter((e) => !flatKeys.includes(e[0])),
        ),
  );
}
var isClient = typeof window !== 'undefined' && typeof document !== 'undefined';
var isWorker =
  typeof WorkerGlobalScope !== 'undefined' &&
  globalThis instanceof WorkerGlobalScope;
var isDef = (val) => typeof val !== 'undefined';
var notNullish = (val) => val != null;
var assert = (condition, ...infos) => {
  if (!condition) console.warn(...infos);
};
var toString = Object.prototype.toString;
var isObject = (val) => toString.call(val) === '[object Object]';
var now = () => Date.now();
var timestamp = () => +Date.now();
var clamp = (n, min, max) => Math.min(max, Math.max(min, n));
var noop = () => {};
var rand = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
var hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);
var isIOS = getIsIOS();
function getIsIOS() {
  var _a, _b;
  return (
    isClient &&
    ((_a = window == null ? void 0 : window.navigator) == null
      ? void 0
      : _a.userAgent) &&
    (/iP(ad|hone|od)/.test(window.navigator.userAgent) ||
      (((_b = window == null ? void 0 : window.navigator) == null
        ? void 0
        : _b.maxTouchPoints) > 2 &&
        /iPad|Macintosh/.test(
          window == null ? void 0 : window.navigator.userAgent,
        )))
  );
}
function createFilterWrapper(filter, fn) {
  function wrapper(...args) {
    return new Promise((resolve, reject) => {
      Promise.resolve(
        filter(() => fn.apply(this, args), { fn, thisArg: this, args }),
      )
        .then(resolve)
        .catch(reject);
    });
  }
  return wrapper;
}
var bypassFilter = (invoke2) => {
  return invoke2();
};
function debounceFilter(ms, options = {}) {
  let timer;
  let maxTimer;
  let lastRejector = noop;
  const _clearTimeout = (timer2) => {
    clearTimeout(timer2);
    lastRejector();
    lastRejector = noop;
  };
  const filter = (invoke2) => {
    const duration = toValue(ms);
    const maxDuration = toValue(options.maxWait);
    if (timer) _clearTimeout(timer);
    if (duration <= 0 || (maxDuration !== void 0 && maxDuration <= 0)) {
      if (maxTimer) {
        _clearTimeout(maxTimer);
        maxTimer = null;
      }
      return Promise.resolve(invoke2());
    }
    return new Promise((resolve, reject) => {
      lastRejector = options.rejectOnCancel ? reject : resolve;
      if (maxDuration && !maxTimer) {
        maxTimer = setTimeout(() => {
          if (timer) _clearTimeout(timer);
          maxTimer = null;
          resolve(invoke2());
        }, maxDuration);
      }
      timer = setTimeout(() => {
        if (maxTimer) _clearTimeout(maxTimer);
        maxTimer = null;
        resolve(invoke2());
      }, duration);
    });
  };
  return filter;
}
function throttleFilter(...args) {
  let lastExec = 0;
  let timer;
  let isLeading = true;
  let lastRejector = noop;
  let lastValue;
  let ms;
  let trailing;
  let leading;
  let rejectOnCancel;
  if (!isRef(args[0]) && typeof args[0] === 'object')
    ({
      delay: ms,
      trailing = true,
      leading = true,
      rejectOnCancel = false,
    } = args[0]);
  else [ms, trailing = true, leading = true, rejectOnCancel = false] = args;
  const clear = () => {
    if (timer) {
      clearTimeout(timer);
      timer = void 0;
      lastRejector();
      lastRejector = noop;
    }
  };
  const filter = (_invoke) => {
    const duration = toValue(ms);
    const elapsed = Date.now() - lastExec;
    const invoke2 = () => {
      return (lastValue = _invoke());
    };
    clear();
    if (duration <= 0) {
      lastExec = Date.now();
      return invoke2();
    }
    if (elapsed > duration && (leading || !isLeading)) {
      lastExec = Date.now();
      invoke2();
    } else if (trailing) {
      lastValue = new Promise((resolve, reject) => {
        lastRejector = rejectOnCancel ? reject : resolve;
        timer = setTimeout(
          () => {
            lastExec = Date.now();
            isLeading = true;
            resolve(invoke2());
            clear();
          },
          Math.max(0, duration - elapsed),
        );
      });
    }
    if (!leading && !timer)
      timer = setTimeout(() => (isLeading = true), duration);
    isLeading = false;
    return lastValue;
  };
  return filter;
}
function pausableFilter(extendFilter = bypassFilter) {
  const isActive = ref(true);
  function pause() {
    isActive.value = false;
  }
  function resume() {
    isActive.value = true;
  }
  const eventFilter = (...args) => {
    if (isActive.value) extendFilter(...args);
  };
  return { isActive: readonly(isActive), pause, resume, eventFilter };
}
var directiveHooks = {
  mounted: isVue3 ? 'mounted' : 'inserted',
  updated: isVue3 ? 'updated' : 'componentUpdated',
  unmounted: isVue3 ? 'unmounted' : 'unbind',
};
function cacheStringFunction(fn) {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cacheStringFunction((str) =>
  str.replace(hyphenateRE, '-$1').toLowerCase(),
);
var camelizeRE = /-(\w)/g;
var camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
});
function promiseTimeout(ms, throwOnTimeout = false, reason = 'Timeout') {
  return new Promise((resolve, reject) => {
    if (throwOnTimeout) setTimeout(() => reject(reason), ms);
    else setTimeout(resolve, ms);
  });
}
function identity(arg) {
  return arg;
}
function createSingletonPromise(fn) {
  let _promise;
  function wrapper() {
    if (!_promise) _promise = fn();
    return _promise;
  }
  wrapper.reset = async () => {
    const _prev = _promise;
    _promise = void 0;
    if (_prev) await _prev;
  };
  return wrapper;
}
function invoke(fn) {
  return fn();
}
function containsProp(obj, ...props) {
  return props.some((k) => k in obj);
}
function increaseWithUnit(target, delta) {
  var _a;
  if (typeof target === 'number') return target + delta;
  const value =
    ((_a = target.match(/^-?[0-9]+\.?[0-9]*/)) == null ? void 0 : _a[0]) || '';
  const unit = target.slice(value.length);
  const result = Number.parseFloat(value) + delta;
  if (Number.isNaN(result)) return target;
  return result + unit;
}
function objectPick(obj, keys2, omitUndefined = false) {
  return keys2.reduce((n, k) => {
    if (k in obj) {
      if (!omitUndefined || obj[k] !== void 0) n[k] = obj[k];
    }
    return n;
  }, {});
}
function objectOmit(obj, keys2, omitUndefined = false) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => {
      return (!omitUndefined || value !== void 0) && !keys2.includes(key);
    }),
  );
}
function objectEntries(obj) {
  return Object.entries(obj);
}
function getLifeCycleTarget(target) {
  return target || getCurrentInstance();
}
function toRef2(...args) {
  if (args.length !== 1) return toRef(...args);
  const r = args[0];
  return typeof r === 'function'
    ? readonly(customRef(() => ({ get: r, set: noop })))
    : ref(r);
}
var resolveRef = toRef2;
function reactivePick(obj, ...keys2) {
  const flatKeys = keys2.flat();
  const predicate = flatKeys[0];
  return reactiveComputed(() =>
    typeof predicate === 'function'
      ? Object.fromEntries(
          Object.entries(toRefs(obj)).filter(([k, v]) =>
            predicate(toValue(v), k),
          ),
        )
      : Object.fromEntries(flatKeys.map((k) => [k, toRef2(obj, k)])),
  );
}
function refAutoReset(defaultValue, afterMs = 1e4) {
  return customRef((track, trigger) => {
    let value = toValue(defaultValue);
    let timer;
    const resetAfter = () =>
      setTimeout(() => {
        value = toValue(defaultValue);
        trigger();
      }, toValue(afterMs));
    tryOnScopeDispose(() => {
      clearTimeout(timer);
    });
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        value = newValue;
        trigger();
        clearTimeout(timer);
        timer = resetAfter();
      },
    };
  });
}
function useDebounceFn(fn, ms = 200, options = {}) {
  return createFilterWrapper(debounceFilter(ms, options), fn);
}
function refDebounced(value, ms = 200, options = {}) {
  const debounced = ref(value.value);
  const updater = useDebounceFn(
    () => {
      debounced.value = value.value;
    },
    ms,
    options,
  );
  watch(value, () => updater());
  return debounced;
}
function refDefault(source, defaultValue) {
  return computed({
    get() {
      var _a;
      return (_a = source.value) != null ? _a : defaultValue;
    },
    set(value) {
      source.value = value;
    },
  });
}
function useThrottleFn(
  fn,
  ms = 200,
  trailing = false,
  leading = true,
  rejectOnCancel = false,
) {
  return createFilterWrapper(
    throttleFilter(ms, trailing, leading, rejectOnCancel),
    fn,
  );
}
function refThrottled(value, delay = 200, trailing = true, leading = true) {
  if (delay <= 0) return value;
  const throttled = ref(value.value);
  const updater = useThrottleFn(
    () => {
      throttled.value = value.value;
    },
    delay,
    trailing,
    leading,
  );
  watch(value, () => updater());
  return throttled;
}
function refWithControl(initial, options = {}) {
  let source = initial;
  let track;
  let trigger;
  const ref2 = customRef((_track, _trigger) => {
    track = _track;
    trigger = _trigger;
    return {
      get() {
        return get2();
      },
      set(v) {
        set3(v);
      },
    };
  });
  function get2(tracking = true) {
    if (tracking) track();
    return source;
  }
  function set3(value, triggering = true) {
    var _a, _b;
    if (value === source) return;
    const old = source;
    if (
      ((_a = options.onBeforeChange) == null
        ? void 0
        : _a.call(options, value, old)) === false
    )
      return;
    source = value;
    (_b = options.onChanged) == null ? void 0 : _b.call(options, value, old);
    if (triggering) trigger();
  }
  const untrackedGet = () => get2(false);
  const silentSet = (v) => set3(v, false);
  const peek = () => get2(false);
  const lay = (v) => set3(v, false);
  return extendRef(
    ref2,
    {
      get: get2,
      set: set3,
      untrackedGet,
      silentSet,
      peek,
      lay,
    },
    { enumerable: true },
  );
}
var controlledRef = refWithControl;
function set2(...args) {
  if (args.length === 2) {
    const [ref2, value] = args;
    ref2.value = value;
  }
  if (args.length === 3) {
    if (isVue2) {
      set(...args);
    } else {
      const [target, key, value] = args;
      target[key] = value;
    }
  }
}
function watchWithFilter(source, cb, options = {}) {
  const { eventFilter = bypassFilter, ...watchOptions } = options;
  return watch(source, createFilterWrapper(eventFilter, cb), watchOptions);
}
function watchPausable(source, cb, options = {}) {
  const { eventFilter: filter, ...watchOptions } = options;
  const { eventFilter, pause, resume, isActive } = pausableFilter(filter);
  const stop = watchWithFilter(source, cb, {
    ...watchOptions,
    eventFilter,
  });
  return { stop, pause, resume, isActive };
}
function syncRef(left, right, ...[options]) {
  const {
    flush = 'sync',
    deep = false,
    immediate = true,
    direction = 'both',
    transform = {},
  } = options || {};
  const watchers = [];
  const transformLTR = ('ltr' in transform && transform.ltr) || ((v) => v);
  const transformRTL = ('rtl' in transform && transform.rtl) || ((v) => v);
  if (direction === 'both' || direction === 'ltr') {
    watchers.push(
      watchPausable(
        left,
        (newValue) => {
          watchers.forEach((w) => w.pause());
          right.value = transformLTR(newValue);
          watchers.forEach((w) => w.resume());
        },
        { flush, deep, immediate },
      ),
    );
  }
  if (direction === 'both' || direction === 'rtl') {
    watchers.push(
      watchPausable(
        right,
        (newValue) => {
          watchers.forEach((w) => w.pause());
          left.value = transformRTL(newValue);
          watchers.forEach((w) => w.resume());
        },
        { flush, deep, immediate },
      ),
    );
  }
  const stop = () => {
    watchers.forEach((w) => w.stop());
  };
  return stop;
}
function syncRefs(source, targets, options = {}) {
  const { flush = 'sync', deep = false, immediate = true } = options;
  if (!Array.isArray(targets)) targets = [targets];
  return watch(
    source,
    (newValue) => targets.forEach((target) => (target.value = newValue)),
    { flush, deep, immediate },
  );
}
function toRefs2(objectRef, options = {}) {
  if (!isRef(objectRef)) return toRefs(objectRef);
  const result = Array.isArray(objectRef.value)
    ? Array.from({ length: objectRef.value.length })
    : {};
  for (const key in objectRef.value) {
    result[key] = customRef(() => ({
      get() {
        return objectRef.value[key];
      },
      set(v) {
        var _a;
        const replaceRef =
          (_a = toValue(options.replaceRef)) != null ? _a : true;
        if (replaceRef) {
          if (Array.isArray(objectRef.value)) {
            const copy = [...objectRef.value];
            copy[key] = v;
            objectRef.value = copy;
          } else {
            const newObject = { ...objectRef.value, [key]: v };
            Object.setPrototypeOf(
              newObject,
              Object.getPrototypeOf(objectRef.value),
            );
            objectRef.value = newObject;
          }
        } else {
          objectRef.value[key] = v;
        }
      },
    }));
  }
  return result;
}
function tryOnBeforeMount(fn, sync = true, target) {
  const instance = getLifeCycleTarget(target);
  if (instance) onBeforeMount(fn, target);
  else if (sync) fn();
  else nextTick(fn);
}
function tryOnBeforeUnmount(fn, target) {
  const instance = getLifeCycleTarget(target);
  if (instance) onBeforeUnmount(fn, target);
}
function tryOnMounted(fn, sync = true, target) {
  const instance = getLifeCycleTarget();
  if (instance) onMounted(fn, target);
  else if (sync) fn();
  else nextTick(fn);
}
function tryOnUnmounted(fn, target) {
  const instance = getLifeCycleTarget(target);
  if (instance) onUnmounted(fn, target);
}
function createUntil(r, isNot = false) {
  function toMatch(
    condition,
    { flush = 'sync', deep = false, timeout, throwOnTimeout } = {},
  ) {
    let stop = null;
    const watcher = new Promise((resolve) => {
      stop = watch(
        r,
        (v) => {
          if (condition(v) !== isNot) {
            stop == null ? void 0 : stop();
            resolve(v);
          }
        },
        {
          flush,
          deep,
          immediate: true,
        },
      );
    });
    const promises = [watcher];
    if (timeout != null) {
      promises.push(
        promiseTimeout(timeout, throwOnTimeout)
          .then(() => toValue(r))
          .finally(() => (stop == null ? void 0 : stop())),
      );
    }
    return Promise.race(promises);
  }
  function toBe(value, options) {
    if (!isRef(value)) return toMatch((v) => v === value, options);
    const {
      flush = 'sync',
      deep = false,
      timeout,
      throwOnTimeout,
    } = options != null ? options : {};
    let stop = null;
    const watcher = new Promise((resolve) => {
      stop = watch(
        [r, value],
        ([v1, v2]) => {
          if (isNot !== (v1 === v2)) {
            stop == null ? void 0 : stop();
            resolve(v1);
          }
        },
        {
          flush,
          deep,
          immediate: true,
        },
      );
    });
    const promises = [watcher];
    if (timeout != null) {
      promises.push(
        promiseTimeout(timeout, throwOnTimeout)
          .then(() => toValue(r))
          .finally(() => {
            stop == null ? void 0 : stop();
            return toValue(r);
          }),
      );
    }
    return Promise.race(promises);
  }
  function toBeTruthy(options) {
    return toMatch((v) => Boolean(v), options);
  }
  function toBeNull(options) {
    return toBe(null, options);
  }
  function toBeUndefined(options) {
    return toBe(void 0, options);
  }
  function toBeNaN(options) {
    return toMatch(Number.isNaN, options);
  }
  function toContains(value, options) {
    return toMatch((v) => {
      const array = Array.from(v);
      return array.includes(value) || array.includes(toValue(value));
    }, options);
  }
  function changed(options) {
    return changedTimes(1, options);
  }
  function changedTimes(n = 1, options) {
    let count = -1;
    return toMatch(() => {
      count += 1;
      return count >= n;
    }, options);
  }
  if (Array.isArray(toValue(r))) {
    const instance = {
      toMatch,
      toContains,
      changed,
      changedTimes,
      get not() {
        return createUntil(r, !isNot);
      },
    };
    return instance;
  } else {
    const instance = {
      toMatch,
      toBe,
      toBeTruthy,
      toBeNull,
      toBeNaN,
      toBeUndefined,
      changed,
      changedTimes,
      get not() {
        return createUntil(r, !isNot);
      },
    };
    return instance;
  }
}
function until(r) {
  return createUntil(r);
}
function defaultComparator(value, othVal) {
  return value === othVal;
}
function useArrayDifference(...args) {
  var _a;
  const list = args[0];
  const values = args[1];
  let compareFn = (_a = args[2]) != null ? _a : defaultComparator;
  if (typeof compareFn === 'string') {
    const key = compareFn;
    compareFn = (value, othVal) => value[key] === othVal[key];
  }
  return computed(() =>
    toValue(list).filter(
      (x) => toValue(values).findIndex((y) => compareFn(x, y)) === -1,
    ),
  );
}
function useArrayEvery(list, fn) {
  return computed(() =>
    toValue(list).every((element, index, array) =>
      fn(toValue(element), index, array),
    ),
  );
}
function useArrayFilter(list, fn) {
  return computed(() =>
    toValue(list)
      .map((i) => toValue(i))
      .filter(fn),
  );
}
function useArrayFind(list, fn) {
  return computed(() =>
    toValue(
      toValue(list).find((element, index, array) =>
        fn(toValue(element), index, array),
      ),
    ),
  );
}
function useArrayFindIndex(list, fn) {
  return computed(() =>
    toValue(list).findIndex((element, index, array) =>
      fn(toValue(element), index, array),
    ),
  );
}
function findLast(arr, cb) {
  let index = arr.length;
  while (index-- > 0) {
    if (cb(arr[index], index, arr)) return arr[index];
  }
  return void 0;
}
function useArrayFindLast(list, fn) {
  return computed(() =>
    toValue(
      !Array.prototype.findLast
        ? findLast(toValue(list), (element, index, array) =>
            fn(toValue(element), index, array),
          )
        : toValue(list).findLast((element, index, array) =>
            fn(toValue(element), index, array),
          ),
    ),
  );
}
function isArrayIncludesOptions(obj) {
  return isObject(obj) && containsProp(obj, 'formIndex', 'comparator');
}
function useArrayIncludes(...args) {
  var _a;
  const list = args[0];
  const value = args[1];
  let comparator = args[2];
  let formIndex = 0;
  if (isArrayIncludesOptions(comparator)) {
    formIndex = (_a = comparator.fromIndex) != null ? _a : 0;
    comparator = comparator.comparator;
  }
  if (typeof comparator === 'string') {
    const key = comparator;
    comparator = (element, value2) => element[key] === toValue(value2);
  }
  comparator =
    comparator != null
      ? comparator
      : (element, value2) => element === toValue(value2);
  return computed(() =>
    toValue(list)
      .slice(formIndex)
      .some((element, index, array) =>
        comparator(toValue(element), toValue(value), index, toValue(array)),
      ),
  );
}
function useArrayJoin(list, separator) {
  return computed(() =>
    toValue(list)
      .map((i) => toValue(i))
      .join(toValue(separator)),
  );
}
function useArrayMap(list, fn) {
  return computed(() =>
    toValue(list)
      .map((i) => toValue(i))
      .map(fn),
  );
}
function useArrayReduce(list, reducer, ...args) {
  const reduceCallback = (sum, value, index) =>
    reducer(toValue(sum), toValue(value), index);
  return computed(() => {
    const resolved = toValue(list);
    return args.length
      ? resolved.reduce(reduceCallback, toValue(args[0]))
      : resolved.reduce(reduceCallback);
  });
}
function useArraySome(list, fn) {
  return computed(() =>
    toValue(list).some((element, index, array) =>
      fn(toValue(element), index, array),
    ),
  );
}
function uniq(array) {
  return Array.from(new Set(array));
}
function uniqueElementsBy(array, fn) {
  return array.reduce((acc, v) => {
    if (!acc.some((x) => fn(v, x, array))) acc.push(v);
    return acc;
  }, []);
}
function useArrayUnique(list, compareFn) {
  return computed(() => {
    const resolvedList = toValue(list).map((element) => toValue(element));
    return compareFn
      ? uniqueElementsBy(resolvedList, compareFn)
      : uniq(resolvedList);
  });
}
function useCounter(initialValue = 0, options = {}) {
  let _initialValue = unref(initialValue);
  const count = ref(initialValue);
  const { max = Number.POSITIVE_INFINITY, min = Number.NEGATIVE_INFINITY } =
    options;
  const inc = (delta = 1) =>
    (count.value = Math.max(Math.min(max, count.value + delta), min));
  const dec = (delta = 1) =>
    (count.value = Math.min(Math.max(min, count.value - delta), max));
  const get2 = () => count.value;
  const set3 = (val) => (count.value = Math.max(min, Math.min(max, val)));
  const reset = (val = _initialValue) => {
    _initialValue = val;
    return set3(val);
  };
  return { count, inc, dec, get: get2, set: set3, reset };
}
var REGEX_PARSE =
  /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/;
var REGEX_FORMAT =
  /[YMDHhms]o|\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a{1,2}|A{1,2}|m{1,2}|s{1,2}|Z{1,2}|SSS/g;
function defaultMeridiem(hours, minutes, isLowercase, hasPeriod) {
  let m = hours < 12 ? 'AM' : 'PM';
  if (hasPeriod) m = m.split('').reduce((acc, curr) => (acc += `${curr}.`), '');
  return isLowercase ? m.toLowerCase() : m;
}
function formatOrdinal(num) {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}
function formatDate(date, formatStr, options = {}) {
  var _a;
  const years = date.getFullYear();
  const month = date.getMonth();
  const days = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  const day = date.getDay();
  const meridiem = (_a = options.customMeridiem) != null ? _a : defaultMeridiem;
  const matches = {
    Yo: () => formatOrdinal(years),
    YY: () => String(years).slice(-2),
    YYYY: () => years,
    M: () => month + 1,
    Mo: () => formatOrdinal(month + 1),
    MM: () => `${month + 1}`.padStart(2, '0'),
    MMM: () => date.toLocaleDateString(options.locales, { month: 'short' }),
    MMMM: () => date.toLocaleDateString(options.locales, { month: 'long' }),
    D: () => String(days),
    Do: () => formatOrdinal(days),
    DD: () => `${days}`.padStart(2, '0'),
    H: () => String(hours),
    Ho: () => formatOrdinal(hours),
    HH: () => `${hours}`.padStart(2, '0'),
    h: () => `${hours % 12 || 12}`.padStart(1, '0'),
    ho: () => formatOrdinal(hours % 12 || 12),
    hh: () => `${hours % 12 || 12}`.padStart(2, '0'),
    m: () => String(minutes),
    mo: () => formatOrdinal(minutes),
    mm: () => `${minutes}`.padStart(2, '0'),
    s: () => String(seconds),
    so: () => formatOrdinal(seconds),
    ss: () => `${seconds}`.padStart(2, '0'),
    SSS: () => `${milliseconds}`.padStart(3, '0'),
    d: () => day,
    dd: () => date.toLocaleDateString(options.locales, { weekday: 'narrow' }),
    ddd: () => date.toLocaleDateString(options.locales, { weekday: 'short' }),
    dddd: () => date.toLocaleDateString(options.locales, { weekday: 'long' }),
    A: () => meridiem(hours, minutes),
    AA: () => meridiem(hours, minutes, false, true),
    a: () => meridiem(hours, minutes, true),
    aa: () => meridiem(hours, minutes, true, true),
  };
  return formatStr.replace(REGEX_FORMAT, (match, $1) => {
    var _a2, _b;
    return (_b =
      $1 != null
        ? $1
        : (_a2 = matches[match]) == null
          ? void 0
          : _a2.call(matches)) != null
      ? _b
      : match;
  });
}
function normalizeDate(date) {
  if (date === null) return new Date(Number.NaN);
  if (date === void 0) return /* @__PURE__ */ new Date();
  if (date instanceof Date) return new Date(date);
  if (typeof date === 'string' && !/Z$/i.test(date)) {
    const d = date.match(REGEX_PARSE);
    if (d) {
      const m = d[2] - 1 || 0;
      const ms = (d[7] || '0').substring(0, 3);
      return new Date(d[1], m, d[3] || 1, d[4] || 0, d[5] || 0, d[6] || 0, ms);
    }
  }
  return new Date(date);
}
function useDateFormat(date, formatStr = 'HH:mm:ss', options = {}) {
  return computed(() =>
    formatDate(normalizeDate(toValue(date)), toValue(formatStr), options),
  );
}
function useIntervalFn(cb, interval = 1e3, options = {}) {
  const { immediate = true, immediateCallback = false } = options;
  let timer = null;
  const isActive = ref(false);
  function clean() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }
  function pause() {
    isActive.value = false;
    clean();
  }
  function resume() {
    const intervalValue = toValue(interval);
    if (intervalValue <= 0) return;
    isActive.value = true;
    if (immediateCallback) cb();
    clean();
    timer = setInterval(cb, intervalValue);
  }
  if (immediate && isClient) resume();
  if (isRef(interval) || typeof interval === 'function') {
    const stopWatch = watch(interval, () => {
      if (isActive.value && isClient) resume();
    });
    tryOnScopeDispose(stopWatch);
  }
  tryOnScopeDispose(pause);
  return {
    isActive,
    pause,
    resume,
  };
}
function useInterval(interval = 1e3, options = {}) {
  const {
    controls: exposeControls = false,
    immediate = true,
    callback,
  } = options;
  const counter = ref(0);
  const update = () => (counter.value += 1);
  const reset = () => {
    counter.value = 0;
  };
  const controls = useIntervalFn(
    callback
      ? () => {
          update();
          callback(counter.value);
        }
      : update,
    interval,
    { immediate },
  );
  if (exposeControls) {
    return {
      counter,
      reset,
      ...controls,
    };
  } else {
    return counter;
  }
}
function useLastChanged(source, options = {}) {
  var _a;
  const ms = ref((_a = options.initialValue) != null ? _a : null);
  watch(source, () => (ms.value = timestamp()), options);
  return ms;
}
function useTimeoutFn(cb, interval, options = {}) {
  const { immediate = true } = options;
  const isPending = ref(false);
  let timer = null;
  function clear() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }
  function stop() {
    isPending.value = false;
    clear();
  }
  function start(...args) {
    clear();
    isPending.value = true;
    timer = setTimeout(() => {
      isPending.value = false;
      timer = null;
      cb(...args);
    }, toValue(interval));
  }
  if (immediate) {
    isPending.value = true;
    if (isClient) start();
  }
  tryOnScopeDispose(stop);
  return {
    isPending: readonly(isPending),
    start,
    stop,
  };
}
function useTimeout(interval = 1e3, options = {}) {
  const { controls: exposeControls = false, callback } = options;
  const controls = useTimeoutFn(
    callback != null ? callback : noop,
    interval,
    options,
  );
  const ready = computed(() => !controls.isPending.value);
  if (exposeControls) {
    return {
      ready,
      ...controls,
    };
  } else {
    return ready;
  }
}
function useToNumber(value, options = {}) {
  const { method = 'parseFloat', radix, nanToZero } = options;
  return computed(() => {
    let resolved = toValue(value);
    if (typeof resolved === 'string')
      resolved = Number[method](resolved, radix);
    if (nanToZero && Number.isNaN(resolved)) resolved = 0;
    return resolved;
  });
}
function useToString(value) {
  return computed(() => `${toValue(value)}`);
}
function useToggle(initialValue = false, options = {}) {
  const { truthyValue = true, falsyValue = false } = options;
  const valueIsRef = isRef(initialValue);
  const _value = ref(initialValue);
  function toggle(value) {
    if (arguments.length) {
      _value.value = value;
      return _value.value;
    } else {
      const truthy = toValue(truthyValue);
      _value.value = _value.value === truthy ? toValue(falsyValue) : truthy;
      return _value.value;
    }
  }
  if (valueIsRef) return toggle;
  else return [_value, toggle];
}
function watchArray(source, cb, options) {
  let oldList = (options == null ? void 0 : options.immediate)
    ? []
    : [
        ...(source instanceof Function
          ? source()
          : Array.isArray(source)
            ? source
            : toValue(source)),
      ];
  return watch(
    source,
    (newList, _, onCleanup) => {
      const oldListRemains = Array.from({ length: oldList.length });
      const added = [];
      for (const obj of newList) {
        let found = false;
        for (let i = 0; i < oldList.length; i++) {
          if (!oldListRemains[i] && obj === oldList[i]) {
            oldListRemains[i] = true;
            found = true;
            break;
          }
        }
        if (!found) added.push(obj);
      }
      const removed = oldList.filter((_2, i) => !oldListRemains[i]);
      cb(newList, oldList, added, removed, onCleanup);
      oldList = [...newList];
    },
    options,
  );
}
function watchAtMost(source, cb, options) {
  const { count, ...watchOptions } = options;
  const current = ref(0);
  const stop = watchWithFilter(
    source,
    (...args) => {
      current.value += 1;
      if (current.value >= toValue(count)) nextTick(() => stop());
      cb(...args);
    },
    watchOptions,
  );
  return { count: current, stop };
}
function watchDebounced(source, cb, options = {}) {
  const { debounce = 0, maxWait = void 0, ...watchOptions } = options;
  return watchWithFilter(source, cb, {
    ...watchOptions,
    eventFilter: debounceFilter(debounce, { maxWait }),
  });
}
function watchDeep(source, cb, options) {
  return watch(source, cb, {
    ...options,
    deep: true,
  });
}
function watchIgnorable(source, cb, options = {}) {
  const { eventFilter = bypassFilter, ...watchOptions } = options;
  const filteredCb = createFilterWrapper(eventFilter, cb);
  let ignoreUpdates;
  let ignorePrevAsyncUpdates;
  let stop;
  if (watchOptions.flush === 'sync') {
    const ignore = ref(false);
    ignorePrevAsyncUpdates = () => {};
    ignoreUpdates = (updater) => {
      ignore.value = true;
      updater();
      ignore.value = false;
    };
    stop = watch(
      source,
      (...args) => {
        if (!ignore.value) filteredCb(...args);
      },
      watchOptions,
    );
  } else {
    const disposables = [];
    const ignoreCounter = ref(0);
    const syncCounter = ref(0);
    ignorePrevAsyncUpdates = () => {
      ignoreCounter.value = syncCounter.value;
    };
    disposables.push(
      watch(
        source,
        () => {
          syncCounter.value++;
        },
        { ...watchOptions, flush: 'sync' },
      ),
    );
    ignoreUpdates = (updater) => {
      const syncCounterPrev = syncCounter.value;
      updater();
      ignoreCounter.value += syncCounter.value - syncCounterPrev;
    };
    disposables.push(
      watch(
        source,
        (...args) => {
          const ignore =
            ignoreCounter.value > 0 &&
            ignoreCounter.value === syncCounter.value;
          ignoreCounter.value = 0;
          syncCounter.value = 0;
          if (ignore) return;
          filteredCb(...args);
        },
        watchOptions,
      ),
    );
    stop = () => {
      disposables.forEach((fn) => fn());
    };
  }
  return { stop, ignoreUpdates, ignorePrevAsyncUpdates };
}
function watchImmediate(source, cb, options) {
  return watch(source, cb, {
    ...options,
    immediate: true,
  });
}
function watchOnce(source, cb, options) {
  const stop = watch(
    source,
    (...args) => {
      nextTick(() => stop());
      return cb(...args);
    },
    options,
  );
  return stop;
}
function watchThrottled(source, cb, options = {}) {
  const {
    throttle = 0,
    trailing = true,
    leading = true,
    ...watchOptions
  } = options;
  return watchWithFilter(source, cb, {
    ...watchOptions,
    eventFilter: throttleFilter(throttle, trailing, leading),
  });
}
function watchTriggerable(source, cb, options = {}) {
  let cleanupFn;
  function onEffect() {
    if (!cleanupFn) return;
    const fn = cleanupFn;
    cleanupFn = void 0;
    fn();
  }
  function onCleanup(callback) {
    cleanupFn = callback;
  }
  const _cb = (value, oldValue) => {
    onEffect();
    return cb(value, oldValue, onCleanup);
  };
  const res = watchIgnorable(source, _cb, options);
  const { ignoreUpdates } = res;
  const trigger = () => {
    let res2;
    ignoreUpdates(() => {
      res2 = _cb(getWatchSources(source), getOldValue(source));
    });
    return res2;
  };
  return {
    ...res,
    trigger,
  };
}
function getWatchSources(sources) {
  if (isReactive(sources)) return sources;
  if (Array.isArray(sources)) return sources.map((item) => toValue(item));
  return toValue(sources);
}
function getOldValue(source) {
  return Array.isArray(source) ? source.map(() => void 0) : void 0;
}
function whenever(source, cb, options) {
  const stop = watch(
    source,
    (v, ov, onInvalidate) => {
      if (v) {
        if (options == null ? void 0 : options.once) nextTick(() => stop());
        cb(v, ov, onInvalidate);
      }
    },
    {
      ...options,
      once: false,
    },
  );
  return stop;
}

// ../node_modules/.pnpm/@vueuse+core@10.9.0_vue@3.4.27_typescript@5.4.5_/node_modules/@vueuse/core/index.mjs
function computedAsync(evaluationCallback, initialState, optionsOrRef) {
  let options;
  if (isRef(optionsOrRef)) {
    options = {
      evaluating: optionsOrRef,
    };
  } else {
    options = optionsOrRef || {};
  }
  const {
    lazy = false,
    evaluating = void 0,
    shallow = true,
    onError = noop,
  } = options;
  const started = ref(!lazy);
  const current = shallow ? shallowRef(initialState) : ref(initialState);
  let counter = 0;
  watchEffect(async (onInvalidate) => {
    if (!started.value) return;
    counter++;
    const counterAtBeginning = counter;
    let hasFinished = false;
    if (evaluating) {
      Promise.resolve().then(() => {
        evaluating.value = true;
      });
    }
    try {
      const result = await evaluationCallback((cancelCallback) => {
        onInvalidate(() => {
          if (evaluating) evaluating.value = false;
          if (!hasFinished) cancelCallback();
        });
      });
      if (counterAtBeginning === counter) current.value = result;
    } catch (e) {
      onError(e);
    } finally {
      if (evaluating && counterAtBeginning === counter)
        evaluating.value = false;
      hasFinished = true;
    }
  });
  if (lazy) {
    return computed(() => {
      started.value = true;
      return current.value;
    });
  } else {
    return current;
  }
}
function computedInject(key, options, defaultSource, treatDefaultAsFactory) {
  let source = inject(key);
  if (defaultSource) source = inject(key, defaultSource);
  if (treatDefaultAsFactory)
    source = inject(key, defaultSource, treatDefaultAsFactory);
  if (typeof options === 'function') {
    return computed((ctx) => options(source, ctx));
  } else {
    return computed({
      get: (ctx) => options.get(source, ctx),
      set: options.set,
    });
  }
}
function createReusableTemplate(options = {}) {
  if (!isVue3 && !version.startsWith('2.7.')) {
    if (true)
      throw new Error(
        '[VueUse] createReusableTemplate only works in Vue 2.7 or above.',
      );
    return;
  }
  const { inheritAttrs = true } = options;
  const render = shallowRef();
  const define = defineComponent({
    setup(_, { slots }) {
      return () => {
        render.value = slots.default;
      };
    },
  });
  const reuse = defineComponent({
    inheritAttrs,
    setup(_, { attrs, slots }) {
      return () => {
        var _a;
        if (!render.value && true)
          throw new Error(
            '[VueUse] Failed to find the definition of reusable template',
          );
        const vnode =
          (_a = render.value) == null
            ? void 0
            : _a.call(render, {
                ...keysToCamelKebabCase(attrs),
                $slots: slots,
              });
        return inheritAttrs && (vnode == null ? void 0 : vnode.length) === 1
          ? vnode[0]
          : vnode;
      };
    },
  });
  return makeDestructurable({ define, reuse }, [define, reuse]);
}
function keysToCamelKebabCase(obj) {
  const newObj = {};
  for (const key in obj) newObj[camelize(key)] = obj[key];
  return newObj;
}
function createTemplatePromise(options = {}) {
  if (!isVue3) {
    if (true)
      throw new Error(
        '[VueUse] createTemplatePromise only works in Vue 3 or above.',
      );
    return;
  }
  let index = 0;
  const instances = ref([]);
  function create(...args) {
    const props = shallowReactive({
      key: index++,
      args,
      promise: void 0,
      resolve: () => {},
      reject: () => {},
      isResolving: false,
      options,
    });
    instances.value.push(props);
    props.promise = new Promise((_resolve, _reject) => {
      props.resolve = (v) => {
        props.isResolving = true;
        return _resolve(v);
      };
      props.reject = _reject;
    }).finally(() => {
      props.promise = void 0;
      const index2 = instances.value.indexOf(props);
      if (index2 !== -1) instances.value.splice(index2, 1);
    });
    return props.promise;
  }
  function start(...args) {
    if (options.singleton && instances.value.length > 0)
      return instances.value[0].promise;
    return create(...args);
  }
  const component = defineComponent((_, { slots }) => {
    const renderList = () =>
      instances.value.map((props) => {
        var _a;
        return h(
          Fragment,
          { key: props.key },
          (_a = slots.default) == null ? void 0 : _a.call(slots, props),
        );
      });
    if (options.transition)
      return () => h(TransitionGroup, options.transition, renderList);
    return renderList;
  });
  component.start = start;
  return component;
}
function createUnrefFn(fn) {
  return function (...args) {
    return fn.apply(
      this,
      args.map((i) => toValue(i)),
    );
  };
}
function unrefElement(elRef) {
  var _a;
  const plain = toValue(elRef);
  return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
}
var defaultWindow = isClient ? window : void 0;
var defaultDocument = isClient ? window.document : void 0;
var defaultNavigator = isClient ? window.navigator : void 0;
var defaultLocation = isClient ? window.location : void 0;
function useEventListener(...args) {
  let target;
  let events2;
  let listeners;
  let options;
  if (typeof args[0] === 'string' || Array.isArray(args[0])) {
    [events2, listeners, options] = args;
    target = defaultWindow;
  } else {
    [target, events2, listeners, options] = args;
  }
  if (!target) return noop;
  if (!Array.isArray(events2)) events2 = [events2];
  if (!Array.isArray(listeners)) listeners = [listeners];
  const cleanups = [];
  const cleanup = () => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  };
  const register = (el, event, listener, options2) => {
    el.addEventListener(event, listener, options2);
    return () => el.removeEventListener(event, listener, options2);
  };
  const stopWatch = watch(
    () => [unrefElement(target), toValue(options)],
    ([el, options2]) => {
      cleanup();
      if (!el) return;
      const optionsClone = isObject(options2) ? { ...options2 } : options2;
      cleanups.push(
        ...events2.flatMap((event) => {
          return listeners.map((listener) =>
            register(el, event, listener, optionsClone),
          );
        }),
      );
    },
    { immediate: true, flush: 'post' },
  );
  const stop = () => {
    stopWatch();
    cleanup();
  };
  tryOnScopeDispose(stop);
  return stop;
}
var _iOSWorkaround = false;
function onClickOutside(target, handler, options = {}) {
  const {
    window: window2 = defaultWindow,
    ignore = [],
    capture = true,
    detectIframe = false,
  } = options;
  if (!window2) return noop;
  if (isIOS && !_iOSWorkaround) {
    _iOSWorkaround = true;
    Array.from(window2.document.body.children).forEach((el) =>
      el.addEventListener('click', noop),
    );
    window2.document.documentElement.addEventListener('click', noop);
  }
  let shouldListen = true;
  const shouldIgnore = (event) => {
    return ignore.some((target2) => {
      if (typeof target2 === 'string') {
        return Array.from(window2.document.querySelectorAll(target2)).some(
          (el) => el === event.target || event.composedPath().includes(el),
        );
      } else {
        const el = unrefElement(target2);
        return el && (event.target === el || event.composedPath().includes(el));
      }
    });
  };
  const listener = (event) => {
    const el = unrefElement(target);
    if (!el || el === event.target || event.composedPath().includes(el)) return;
    if (event.detail === 0) shouldListen = !shouldIgnore(event);
    if (!shouldListen) {
      shouldListen = true;
      return;
    }
    handler(event);
  };
  const cleanup = [
    useEventListener(window2, 'click', listener, { passive: true, capture }),
    useEventListener(
      window2,
      'pointerdown',
      (e) => {
        const el = unrefElement(target);
        shouldListen =
          !shouldIgnore(e) && !!(el && !e.composedPath().includes(el));
      },
      { passive: true },
    ),
    detectIframe &&
      useEventListener(window2, 'blur', (event) => {
        setTimeout(() => {
          var _a;
          const el = unrefElement(target);
          if (
            ((_a = window2.document.activeElement) == null
              ? void 0
              : _a.tagName) === 'IFRAME' &&
            !(el == null ? void 0 : el.contains(window2.document.activeElement))
          )
            handler(event);
        }, 0);
      }),
  ].filter(Boolean);
  const stop = () => cleanup.forEach((fn) => fn());
  return stop;
}
function createKeyPredicate(keyFilter) {
  if (typeof keyFilter === 'function') return keyFilter;
  else if (typeof keyFilter === 'string')
    return (event) => event.key === keyFilter;
  else if (Array.isArray(keyFilter))
    return (event) => keyFilter.includes(event.key);
  return () => true;
}
function onKeyStroke(...args) {
  let key;
  let handler;
  let options = {};
  if (args.length === 3) {
    key = args[0];
    handler = args[1];
    options = args[2];
  } else if (args.length === 2) {
    if (typeof args[1] === 'object') {
      key = true;
      handler = args[0];
      options = args[1];
    } else {
      key = args[0];
      handler = args[1];
    }
  } else {
    key = true;
    handler = args[0];
  }
  const {
    target = defaultWindow,
    eventName = 'keydown',
    passive = false,
    dedupe = false,
  } = options;
  const predicate = createKeyPredicate(key);
  const listener = (e) => {
    if (e.repeat && toValue(dedupe)) return;
    if (predicate(e)) handler(e);
  };
  return useEventListener(target, eventName, listener, passive);
}
function onKeyDown(key, handler, options = {}) {
  return onKeyStroke(key, handler, { ...options, eventName: 'keydown' });
}
function onKeyPressed(key, handler, options = {}) {
  return onKeyStroke(key, handler, { ...options, eventName: 'keypress' });
}
function onKeyUp(key, handler, options = {}) {
  return onKeyStroke(key, handler, { ...options, eventName: 'keyup' });
}
var DEFAULT_DELAY = 500;
var DEFAULT_THRESHOLD = 10;
function onLongPress(target, handler, options) {
  var _a, _b;
  const elementRef = computed(() => unrefElement(target));
  let timeout;
  let posStart;
  function clear() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = void 0;
    }
    posStart = void 0;
  }
  function onDown(ev) {
    var _a2, _b2, _c, _d;
    if (
      ((_a2 = options == null ? void 0 : options.modifiers) == null
        ? void 0
        : _a2.self) &&
      ev.target !== elementRef.value
    )
      return;
    clear();
    if (
      (_b2 = options == null ? void 0 : options.modifiers) == null
        ? void 0
        : _b2.prevent
    )
      ev.preventDefault();
    if (
      (_c = options == null ? void 0 : options.modifiers) == null
        ? void 0
        : _c.stop
    )
      ev.stopPropagation();
    posStart = {
      x: ev.x,
      y: ev.y,
    };
    timeout = setTimeout(
      () => handler(ev),
      (_d = options == null ? void 0 : options.delay) != null
        ? _d
        : DEFAULT_DELAY,
    );
  }
  function onMove(ev) {
    var _a2, _b2, _c, _d;
    if (
      ((_a2 = options == null ? void 0 : options.modifiers) == null
        ? void 0
        : _a2.self) &&
      ev.target !== elementRef.value
    )
      return;
    if (
      !posStart ||
      (options == null ? void 0 : options.distanceThreshold) === false
    )
      return;
    if (
      (_b2 = options == null ? void 0 : options.modifiers) == null
        ? void 0
        : _b2.prevent
    )
      ev.preventDefault();
    if (
      (_c = options == null ? void 0 : options.modifiers) == null
        ? void 0
        : _c.stop
    )
      ev.stopPropagation();
    const dx = ev.x - posStart.x;
    const dy = ev.y - posStart.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (
      distance >=
      ((_d = options == null ? void 0 : options.distanceThreshold) != null
        ? _d
        : DEFAULT_THRESHOLD)
    )
      clear();
  }
  const listenerOptions = {
    capture:
      (_a = options == null ? void 0 : options.modifiers) == null
        ? void 0
        : _a.capture,
    once:
      (_b = options == null ? void 0 : options.modifiers) == null
        ? void 0
        : _b.once,
  };
  const cleanup = [
    useEventListener(elementRef, 'pointerdown', onDown, listenerOptions),
    useEventListener(elementRef, 'pointermove', onMove, listenerOptions),
    useEventListener(
      elementRef,
      ['pointerup', 'pointerleave'],
      clear,
      listenerOptions,
    ),
  ];
  const stop = () => cleanup.forEach((fn) => fn());
  return stop;
}
function isFocusedElementEditable() {
  const { activeElement, body } = document;
  if (!activeElement) return false;
  if (activeElement === body) return false;
  switch (activeElement.tagName) {
    case 'INPUT':
    case 'TEXTAREA':
      return true;
  }
  return activeElement.hasAttribute('contenteditable');
}
function isTypedCharValid({ keyCode, metaKey, ctrlKey, altKey }) {
  if (metaKey || ctrlKey || altKey) return false;
  if (keyCode >= 48 && keyCode <= 57) return true;
  if (keyCode >= 65 && keyCode <= 90) return true;
  if (keyCode >= 97 && keyCode <= 122) return true;
  return false;
}
function onStartTyping(callback, options = {}) {
  const { document: document2 = defaultDocument } = options;
  const keydown = (event) => {
    !isFocusedElementEditable() && isTypedCharValid(event) && callback(event);
  };
  if (document2)
    useEventListener(document2, 'keydown', keydown, { passive: true });
}
function templateRef(key, initialValue = null) {
  const instance = getCurrentInstance();
  let _trigger = () => {};
  const element = customRef((track, trigger) => {
    _trigger = trigger;
    return {
      get() {
        var _a, _b;
        track();
        return (_b =
          (_a = instance == null ? void 0 : instance.proxy) == null
            ? void 0
            : _a.$refs[key]) != null
          ? _b
          : initialValue;
      },
      set() {},
    };
  });
  tryOnMounted(_trigger);
  onUpdated(_trigger);
  return element;
}
function useActiveElement(options = {}) {
  var _a;
  const { window: window2 = defaultWindow, deep = true } = options;
  const document2 =
    (_a = options.document) != null
      ? _a
      : window2 == null
        ? void 0
        : window2.document;
  const getDeepActiveElement = () => {
    var _a2;
    let element = document2 == null ? void 0 : document2.activeElement;
    if (deep) {
      while (element == null ? void 0 : element.shadowRoot)
        element =
          (_a2 = element == null ? void 0 : element.shadowRoot) == null
            ? void 0
            : _a2.activeElement;
    }
    return element;
  };
  const activeElement = ref();
  const trigger = () => {
    activeElement.value = getDeepActiveElement();
  };
  if (window2) {
    useEventListener(
      window2,
      'blur',
      (event) => {
        if (event.relatedTarget !== null) return;
        trigger();
      },
      true,
    );
    useEventListener(window2, 'focus', trigger, true);
  }
  trigger();
  return activeElement;
}
function useMounted() {
  const isMounted = ref(false);
  const instance = getCurrentInstance();
  if (instance) {
    onMounted(
      () => {
        isMounted.value = true;
      },
      isVue2 ? null : instance,
    );
  }
  return isMounted;
}
function useSupported(callback) {
  const isMounted = useMounted();
  return computed(() => {
    isMounted.value;
    return Boolean(callback());
  });
}
function useRafFn(fn, options = {}) {
  const {
    immediate = true,
    fpsLimit = void 0,
    window: window2 = defaultWindow,
  } = options;
  const isActive = ref(false);
  const intervalLimit = fpsLimit ? 1e3 / fpsLimit : null;
  let previousFrameTimestamp = 0;
  let rafId = null;
  function loop(timestamp2) {
    if (!isActive.value || !window2) return;
    if (!previousFrameTimestamp) previousFrameTimestamp = timestamp2;
    const delta = timestamp2 - previousFrameTimestamp;
    if (intervalLimit && delta < intervalLimit) {
      rafId = window2.requestAnimationFrame(loop);
      return;
    }
    previousFrameTimestamp = timestamp2;
    fn({ delta, timestamp: timestamp2 });
    rafId = window2.requestAnimationFrame(loop);
  }
  function resume() {
    if (!isActive.value && window2) {
      isActive.value = true;
      previousFrameTimestamp = 0;
      rafId = window2.requestAnimationFrame(loop);
    }
  }
  function pause() {
    isActive.value = false;
    if (rafId != null && window2) {
      window2.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }
  if (immediate) resume();
  tryOnScopeDispose(pause);
  return {
    isActive: readonly(isActive),
    pause,
    resume,
  };
}
function useAnimate(target, keyframes, options) {
  let config;
  let animateOptions;
  if (isObject(options)) {
    config = options;
    animateOptions = objectOmit(options, [
      'window',
      'immediate',
      'commitStyles',
      'persist',
      'onReady',
      'onError',
    ]);
  } else {
    config = { duration: options };
    animateOptions = options;
  }
  const {
    window: window2 = defaultWindow,
    immediate = true,
    commitStyles,
    persist,
    playbackRate: _playbackRate = 1,
    onReady,
    onError = (e) => {
      console.error(e);
    },
  } = config;
  const isSupported = useSupported(
    () => window2 && HTMLElement && 'animate' in HTMLElement.prototype,
  );
  const animate = shallowRef(void 0);
  const store = shallowReactive({
    startTime: null,
    currentTime: null,
    timeline: null,
    playbackRate: _playbackRate,
    pending: false,
    playState: immediate ? 'idle' : 'paused',
    replaceState: 'active',
  });
  const pending = computed(() => store.pending);
  const playState = computed(() => store.playState);
  const replaceState = computed(() => store.replaceState);
  const startTime = computed({
    get() {
      return store.startTime;
    },
    set(value) {
      store.startTime = value;
      if (animate.value) animate.value.startTime = value;
    },
  });
  const currentTime = computed({
    get() {
      return store.currentTime;
    },
    set(value) {
      store.currentTime = value;
      if (animate.value) {
        animate.value.currentTime = value;
        syncResume();
      }
    },
  });
  const timeline = computed({
    get() {
      return store.timeline;
    },
    set(value) {
      store.timeline = value;
      if (animate.value) animate.value.timeline = value;
    },
  });
  const playbackRate = computed({
    get() {
      return store.playbackRate;
    },
    set(value) {
      store.playbackRate = value;
      if (animate.value) animate.value.playbackRate = value;
    },
  });
  const play = () => {
    if (animate.value) {
      try {
        animate.value.play();
        syncResume();
      } catch (e) {
        syncPause();
        onError(e);
      }
    } else {
      update();
    }
  };
  const pause = () => {
    var _a;
    try {
      (_a = animate.value) == null ? void 0 : _a.pause();
      syncPause();
    } catch (e) {
      onError(e);
    }
  };
  const reverse = () => {
    var _a;
    !animate.value && update();
    try {
      (_a = animate.value) == null ? void 0 : _a.reverse();
      syncResume();
    } catch (e) {
      syncPause();
      onError(e);
    }
  };
  const finish = () => {
    var _a;
    try {
      (_a = animate.value) == null ? void 0 : _a.finish();
      syncPause();
    } catch (e) {
      onError(e);
    }
  };
  const cancel = () => {
    var _a;
    try {
      (_a = animate.value) == null ? void 0 : _a.cancel();
      syncPause();
    } catch (e) {
      onError(e);
    }
  };
  watch(
    () => unrefElement(target),
    (el) => {
      el && update();
    },
  );
  watch(
    () => keyframes,
    (value) => {
      !animate.value && update();
      if (!unrefElement(target) && animate.value) {
        animate.value.effect = new KeyframeEffect(
          unrefElement(target),
          toValue(value),
          animateOptions,
        );
      }
    },
    { deep: true },
  );
  tryOnMounted(() => {
    nextTick(() => update(true));
  });
  tryOnScopeDispose(cancel);
  function update(init) {
    const el = unrefElement(target);
    if (!isSupported.value || !el) return;
    if (!animate.value)
      animate.value = el.animate(toValue(keyframes), animateOptions);
    if (commitStyles) animate.value.commitStyles();
    if (persist) animate.value.persist();
    if (_playbackRate !== 1) animate.value.playbackRate = _playbackRate;
    if (init && !immediate) animate.value.pause();
    else syncResume();
    onReady == null ? void 0 : onReady(animate.value);
  }
  useEventListener(animate, ['cancel', 'finish', 'remove'], syncPause);
  const { resume: resumeRef, pause: pauseRef } = useRafFn(
    () => {
      if (!animate.value) return;
      store.pending = animate.value.pending;
      store.playState = animate.value.playState;
      store.replaceState = animate.value.replaceState;
      store.startTime = animate.value.startTime;
      store.currentTime = animate.value.currentTime;
      store.timeline = animate.value.timeline;
      store.playbackRate = animate.value.playbackRate;
    },
    { immediate: false },
  );
  function syncResume() {
    if (isSupported.value) resumeRef();
  }
  function syncPause() {
    if (isSupported.value && window2) window2.requestAnimationFrame(pauseRef);
  }
  return {
    isSupported,
    animate,
    // actions
    play,
    pause,
    reverse,
    finish,
    cancel,
    // state
    pending,
    playState,
    replaceState,
    startTime,
    currentTime,
    timeline,
    playbackRate,
  };
}
function useAsyncQueue(tasks, options) {
  const {
    interrupt = true,
    onError = noop,
    onFinished = noop,
    signal,
  } = options || {};
  const promiseState = {
    aborted: 'aborted',
    fulfilled: 'fulfilled',
    pending: 'pending',
    rejected: 'rejected',
  };
  const initialResult = Array.from(
    Array.from({ length: tasks.length }),
    () => ({ state: promiseState.pending, data: null }),
  );
  const result = reactive(initialResult);
  const activeIndex = ref(-1);
  if (!tasks || tasks.length === 0) {
    onFinished();
    return {
      activeIndex,
      result,
    };
  }
  function updateResult(state, res) {
    activeIndex.value++;
    result[activeIndex.value].data = res;
    result[activeIndex.value].state = state;
  }
  tasks.reduce((prev, curr) => {
    return prev
      .then((prevRes) => {
        var _a;
        if (signal == null ? void 0 : signal.aborted) {
          updateResult(promiseState.aborted, new Error('aborted'));
          return;
        }
        if (
          ((_a = result[activeIndex.value]) == null ? void 0 : _a.state) ===
            promiseState.rejected &&
          interrupt
        ) {
          onFinished();
          return;
        }
        const done = curr(prevRes).then((currentRes) => {
          updateResult(promiseState.fulfilled, currentRes);
          activeIndex.value === tasks.length - 1 && onFinished();
          return currentRes;
        });
        if (!signal) return done;
        return Promise.race([done, whenAborted(signal)]);
      })
      .catch((e) => {
        if (signal == null ? void 0 : signal.aborted) {
          updateResult(promiseState.aborted, e);
          return e;
        }
        updateResult(promiseState.rejected, e);
        onError();
        return e;
      });
  }, Promise.resolve());
  return {
    activeIndex,
    result,
  };
}
function whenAborted(signal) {
  return new Promise((resolve, reject) => {
    const error = new Error('aborted');
    if (signal.aborted) reject(error);
    else signal.addEventListener('abort', () => reject(error), { once: true });
  });
}
function useAsyncState(promise, initialState, options) {
  const {
    immediate = true,
    delay = 0,
    onError = noop,
    onSuccess = noop,
    resetOnExecute = true,
    shallow = true,
    throwError,
  } = options != null ? options : {};
  const state = shallow ? shallowRef(initialState) : ref(initialState);
  const isReady = ref(false);
  const isLoading = ref(false);
  const error = shallowRef(void 0);
  async function execute(delay2 = 0, ...args) {
    if (resetOnExecute) state.value = initialState;
    error.value = void 0;
    isReady.value = false;
    isLoading.value = true;
    if (delay2 > 0) await promiseTimeout(delay2);
    const _promise = typeof promise === 'function' ? promise(...args) : promise;
    try {
      const data = await _promise;
      state.value = data;
      isReady.value = true;
      onSuccess(data);
    } catch (e) {
      error.value = e;
      onError(e);
      if (throwError) throw e;
    } finally {
      isLoading.value = false;
    }
    return state.value;
  }
  if (immediate) execute(delay);
  const shell = {
    state,
    isReady,
    isLoading,
    error,
    execute,
  };
  function waitUntilIsLoaded() {
    return new Promise((resolve, reject) => {
      until(isLoading)
        .toBe(false)
        .then(() => resolve(shell))
        .catch(reject);
    });
  }
  return {
    ...shell,
    then(onFulfilled, onRejected) {
      return waitUntilIsLoaded().then(onFulfilled, onRejected);
    },
  };
}
var defaults = {
  array: (v) => JSON.stringify(v),
  object: (v) => JSON.stringify(v),
  set: (v) => JSON.stringify(Array.from(v)),
  map: (v) => JSON.stringify(Object.fromEntries(v)),
  null: () => '',
};
function getDefaultSerialization(target) {
  if (!target) return defaults.null;
  if (target instanceof Map) return defaults.map;
  else if (target instanceof Set) return defaults.set;
  else if (Array.isArray(target)) return defaults.array;
  else return defaults.object;
}
function useBase64(target, options) {
  const base64 = ref('');
  const promise = ref();
  function execute() {
    if (!isClient) return;
    promise.value = new Promise((resolve, reject) => {
      try {
        const _target = toValue(target);
        if (_target == null) {
          resolve('');
        } else if (typeof _target === 'string') {
          resolve(blobToBase64(new Blob([_target], { type: 'text/plain' })));
        } else if (_target instanceof Blob) {
          resolve(blobToBase64(_target));
        } else if (_target instanceof ArrayBuffer) {
          resolve(window.btoa(String.fromCharCode(...new Uint8Array(_target))));
        } else if (_target instanceof HTMLCanvasElement) {
          resolve(
            _target.toDataURL(
              options == null ? void 0 : options.type,
              options == null ? void 0 : options.quality,
            ),
          );
        } else if (_target instanceof HTMLImageElement) {
          const img = _target.cloneNode(false);
          img.crossOrigin = 'Anonymous';
          imgLoaded(img)
            .then(() => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              resolve(
                canvas.toDataURL(
                  options == null ? void 0 : options.type,
                  options == null ? void 0 : options.quality,
                ),
              );
            })
            .catch(reject);
        } else if (typeof _target === 'object') {
          const _serializeFn =
            (options == null ? void 0 : options.serializer) ||
            getDefaultSerialization(_target);
          const serialized = _serializeFn(_target);
          return resolve(
            blobToBase64(new Blob([serialized], { type: 'application/json' })),
          );
        } else {
          reject(new Error('target is unsupported types'));
        }
      } catch (error) {
        reject(error);
      }
    });
    promise.value.then((res) => (base64.value = res));
    return promise.value;
  }
  if (isRef(target) || typeof target === 'function')
    watch(target, execute, { immediate: true });
  else execute();
  return {
    base64,
    promise,
    execute,
  };
}
function imgLoaded(img) {
  return new Promise((resolve, reject) => {
    if (!img.complete) {
      img.onload = () => {
        resolve();
      };
      img.onerror = reject;
    } else {
      resolve();
    }
  });
}
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = (e) => {
      resolve(e.target.result);
    };
    fr.onerror = reject;
    fr.readAsDataURL(blob);
  });
}
function useBattery(options = {}) {
  const { navigator = defaultNavigator } = options;
  const events2 = [
    'chargingchange',
    'chargingtimechange',
    'dischargingtimechange',
    'levelchange',
  ];
  const isSupported = useSupported(
    () =>
      navigator &&
      'getBattery' in navigator &&
      typeof navigator.getBattery === 'function',
  );
  const charging = ref(false);
  const chargingTime = ref(0);
  const dischargingTime = ref(0);
  const level = ref(1);
  let battery;
  function updateBatteryInfo() {
    charging.value = this.charging;
    chargingTime.value = this.chargingTime || 0;
    dischargingTime.value = this.dischargingTime || 0;
    level.value = this.level;
  }
  if (isSupported.value) {
    navigator.getBattery().then((_battery) => {
      battery = _battery;
      updateBatteryInfo.call(battery);
      useEventListener(battery, events2, updateBatteryInfo, { passive: true });
    });
  }
  return {
    isSupported,
    charging,
    chargingTime,
    dischargingTime,
    level,
  };
}
function useBluetooth(options) {
  let { acceptAllDevices = false } = options || {};
  const {
    filters = void 0,
    optionalServices = void 0,
    navigator = defaultNavigator,
  } = options || {};
  const isSupported = useSupported(() => navigator && 'bluetooth' in navigator);
  const device = shallowRef(void 0);
  const error = shallowRef(null);
  watch(device, () => {
    connectToBluetoothGATTServer();
  });
  async function requestDevice() {
    if (!isSupported.value) return;
    error.value = null;
    if (filters && filters.length > 0) acceptAllDevices = false;
    try {
      device.value = await (navigator == null
        ? void 0
        : navigator.bluetooth.requestDevice({
            acceptAllDevices,
            filters,
            optionalServices,
          }));
    } catch (err) {
      error.value = err;
    }
  }
  const server = ref();
  const isConnected = computed(() => {
    var _a;
    return ((_a = server.value) == null ? void 0 : _a.connected) || false;
  });
  async function connectToBluetoothGATTServer() {
    error.value = null;
    if (device.value && device.value.gatt) {
      device.value.addEventListener('gattserverdisconnected', () => {});
      try {
        server.value = await device.value.gatt.connect();
      } catch (err) {
        error.value = err;
      }
    }
  }
  tryOnMounted(() => {
    var _a;
    if (device.value) (_a = device.value.gatt) == null ? void 0 : _a.connect();
  });
  tryOnScopeDispose(() => {
    var _a;
    if (device.value)
      (_a = device.value.gatt) == null ? void 0 : _a.disconnect();
  });
  return {
    isSupported,
    isConnected,
    // Device:
    device,
    requestDevice,
    // Server:
    server,
    // Errors:
    error,
  };
}
function useMediaQuery(query, options = {}) {
  const { window: window2 = defaultWindow } = options;
  const isSupported = useSupported(
    () =>
      window2 &&
      'matchMedia' in window2 &&
      typeof window2.matchMedia === 'function',
  );
  let mediaQuery;
  const matches = ref(false);
  const handler = (event) => {
    matches.value = event.matches;
  };
  const cleanup = () => {
    if (!mediaQuery) return;
    if ('removeEventListener' in mediaQuery)
      mediaQuery.removeEventListener('change', handler);
    else mediaQuery.removeListener(handler);
  };
  const stopWatch = watchEffect(() => {
    if (!isSupported.value) return;
    cleanup();
    mediaQuery = window2.matchMedia(toValue(query));
    if ('addEventListener' in mediaQuery)
      mediaQuery.addEventListener('change', handler);
    else mediaQuery.addListener(handler);
    matches.value = mediaQuery.matches;
  });
  tryOnScopeDispose(() => {
    stopWatch();
    cleanup();
    mediaQuery = void 0;
  });
  return matches;
}
var breakpointsTailwind = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};
var breakpointsBootstrapV5 = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};
var breakpointsVuetifyV2 = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1264,
  xl: 1904,
};
var breakpointsVuetifyV3 = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
  xxl: 2560,
};
var breakpointsVuetify = breakpointsVuetifyV2;
var breakpointsAntDesign = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
};
var breakpointsQuasar = {
  xs: 0,
  sm: 600,
  md: 1024,
  lg: 1440,
  xl: 1920,
};
var breakpointsSematic = {
  mobileS: 320,
  mobileM: 375,
  mobileL: 425,
  tablet: 768,
  laptop: 1024,
  laptopL: 1440,
  desktop4K: 2560,
};
var breakpointsMasterCss = {
  '3xs': 360,
  '2xs': 480,
  xs: 600,
  sm: 768,
  md: 1024,
  lg: 1280,
  xl: 1440,
  '2xl': 1600,
  '3xl': 1920,
  '4xl': 2560,
};
var breakpointsPrimeFlex = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};
function useBreakpoints(breakpoints, options = {}) {
  function getValue2(k, delta) {
    let v = toValue(breakpoints[toValue(k)]);
    if (delta != null) v = increaseWithUnit(v, delta);
    if (typeof v === 'number') v = `${v}px`;
    return v;
  }
  const { window: window2 = defaultWindow, strategy = 'min-width' } = options;
  function match(query) {
    if (!window2) return false;
    return window2.matchMedia(query).matches;
  }
  const greaterOrEqual = (k) => {
    return useMediaQuery(() => `(min-width: ${getValue2(k)})`, options);
  };
  const smallerOrEqual = (k) => {
    return useMediaQuery(() => `(max-width: ${getValue2(k)})`, options);
  };
  const shortcutMethods = Object.keys(breakpoints).reduce((shortcuts, k) => {
    Object.defineProperty(shortcuts, k, {
      get: () =>
        strategy === 'min-width' ? greaterOrEqual(k) : smallerOrEqual(k),
      enumerable: true,
      configurable: true,
    });
    return shortcuts;
  }, {});
  function current() {
    const points = Object.keys(breakpoints).map((i) => [i, greaterOrEqual(i)]);
    return computed(() => points.filter(([, v]) => v.value).map(([k]) => k));
  }
  return Object.assign(shortcutMethods, {
    greaterOrEqual,
    smallerOrEqual,
    greater(k) {
      return useMediaQuery(() => `(min-width: ${getValue2(k, 0.1)})`, options);
    },
    smaller(k) {
      return useMediaQuery(() => `(max-width: ${getValue2(k, -0.1)})`, options);
    },
    between(a, b) {
      return useMediaQuery(
        () =>
          `(min-width: ${getValue2(a)}) and (max-width: ${getValue2(b, -0.1)})`,
        options,
      );
    },
    isGreater(k) {
      return match(`(min-width: ${getValue2(k, 0.1)})`);
    },
    isGreaterOrEqual(k) {
      return match(`(min-width: ${getValue2(k)})`);
    },
    isSmaller(k) {
      return match(`(max-width: ${getValue2(k, -0.1)})`);
    },
    isSmallerOrEqual(k) {
      return match(`(max-width: ${getValue2(k)})`);
    },
    isInBetween(a, b) {
      return match(
        `(min-width: ${getValue2(a)}) and (max-width: ${getValue2(b, -0.1)})`,
      );
    },
    current,
    active() {
      const bps = current();
      return computed(() => (bps.value.length === 0 ? '' : bps.value.at(-1)));
    },
  });
}
function useBroadcastChannel(options) {
  const { name, window: window2 = defaultWindow } = options;
  const isSupported = useSupported(
    () => window2 && 'BroadcastChannel' in window2,
  );
  const isClosed = ref(false);
  const channel = ref();
  const data = ref();
  const error = shallowRef(null);
  const post = (data2) => {
    if (channel.value) channel.value.postMessage(data2);
  };
  const close = () => {
    if (channel.value) channel.value.close();
    isClosed.value = true;
  };
  if (isSupported.value) {
    tryOnMounted(() => {
      error.value = null;
      channel.value = new BroadcastChannel(name);
      channel.value.addEventListener(
        'message',
        (e) => {
          data.value = e.data;
        },
        { passive: true },
      );
      channel.value.addEventListener(
        'messageerror',
        (e) => {
          error.value = e;
        },
        { passive: true },
      );
      channel.value.addEventListener('close', () => {
        isClosed.value = true;
      });
    });
  }
  tryOnScopeDispose(() => {
    close();
  });
  return {
    isSupported,
    channel,
    data,
    post,
    close,
    error,
    isClosed,
  };
}
var WRITABLE_PROPERTIES = [
  'hash',
  'host',
  'hostname',
  'href',
  'pathname',
  'port',
  'protocol',
  'search',
];
function useBrowserLocation(options = {}) {
  const { window: window2 = defaultWindow } = options;
  const refs = Object.fromEntries(
    WRITABLE_PROPERTIES.map((key) => [key, ref()]),
  );
  for (const [key, ref2] of objectEntries(refs)) {
    watch(ref2, (value) => {
      if (
        !(window2 == null ? void 0 : window2.location) ||
        window2.location[key] === value
      )
        return;
      window2.location[key] = value;
    });
  }
  const buildState = (trigger) => {
    var _a;
    const { state: state2, length } =
      (window2 == null ? void 0 : window2.history) || {};
    const { origin } = (window2 == null ? void 0 : window2.location) || {};
    for (const key of WRITABLE_PROPERTIES)
      refs[key].value =
        (_a = window2 == null ? void 0 : window2.location) == null
          ? void 0
          : _a[key];
    return reactive({
      trigger,
      state: state2,
      length,
      origin,
      ...refs,
    });
  };
  const state = ref(buildState('load'));
  if (window2) {
    useEventListener(
      window2,
      'popstate',
      () => (state.value = buildState('popstate')),
      { passive: true },
    );
    useEventListener(
      window2,
      'hashchange',
      () => (state.value = buildState('hashchange')),
      { passive: true },
    );
  }
  return state;
}
function useCached(refValue, comparator = (a, b) => a === b, watchOptions) {
  const cachedValue = ref(refValue.value);
  watch(
    () => refValue.value,
    (value) => {
      if (!comparator(value, cachedValue.value)) cachedValue.value = value;
    },
    watchOptions,
  );
  return cachedValue;
}
function usePermission(permissionDesc, options = {}) {
  const { controls = false, navigator = defaultNavigator } = options;
  const isSupported = useSupported(
    () => navigator && 'permissions' in navigator,
  );
  let permissionStatus;
  const desc =
    typeof permissionDesc === 'string'
      ? { name: permissionDesc }
      : permissionDesc;
  const state = ref();
  const onChange = () => {
    if (permissionStatus) state.value = permissionStatus.state;
  };
  const query = createSingletonPromise(async () => {
    if (!isSupported.value) return;
    if (!permissionStatus) {
      try {
        permissionStatus = await navigator.permissions.query(desc);
        useEventListener(permissionStatus, 'change', onChange);
        onChange();
      } catch (e) {
        state.value = 'prompt';
      }
    }
    return permissionStatus;
  });
  query();
  if (controls) {
    return {
      state,
      isSupported,
      query,
    };
  } else {
    return state;
  }
}
function useClipboard(options = {}) {
  const {
    navigator = defaultNavigator,
    read = false,
    source,
    copiedDuring = 1500,
    legacy = false,
  } = options;
  const isClipboardApiSupported = useSupported(
    () => navigator && 'clipboard' in navigator,
  );
  const permissionRead = usePermission('clipboard-read');
  const permissionWrite = usePermission('clipboard-write');
  const isSupported = computed(() => isClipboardApiSupported.value || legacy);
  const text = ref('');
  const copied = ref(false);
  const timeout = useTimeoutFn(() => (copied.value = false), copiedDuring);
  function updateText() {
    if (isClipboardApiSupported.value && isAllowed(permissionRead.value)) {
      navigator.clipboard.readText().then((value) => {
        text.value = value;
      });
    } else {
      text.value = legacyRead();
    }
  }
  if (isSupported.value && read) useEventListener(['copy', 'cut'], updateText);
  async function copy(value = toValue(source)) {
    if (isSupported.value && value != null) {
      if (isClipboardApiSupported.value && isAllowed(permissionWrite.value))
        await navigator.clipboard.writeText(value);
      else legacyCopy(value);
      text.value = value;
      copied.value = true;
      timeout.start();
    }
  }
  function legacyCopy(value) {
    const ta = document.createElement('textarea');
    ta.value = value != null ? value : '';
    ta.style.position = 'absolute';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
  function legacyRead() {
    var _a, _b, _c;
    return (_c =
      (_b =
        (_a = document == null ? void 0 : document.getSelection) == null
          ? void 0
          : _a.call(document)) == null
        ? void 0
        : _b.toString()) != null
      ? _c
      : '';
  }
  function isAllowed(status) {
    return status === 'granted' || status === 'prompt';
  }
  return {
    isSupported,
    text,
    copied,
    copy,
  };
}
function useClipboardItems(options = {}) {
  const {
    navigator = defaultNavigator,
    read = false,
    source,
    copiedDuring = 1500,
  } = options;
  const isSupported = useSupported(() => navigator && 'clipboard' in navigator);
  const content = ref([]);
  const copied = ref(false);
  const timeout = useTimeoutFn(() => (copied.value = false), copiedDuring);
  function updateContent() {
    if (isSupported.value) {
      navigator.clipboard.read().then((items) => {
        content.value = items;
      });
    }
  }
  if (isSupported.value && read)
    useEventListener(['copy', 'cut'], updateContent);
  async function copy(value = toValue(source)) {
    if (isSupported.value && value != null) {
      await navigator.clipboard.write(value);
      content.value = value;
      copied.value = true;
      timeout.start();
    }
  }
  return {
    isSupported,
    content,
    copied,
    copy,
  };
}
function cloneFnJSON(source) {
  return JSON.parse(JSON.stringify(source));
}
function useCloned(source, options = {}) {
  const cloned = ref({});
  const {
    manual,
    clone = cloneFnJSON,
    // watch options
    deep = true,
    immediate = true,
  } = options;
  function sync() {
    cloned.value = clone(toValue(source));
  }
  if (!manual && (isRef(source) || typeof source === 'function')) {
    watch(source, sync, {
      ...options,
      deep,
      immediate,
    });
  } else {
    sync();
  }
  return { cloned, sync };
}
var _global =
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
        ? global
        : typeof self !== 'undefined'
          ? self
          : {};
var globalKey = '__vueuse_ssr_handlers__';
var handlers = getHandlers();
function getHandlers() {
  if (!(globalKey in _global)) _global[globalKey] = _global[globalKey] || {};
  return _global[globalKey];
}
function getSSRHandler(key, fallback) {
  return handlers[key] || fallback;
}
function setSSRHandler(key, fn) {
  handlers[key] = fn;
}
function guessSerializerType(rawInit) {
  return rawInit == null
    ? 'any'
    : rawInit instanceof Set
      ? 'set'
      : rawInit instanceof Map
        ? 'map'
        : rawInit instanceof Date
          ? 'date'
          : typeof rawInit === 'boolean'
            ? 'boolean'
            : typeof rawInit === 'string'
              ? 'string'
              : typeof rawInit === 'object'
                ? 'object'
                : !Number.isNaN(rawInit)
                  ? 'number'
                  : 'any';
}
var StorageSerializers = {
  boolean: {
    read: (v) => v === 'true',
    write: (v) => String(v),
  },
  object: {
    read: (v) => JSON.parse(v),
    write: (v) => JSON.stringify(v),
  },
  number: {
    read: (v) => Number.parseFloat(v),
    write: (v) => String(v),
  },
  any: {
    read: (v) => v,
    write: (v) => String(v),
  },
  string: {
    read: (v) => v,
    write: (v) => String(v),
  },
  map: {
    read: (v) => new Map(JSON.parse(v)),
    write: (v) => JSON.stringify(Array.from(v.entries())),
  },
  set: {
    read: (v) => new Set(JSON.parse(v)),
    write: (v) => JSON.stringify(Array.from(v)),
  },
  date: {
    read: (v) => new Date(v),
    write: (v) => v.toISOString(),
  },
};
var customStorageEventName = 'vueuse-storage';
function useStorage(key, defaults2, storage, options = {}) {
  var _a;
  const {
    flush = 'pre',
    deep = true,
    listenToStorageChanges = true,
    writeDefaults = true,
    mergeDefaults = false,
    shallow,
    window: window2 = defaultWindow,
    eventFilter,
    onError = (e) => {
      console.error(e);
    },
    initOnMounted,
  } = options;
  const data = (shallow ? shallowRef : ref)(
    typeof defaults2 === 'function' ? defaults2() : defaults2,
  );
  if (!storage) {
    try {
      storage = getSSRHandler('getDefaultStorage', () => {
        var _a2;
        return (_a2 = defaultWindow) == null ? void 0 : _a2.localStorage;
      })();
    } catch (e) {
      onError(e);
    }
  }
  if (!storage) return data;
  const rawInit = toValue(defaults2);
  const type = guessSerializerType(rawInit);
  const serializer =
    (_a = options.serializer) != null ? _a : StorageSerializers[type];
  const { pause: pauseWatch, resume: resumeWatch } = watchPausable(
    data,
    () => write(data.value),
    { flush, deep, eventFilter },
  );
  if (window2 && listenToStorageChanges) {
    tryOnMounted(() => {
      useEventListener(window2, 'storage', update);
      useEventListener(window2, customStorageEventName, updateFromCustomEvent);
      if (initOnMounted) update();
    });
  }
  if (!initOnMounted) update();
  function dispatchWriteEvent(oldValue, newValue) {
    if (window2) {
      window2.dispatchEvent(
        new CustomEvent(customStorageEventName, {
          detail: {
            key,
            oldValue,
            newValue,
            storageArea: storage,
          },
        }),
      );
    }
  }
  function write(v) {
    try {
      const oldValue = storage.getItem(key);
      if (v == null) {
        dispatchWriteEvent(oldValue, null);
        storage.removeItem(key);
      } else {
        const serialized = serializer.write(v);
        if (oldValue !== serialized) {
          storage.setItem(key, serialized);
          dispatchWriteEvent(oldValue, serialized);
        }
      }
    } catch (e) {
      onError(e);
    }
  }
  function read(event) {
    const rawValue = event ? event.newValue : storage.getItem(key);
    if (rawValue == null) {
      if (writeDefaults && rawInit != null)
        storage.setItem(key, serializer.write(rawInit));
      return rawInit;
    } else if (!event && mergeDefaults) {
      const value = serializer.read(rawValue);
      if (typeof mergeDefaults === 'function')
        return mergeDefaults(value, rawInit);
      else if (type === 'object' && !Array.isArray(value))
        return { ...rawInit, ...value };
      return value;
    } else if (typeof rawValue !== 'string') {
      return rawValue;
    } else {
      return serializer.read(rawValue);
    }
  }
  function update(event) {
    if (event && event.storageArea !== storage) return;
    if (event && event.key == null) {
      data.value = rawInit;
      return;
    }
    if (event && event.key !== key) return;
    pauseWatch();
    try {
      if (
        (event == null ? void 0 : event.newValue) !==
        serializer.write(data.value)
      )
        data.value = read(event);
    } catch (e) {
      onError(e);
    } finally {
      if (event) nextTick(resumeWatch);
      else resumeWatch();
    }
  }
  function updateFromCustomEvent(event) {
    update(event.detail);
  }
  return data;
}
function usePreferredDark(options) {
  return useMediaQuery('(prefers-color-scheme: dark)', options);
}
function useColorMode(options = {}) {
  const {
    selector = 'html',
    attribute = 'class',
    initialValue = 'auto',
    window: window2 = defaultWindow,
    storage,
    storageKey = 'vueuse-color-scheme',
    listenToStorageChanges = true,
    storageRef,
    emitAuto,
    disableTransition = true,
  } = options;
  const modes = {
    auto: '',
    light: 'light',
    dark: 'dark',
    ...(options.modes || {}),
  };
  const preferredDark = usePreferredDark({ window: window2 });
  const system = computed(() => (preferredDark.value ? 'dark' : 'light'));
  const store =
    storageRef ||
    (storageKey == null
      ? toRef2(initialValue)
      : useStorage(storageKey, initialValue, storage, {
          window: window2,
          listenToStorageChanges,
        }));
  const state = computed(() =>
    store.value === 'auto' ? system.value : store.value,
  );
  const updateHTMLAttrs = getSSRHandler(
    'updateHTMLAttrs',
    (selector2, attribute2, value) => {
      const el =
        typeof selector2 === 'string'
          ? window2 == null
            ? void 0
            : window2.document.querySelector(selector2)
          : unrefElement(selector2);
      if (!el) return;
      let style;
      if (disableTransition) {
        style = window2.document.createElement('style');
        const styleString =
          '*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}';
        style.appendChild(document.createTextNode(styleString));
        window2.document.head.appendChild(style);
      }
      if (attribute2 === 'class') {
        const current = value.split(/\s/g);
        Object.values(modes)
          .flatMap((i) => (i || '').split(/\s/g))
          .filter(Boolean)
          .forEach((v) => {
            if (current.includes(v)) el.classList.add(v);
            else el.classList.remove(v);
          });
      } else {
        el.setAttribute(attribute2, value);
      }
      if (disableTransition) {
        window2.getComputedStyle(style).opacity;
        document.head.removeChild(style);
      }
    },
  );
  function defaultOnChanged(mode) {
    var _a;
    updateHTMLAttrs(
      selector,
      attribute,
      (_a = modes[mode]) != null ? _a : mode,
    );
  }
  function onChanged(mode) {
    if (options.onChanged) options.onChanged(mode, defaultOnChanged);
    else defaultOnChanged(mode);
  }
  watch(state, onChanged, { flush: 'post', immediate: true });
  tryOnMounted(() => onChanged(state.value));
  const auto = computed({
    get() {
      return emitAuto ? store.value : state.value;
    },
    set(v) {
      store.value = v;
    },
  });
  try {
    return Object.assign(auto, { store, system, state });
  } catch (e) {
    return auto;
  }
}
function useConfirmDialog(revealed = ref(false)) {
  const confirmHook = createEventHook();
  const cancelHook = createEventHook();
  const revealHook = createEventHook();
  let _resolve = noop;
  const reveal = (data) => {
    revealHook.trigger(data);
    revealed.value = true;
    return new Promise((resolve) => {
      _resolve = resolve;
    });
  };
  const confirm = (data) => {
    revealed.value = false;
    confirmHook.trigger(data);
    _resolve({ data, isCanceled: false });
  };
  const cancel = (data) => {
    revealed.value = false;
    cancelHook.trigger(data);
    _resolve({ data, isCanceled: true });
  };
  return {
    isRevealed: computed(() => revealed.value),
    reveal,
    confirm,
    cancel,
    onReveal: revealHook.on,
    onConfirm: confirmHook.on,
    onCancel: cancelHook.on,
  };
}
function useMutationObserver(target, callback, options = {}) {
  const { window: window2 = defaultWindow, ...mutationOptions } = options;
  let observer;
  const isSupported = useSupported(
    () => window2 && 'MutationObserver' in window2,
  );
  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = void 0;
    }
  };
  const targets = computed(() => {
    const value = toValue(target);
    const items = (Array.isArray(value) ? value : [value])
      .map(unrefElement)
      .filter(notNullish);
    return new Set(items);
  });
  const stopWatch = watch(
    () => targets.value,
    (targets2) => {
      cleanup();
      if (isSupported.value && window2 && targets2.size) {
        observer = new MutationObserver(callback);
        targets2.forEach((el) => observer.observe(el, mutationOptions));
      }
    },
    { immediate: true, flush: 'post' },
  );
  const takeRecords = () => {
    return observer == null ? void 0 : observer.takeRecords();
  };
  const stop = () => {
    cleanup();
    stopWatch();
  };
  tryOnScopeDispose(stop);
  return {
    isSupported,
    stop,
    takeRecords,
  };
}
function useCssVar(prop, target, options = {}) {
  const {
    window: window2 = defaultWindow,
    initialValue = '',
    observe = false,
  } = options;
  const variable = ref(initialValue);
  const elRef = computed(() => {
    var _a;
    return (
      unrefElement(target) ||
      ((_a = window2 == null ? void 0 : window2.document) == null
        ? void 0
        : _a.documentElement)
    );
  });
  function updateCssVar() {
    var _a;
    const key = toValue(prop);
    const el = toValue(elRef);
    if (el && window2) {
      const value =
        (_a = window2.getComputedStyle(el).getPropertyValue(key)) == null
          ? void 0
          : _a.trim();
      variable.value = value || initialValue;
    }
  }
  if (observe) {
    useMutationObserver(elRef, updateCssVar, {
      attributeFilter: ['style', 'class'],
      window: window2,
    });
  }
  watch([elRef, () => toValue(prop)], updateCssVar, { immediate: true });
  watch(variable, (val) => {
    var _a;
    if ((_a = elRef.value) == null ? void 0 : _a.style)
      elRef.value.style.setProperty(toValue(prop), val);
  });
  return variable;
}
function useCurrentElement(rootComponent) {
  const vm = getCurrentInstance();
  const currentElement = computedWithControl(
    () => null,
    () => (rootComponent ? unrefElement(rootComponent) : vm.proxy.$el),
  );
  onUpdated(currentElement.trigger);
  onMounted(currentElement.trigger);
  return currentElement;
}
function useCycleList(list, options) {
  const state = shallowRef(getInitialValue());
  const listRef = toRef2(list);
  const index = computed({
    get() {
      var _a;
      const targetList = listRef.value;
      let index2 = (options == null ? void 0 : options.getIndexOf)
        ? options.getIndexOf(state.value, targetList)
        : targetList.indexOf(state.value);
      if (index2 < 0)
        index2 =
          (_a = options == null ? void 0 : options.fallbackIndex) != null
            ? _a
            : 0;
      return index2;
    },
    set(v) {
      set3(v);
    },
  });
  function set3(i) {
    const targetList = listRef.value;
    const length = targetList.length;
    const index2 = ((i % length) + length) % length;
    const value = targetList[index2];
    state.value = value;
    return value;
  }
  function shift(delta = 1) {
    return set3(index.value + delta);
  }
  function next(n = 1) {
    return shift(n);
  }
  function prev(n = 1) {
    return shift(-n);
  }
  function getInitialValue() {
    var _a, _b;
    return (_b = toValue(
      (_a = options == null ? void 0 : options.initialValue) != null
        ? _a
        : toValue(list)[0],
    )) != null
      ? _b
      : void 0;
  }
  watch(listRef, () => set3(index.value));
  return {
    state,
    index,
    next,
    prev,
    go: set3,
  };
}
function useDark(options = {}) {
  const {
    valueDark = 'dark',
    valueLight = '',
    window: window2 = defaultWindow,
  } = options;
  const mode = useColorMode({
    ...options,
    onChanged: (mode2, defaultHandler) => {
      var _a;
      if (options.onChanged)
        (_a = options.onChanged) == null
          ? void 0
          : _a.call(options, mode2 === 'dark', defaultHandler, mode2);
      else defaultHandler(mode2);
    },
    modes: {
      dark: valueDark,
      light: valueLight,
    },
  });
  const system = computed(() => {
    if (mode.system) {
      return mode.system.value;
    } else {
      const preferredDark = usePreferredDark({ window: window2 });
      return preferredDark.value ? 'dark' : 'light';
    }
  });
  const isDark = computed({
    get() {
      return mode.value === 'dark';
    },
    set(v) {
      const modeVal = v ? 'dark' : 'light';
      if (system.value === modeVal) mode.value = 'auto';
      else mode.value = modeVal;
    },
  });
  return isDark;
}
function fnBypass(v) {
  return v;
}
function fnSetSource(source, value) {
  return (source.value = value);
}
function defaultDump(clone) {
  return clone ? (typeof clone === 'function' ? clone : cloneFnJSON) : fnBypass;
}
function defaultParse(clone) {
  return clone ? (typeof clone === 'function' ? clone : cloneFnJSON) : fnBypass;
}
function useManualRefHistory(source, options = {}) {
  const {
    clone = false,
    dump = defaultDump(clone),
    parse = defaultParse(clone),
    setSource = fnSetSource,
  } = options;
  function _createHistoryRecord() {
    return markRaw({
      snapshot: dump(source.value),
      timestamp: timestamp(),
    });
  }
  const last = ref(_createHistoryRecord());
  const undoStack = ref([]);
  const redoStack = ref([]);
  const _setSource = (record) => {
    setSource(source, parse(record.snapshot));
    last.value = record;
  };
  const commit = () => {
    undoStack.value.unshift(last.value);
    last.value = _createHistoryRecord();
    if (options.capacity && undoStack.value.length > options.capacity)
      undoStack.value.splice(options.capacity, Number.POSITIVE_INFINITY);
    if (redoStack.value.length)
      redoStack.value.splice(0, redoStack.value.length);
  };
  const clear = () => {
    undoStack.value.splice(0, undoStack.value.length);
    redoStack.value.splice(0, redoStack.value.length);
  };
  const undo = () => {
    const state = undoStack.value.shift();
    if (state) {
      redoStack.value.unshift(last.value);
      _setSource(state);
    }
  };
  const redo = () => {
    const state = redoStack.value.shift();
    if (state) {
      undoStack.value.unshift(last.value);
      _setSource(state);
    }
  };
  const reset = () => {
    _setSource(last.value);
  };
  const history = computed(() => [last.value, ...undoStack.value]);
  const canUndo = computed(() => undoStack.value.length > 0);
  const canRedo = computed(() => redoStack.value.length > 0);
  return {
    source,
    undoStack,
    redoStack,
    last,
    history,
    canUndo,
    canRedo,
    clear,
    commit,
    reset,
    undo,
    redo,
  };
}
function useRefHistory(source, options = {}) {
  const { deep = false, flush = 'pre', eventFilter } = options;
  const {
    eventFilter: composedFilter,
    pause,
    resume: resumeTracking,
    isActive: isTracking,
  } = pausableFilter(eventFilter);
  const { ignoreUpdates, ignorePrevAsyncUpdates, stop } = watchIgnorable(
    source,
    commit,
    { deep, flush, eventFilter: composedFilter },
  );
  function setSource(source2, value) {
    ignorePrevAsyncUpdates();
    ignoreUpdates(() => {
      source2.value = value;
    });
  }
  const manualHistory = useManualRefHistory(source, {
    ...options,
    clone: options.clone || deep,
    setSource,
  });
  const { clear, commit: manualCommit } = manualHistory;
  function commit() {
    ignorePrevAsyncUpdates();
    manualCommit();
  }
  function resume(commitNow) {
    resumeTracking();
    if (commitNow) commit();
  }
  function batch(fn) {
    let canceled = false;
    const cancel = () => (canceled = true);
    ignoreUpdates(() => {
      fn(cancel);
    });
    if (!canceled) commit();
  }
  function dispose() {
    stop();
    clear();
  }
  return {
    ...manualHistory,
    isTracking,
    pause,
    resume,
    commit,
    batch,
    dispose,
  };
}
function useDebouncedRefHistory(source, options = {}) {
  const filter = options.debounce ? debounceFilter(options.debounce) : void 0;
  const history = useRefHistory(source, { ...options, eventFilter: filter });
  return {
    ...history,
  };
}
function useDeviceMotion(options = {}) {
  const { window: window2 = defaultWindow, eventFilter = bypassFilter } =
    options;
  const acceleration = ref({ x: null, y: null, z: null });
  const rotationRate = ref({ alpha: null, beta: null, gamma: null });
  const interval = ref(0);
  const accelerationIncludingGravity = ref({
    x: null,
    y: null,
    z: null,
  });
  if (window2) {
    const onDeviceMotion = createFilterWrapper(eventFilter, (event) => {
      acceleration.value = event.acceleration;
      accelerationIncludingGravity.value = event.accelerationIncludingGravity;
      rotationRate.value = event.rotationRate;
      interval.value = event.interval;
    });
    useEventListener(window2, 'devicemotion', onDeviceMotion);
  }
  return {
    acceleration,
    accelerationIncludingGravity,
    rotationRate,
    interval,
  };
}
function useDeviceOrientation(options = {}) {
  const { window: window2 = defaultWindow } = options;
  const isSupported = useSupported(
    () => window2 && 'DeviceOrientationEvent' in window2,
  );
  const isAbsolute = ref(false);
  const alpha = ref(null);
  const beta = ref(null);
  const gamma = ref(null);
  if (window2 && isSupported.value) {
    useEventListener(window2, 'deviceorientation', (event) => {
      isAbsolute.value = event.absolute;
      alpha.value = event.alpha;
      beta.value = event.beta;
      gamma.value = event.gamma;
    });
  }
  return {
    isSupported,
    isAbsolute,
    alpha,
    beta,
    gamma,
  };
}
function useDevicePixelRatio(options = {}) {
  const { window: window2 = defaultWindow } = options;
  const pixelRatio = ref(1);
  if (window2) {
    let observe2 = function () {
        pixelRatio.value = window2.devicePixelRatio;
        cleanup2();
        media = window2.matchMedia(`(resolution: ${pixelRatio.value}dppx)`);
        media.addEventListener('change', observe2, { once: true });
      },
      cleanup2 = function () {
        media == null ? void 0 : media.removeEventListener('change', observe2);
      };
    let media;
    observe2();
    tryOnScopeDispose(cleanup2);
  }
  return { pixelRatio };
}
function useDevicesList(options = {}) {
  const {
    navigator = defaultNavigator,
    requestPermissions = false,
    constraints = { audio: true, video: true },
    onUpdated: onUpdated2,
  } = options;
  const devices = ref([]);
  const videoInputs = computed(() =>
    devices.value.filter((i) => i.kind === 'videoinput'),
  );
  const audioInputs = computed(() =>
    devices.value.filter((i) => i.kind === 'audioinput'),
  );
  const audioOutputs = computed(() =>
    devices.value.filter((i) => i.kind === 'audiooutput'),
  );
  const isSupported = useSupported(
    () =>
      navigator &&
      navigator.mediaDevices &&
      navigator.mediaDevices.enumerateDevices,
  );
  const permissionGranted = ref(false);
  let stream;
  async function update() {
    if (!isSupported.value) return;
    devices.value = await navigator.mediaDevices.enumerateDevices();
    onUpdated2 == null ? void 0 : onUpdated2(devices.value);
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      stream = null;
    }
  }
  async function ensurePermissions() {
    if (!isSupported.value) return false;
    if (permissionGranted.value) return true;
    const { state, query } = usePermission('camera', { controls: true });
    await query();
    if (state.value !== 'granted') {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      update();
      permissionGranted.value = true;
    } else {
      permissionGranted.value = true;
    }
    return permissionGranted.value;
  }
  if (isSupported.value) {
    if (requestPermissions) ensurePermissions();
    useEventListener(navigator.mediaDevices, 'devicechange', update);
    update();
  }
  return {
    devices,
    ensurePermissions,
    permissionGranted,
    videoInputs,
    audioInputs,
    audioOutputs,
    isSupported,
  };
}
function useDisplayMedia(options = {}) {
  var _a;
  const enabled = ref((_a = options.enabled) != null ? _a : false);
  const video = options.video;
  const audio = options.audio;
  const { navigator = defaultNavigator } = options;
  const isSupported = useSupported(() => {
    var _a2;
    return (_a2 = navigator == null ? void 0 : navigator.mediaDevices) == null
      ? void 0
      : _a2.getDisplayMedia;
  });
  const constraint = { audio, video };
  const stream = shallowRef();
  async function _start() {
    if (!isSupported.value || stream.value) return;
    stream.value = await navigator.mediaDevices.getDisplayMedia(constraint);
    return stream.value;
  }
  async function _stop() {
    var _a2;
    (_a2 = stream.value) == null
      ? void 0
      : _a2.getTracks().forEach((t) => t.stop());
    stream.value = void 0;
  }
  function stop() {
    _stop();
    enabled.value = false;
  }
  async function start() {
    await _start();
    if (stream.value) enabled.value = true;
    return stream.value;
  }
  watch(
    enabled,
    (v) => {
      if (v) _start();
      else _stop();
    },
    { immediate: true },
  );
  return {
    isSupported,
    stream,
    start,
    stop,
    enabled,
  };
}
function useDocumentVisibility(options = {}) {
  const { document: document2 = defaultDocument } = options;
  if (!document2) return ref('visible');
  const visibility = ref(document2.visibilityState);
  useEventListener(document2, 'visibilitychange', () => {
    visibility.value = document2.visibilityState;
  });
  return visibility;
}
function useDraggable(target, options = {}) {
  var _a, _b;
  const {
    pointerTypes,
    preventDefault: preventDefault2,
    stopPropagation,
    exact,
    onMove,
    onEnd,
    onStart,
    initialValue,
    axis = 'both',
    draggingElement = defaultWindow,
    containerElement,
    handle: draggingHandle = target,
  } = options;
  const position = ref(
    (_a = toValue(initialValue)) != null ? _a : { x: 0, y: 0 },
  );
  const pressedDelta = ref();
  const filterEvent = (e) => {
    if (pointerTypes) return pointerTypes.includes(e.pointerType);
    return true;
  };
  const handleEvent = (e) => {
    if (toValue(preventDefault2)) e.preventDefault();
    if (toValue(stopPropagation)) e.stopPropagation();
  };
  const start = (e) => {
    var _a2;
    if (toValue(options.disabled) || !filterEvent(e)) return;
    if (toValue(exact) && e.target !== toValue(target)) return;
    const container = toValue(containerElement);
    const containerRect =
      (_a2 = container == null ? void 0 : container.getBoundingClientRect) ==
      null
        ? void 0
        : _a2.call(container);
    const targetRect = toValue(target).getBoundingClientRect();
    const pos = {
      x:
        e.clientX -
        (container
          ? targetRect.left - containerRect.left + container.scrollLeft
          : targetRect.left),
      y:
        e.clientY -
        (container
          ? targetRect.top - containerRect.top + container.scrollTop
          : targetRect.top),
    };
    if ((onStart == null ? void 0 : onStart(pos, e)) === false) return;
    pressedDelta.value = pos;
    handleEvent(e);
  };
  const move = (e) => {
    if (toValue(options.disabled) || !filterEvent(e)) return;
    if (!pressedDelta.value) return;
    const container = toValue(containerElement);
    const targetRect = toValue(target).getBoundingClientRect();
    let { x, y } = position.value;
    if (axis === 'x' || axis === 'both') {
      x = e.clientX - pressedDelta.value.x;
      if (container)
        x = Math.min(Math.max(0, x), container.scrollWidth - targetRect.width);
    }
    if (axis === 'y' || axis === 'both') {
      y = e.clientY - pressedDelta.value.y;
      if (container)
        y = Math.min(
          Math.max(0, y),
          container.scrollHeight - targetRect.height,
        );
    }
    position.value = {
      x,
      y,
    };
    onMove == null ? void 0 : onMove(position.value, e);
    handleEvent(e);
  };
  const end = (e) => {
    if (toValue(options.disabled) || !filterEvent(e)) return;
    if (!pressedDelta.value) return;
    pressedDelta.value = void 0;
    onEnd == null ? void 0 : onEnd(position.value, e);
    handleEvent(e);
  };
  if (isClient) {
    const config = { capture: (_b = options.capture) != null ? _b : true };
    useEventListener(draggingHandle, 'pointerdown', start, config);
    useEventListener(draggingElement, 'pointermove', move, config);
    useEventListener(draggingElement, 'pointerup', end, config);
  }
  return {
    ...toRefs2(position),
    position,
    isDragging: computed(() => !!pressedDelta.value),
    style: computed(
      () => `left:${position.value.x}px;top:${position.value.y}px;`,
    ),
  };
}
function useDropZone(target, options = {}) {
  const isOverDropZone = ref(false);
  const files = shallowRef(null);
  let counter = 0;
  let isDataTypeIncluded = true;
  if (isClient) {
    const _options =
      typeof options === 'function' ? { onDrop: options } : options;
    const getFiles = (event) => {
      var _a, _b;
      const list = Array.from(
        (_b = (_a = event.dataTransfer) == null ? void 0 : _a.files) != null
          ? _b
          : [],
      );
      return (files.value = list.length === 0 ? null : list);
    };
    useEventListener(target, 'dragenter', (event) => {
      var _a, _b;
      const types = Array.from(
        ((_a = event == null ? void 0 : event.dataTransfer) == null
          ? void 0
          : _a.items) || [],
      )
        .map((i) => (i.kind === 'file' ? i.type : null))
        .filter(notNullish);
      if (_options.dataTypes && event.dataTransfer) {
        const dataTypes = unref(_options.dataTypes);
        isDataTypeIncluded =
          typeof dataTypes === 'function'
            ? dataTypes(types)
            : dataTypes
              ? dataTypes.some((item) => types.includes(item))
              : true;
        if (!isDataTypeIncluded) return;
      }
      event.preventDefault();
      counter += 1;
      isOverDropZone.value = true;
      (_b = _options.onEnter) == null
        ? void 0
        : _b.call(_options, getFiles(event), event);
    });
    useEventListener(target, 'dragover', (event) => {
      var _a;
      if (!isDataTypeIncluded) return;
      event.preventDefault();
      (_a = _options.onOver) == null
        ? void 0
        : _a.call(_options, getFiles(event), event);
    });
    useEventListener(target, 'dragleave', (event) => {
      var _a;
      if (!isDataTypeIncluded) return;
      event.preventDefault();
      counter -= 1;
      if (counter === 0) isOverDropZone.value = false;
      (_a = _options.onLeave) == null
        ? void 0
        : _a.call(_options, getFiles(event), event);
    });
    useEventListener(target, 'drop', (event) => {
      var _a;
      event.preventDefault();
      counter = 0;
      isOverDropZone.value = false;
      (_a = _options.onDrop) == null
        ? void 0
        : _a.call(_options, getFiles(event), event);
    });
  }
  return {
    files,
    isOverDropZone,
  };
}
function useResizeObserver(target, callback, options = {}) {
  const { window: window2 = defaultWindow, ...observerOptions } = options;
  let observer;
  const isSupported = useSupported(
    () => window2 && 'ResizeObserver' in window2,
  );
  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = void 0;
    }
  };
  const targets = computed(() =>
    Array.isArray(target)
      ? target.map((el) => unrefElement(el))
      : [unrefElement(target)],
  );
  const stopWatch = watch(
    targets,
    (els) => {
      cleanup();
      if (isSupported.value && window2) {
        observer = new ResizeObserver(callback);
        for (const _el of els) _el && observer.observe(_el, observerOptions);
      }
    },
    { immediate: true, flush: 'post' },
  );
  const stop = () => {
    cleanup();
    stopWatch();
  };
  tryOnScopeDispose(stop);
  return {
    isSupported,
    stop,
  };
}
function useElementBounding(target, options = {}) {
  const {
    reset = true,
    windowResize = true,
    windowScroll = true,
    immediate = true,
  } = options;
  const height = ref(0);
  const bottom = ref(0);
  const left = ref(0);
  const right = ref(0);
  const top = ref(0);
  const width = ref(0);
  const x = ref(0);
  const y = ref(0);
  function update() {
    const el = unrefElement(target);
    if (!el) {
      if (reset) {
        height.value = 0;
        bottom.value = 0;
        left.value = 0;
        right.value = 0;
        top.value = 0;
        width.value = 0;
        x.value = 0;
        y.value = 0;
      }
      return;
    }
    const rect = el.getBoundingClientRect();
    height.value = rect.height;
    bottom.value = rect.bottom;
    left.value = rect.left;
    right.value = rect.right;
    top.value = rect.top;
    width.value = rect.width;
    x.value = rect.x;
    y.value = rect.y;
  }
  useResizeObserver(target, update);
  watch(
    () => unrefElement(target),
    (ele) => !ele && update(),
  );
  useMutationObserver(target, update, {
    attributeFilter: ['style', 'class'],
  });
  if (windowScroll)
    useEventListener('scroll', update, { capture: true, passive: true });
  if (windowResize) useEventListener('resize', update, { passive: true });
  tryOnMounted(() => {
    if (immediate) update();
  });
  return {
    height,
    bottom,
    left,
    right,
    top,
    width,
    x,
    y,
    update,
  };
}
function useElementByPoint(options) {
  const {
    x,
    y,
    document: document2 = defaultDocument,
    multiple,
    interval = 'requestAnimationFrame',
    immediate = true,
  } = options;
  const isSupported = useSupported(() => {
    if (toValue(multiple)) return document2 && 'elementsFromPoint' in document2;
    return document2 && 'elementFromPoint' in document2;
  });
  const element = ref(null);
  const cb = () => {
    var _a, _b;
    element.value = toValue(multiple)
      ? (_a =
          document2 == null
            ? void 0
            : document2.elementsFromPoint(toValue(x), toValue(y))) != null
        ? _a
        : []
      : (_b =
            document2 == null
              ? void 0
              : document2.elementFromPoint(toValue(x), toValue(y))) != null
        ? _b
        : null;
  };
  const controls =
    interval === 'requestAnimationFrame'
      ? useRafFn(cb, { immediate })
      : useIntervalFn(cb, interval, { immediate });
  return {
    isSupported,
    element,
    ...controls,
  };
}
function useElementHover(el, options = {}) {
  const {
    delayEnter = 0,
    delayLeave = 0,
    window: window2 = defaultWindow,
  } = options;
  const isHovered = ref(false);
  let timer;
  const toggle = (entering) => {
    const delay = entering ? delayEnter : delayLeave;
    if (timer) {
      clearTimeout(timer);
      timer = void 0;
    }
    if (delay) timer = setTimeout(() => (isHovered.value = entering), delay);
    else isHovered.value = entering;
  };
  if (!window2) return isHovered;
  useEventListener(el, 'mouseenter', () => toggle(true), { passive: true });
  useEventListener(el, 'mouseleave', () => toggle(false), { passive: true });
  return isHovered;
}
function useElementSize(
  target,
  initialSize = { width: 0, height: 0 },
  options = {},
) {
  const { window: window2 = defaultWindow, box = 'content-box' } = options;
  const isSVG = computed(() => {
    var _a, _b;
    return (_b =
      (_a = unrefElement(target)) == null ? void 0 : _a.namespaceURI) == null
      ? void 0
      : _b.includes('svg');
  });
  const width = ref(initialSize.width);
  const height = ref(initialSize.height);
  const { stop: stop1 } = useResizeObserver(
    target,
    ([entry]) => {
      const boxSize =
        box === 'border-box'
          ? entry.borderBoxSize
          : box === 'content-box'
            ? entry.contentBoxSize
            : entry.devicePixelContentBoxSize;
      if (window2 && isSVG.value) {
        const $elem = unrefElement(target);
        if ($elem) {
          const styles = window2.getComputedStyle($elem);
          width.value = Number.parseFloat(styles.width);
          height.value = Number.parseFloat(styles.height);
        }
      } else {
        if (boxSize) {
          const formatBoxSize = Array.isArray(boxSize) ? boxSize : [boxSize];
          width.value = formatBoxSize.reduce(
            (acc, { inlineSize }) => acc + inlineSize,
            0,
          );
          height.value = formatBoxSize.reduce(
            (acc, { blockSize }) => acc + blockSize,
            0,
          );
        } else {
          width.value = entry.contentRect.width;
          height.value = entry.contentRect.height;
        }
      }
    },
    options,
  );
  tryOnMounted(() => {
    const ele = unrefElement(target);
    if (ele) {
      width.value = 'offsetWidth' in ele ? ele.offsetWidth : initialSize.width;
      height.value =
        'offsetHeight' in ele ? ele.offsetHeight : initialSize.height;
    }
  });
  const stop2 = watch(
    () => unrefElement(target),
    (ele) => {
      width.value = ele ? initialSize.width : 0;
      height.value = ele ? initialSize.height : 0;
    },
  );
  function stop() {
    stop1();
    stop2();
  }
  return {
    width,
    height,
    stop,
  };
}
function useIntersectionObserver(target, callback, options = {}) {
  const {
    root,
    rootMargin = '0px',
    threshold = 0.1,
    window: window2 = defaultWindow,
    immediate = true,
  } = options;
  const isSupported = useSupported(
    () => window2 && 'IntersectionObserver' in window2,
  );
  const targets = computed(() => {
    const _target = toValue(target);
    return (Array.isArray(_target) ? _target : [_target])
      .map(unrefElement)
      .filter(notNullish);
  });
  let cleanup = noop;
  const isActive = ref(immediate);
  const stopWatch = isSupported.value
    ? watch(
        () => [targets.value, unrefElement(root), isActive.value],
        ([targets2, root2]) => {
          cleanup();
          if (!isActive.value) return;
          if (!targets2.length) return;
          const observer = new IntersectionObserver(callback, {
            root: unrefElement(root2),
            rootMargin,
            threshold,
          });
          targets2.forEach((el) => el && observer.observe(el));
          cleanup = () => {
            observer.disconnect();
            cleanup = noop;
          };
        },
        { immediate, flush: 'post' },
      )
    : noop;
  const stop = () => {
    cleanup();
    stopWatch();
    isActive.value = false;
  };
  tryOnScopeDispose(stop);
  return {
    isSupported,
    isActive,
    pause() {
      cleanup();
      isActive.value = false;
    },
    resume() {
      isActive.value = true;
    },
    stop,
  };
}
function useElementVisibility(element, options = {}) {
  const {
    window: window2 = defaultWindow,
    scrollTarget,
    threshold = 0,
  } = options;
  const elementIsVisible = ref(false);
  useIntersectionObserver(
    element,
    (intersectionObserverEntries) => {
      let isIntersecting = elementIsVisible.value;
      let latestTime = 0;
      for (const entry of intersectionObserverEntries) {
        if (entry.time >= latestTime) {
          latestTime = entry.time;
          isIntersecting = entry.isIntersecting;
        }
      }
      elementIsVisible.value = isIntersecting;
    },
    {
      root: scrollTarget,
      window: window2,
      threshold,
    },
  );
  return elementIsVisible;
}
var events = /* @__PURE__ */ new Map();
function useEventBus(key) {
  const scope = getCurrentScope();
  function on(listener) {
    var _a;
    const listeners = events.get(key) || /* @__PURE__ */ new Set();
    listeners.add(listener);
    events.set(key, listeners);
    const _off = () => off(listener);
    (_a = scope == null ? void 0 : scope.cleanups) == null
      ? void 0
      : _a.push(_off);
    return _off;
  }
  function once(listener) {
    function _listener(...args) {
      off(_listener);
      listener(...args);
    }
    return on(_listener);
  }
  function off(listener) {
    const listeners = events.get(key);
    if (!listeners) return;
    listeners.delete(listener);
    if (!listeners.size) reset();
  }
  function reset() {
    events.delete(key);
  }
  function emit(event, payload) {
    var _a;
    (_a = events.get(key)) == null
      ? void 0
      : _a.forEach((v) => v(event, payload));
  }
  return { on, once, off, emit, reset };
}
function resolveNestedOptions$1(options) {
  if (options === true) return {};
  return options;
}
function useEventSource(url, events2 = [], options = {}) {
  const event = ref(null);
  const data = ref(null);
  const status = ref('CONNECTING');
  const eventSource = ref(null);
  const error = shallowRef(null);
  const urlRef = toRef2(url);
  let explicitlyClosed = false;
  let retried = 0;
  const { withCredentials = false, immediate = true } = options;
  const close = () => {
    if (isClient && eventSource.value) {
      eventSource.value.close();
      eventSource.value = null;
      status.value = 'CLOSED';
      explicitlyClosed = true;
    }
  };
  const _init = () => {
    if (explicitlyClosed || typeof urlRef.value === 'undefined') return;
    const es = new EventSource(urlRef.value, { withCredentials });
    status.value = 'CONNECTING';
    eventSource.value = es;
    es.onopen = () => {
      status.value = 'OPEN';
      error.value = null;
    };
    es.onerror = (e) => {
      status.value = 'CLOSED';
      error.value = e;
      if (es.readyState === 2 && !explicitlyClosed && options.autoReconnect) {
        es.close();
        const {
          retries = -1,
          delay = 1e3,
          onFailed,
        } = resolveNestedOptions$1(options.autoReconnect);
        retried += 1;
        if (typeof retries === 'number' && (retries < 0 || retried < retries))
          setTimeout(_init, delay);
        else if (typeof retries === 'function' && retries())
          setTimeout(_init, delay);
        else onFailed == null ? void 0 : onFailed();
      }
    };
    es.onmessage = (e) => {
      event.value = null;
      data.value = e.data;
    };
    for (const event_name of events2) {
      useEventListener(es, event_name, (e) => {
        event.value = event_name;
        data.value = e.data || null;
      });
    }
  };
  const open = () => {
    if (!isClient) return;
    close();
    explicitlyClosed = false;
    retried = 0;
    _init();
  };
  if (immediate) watch(urlRef, open, { immediate: true });
  tryOnScopeDispose(close);
  return {
    eventSource,
    event,
    data,
    status,
    error,
    open,
    close,
  };
}
function useEyeDropper(options = {}) {
  const { initialValue = '' } = options;
  const isSupported = useSupported(
    () => typeof window !== 'undefined' && 'EyeDropper' in window,
  );
  const sRGBHex = ref(initialValue);
  async function open(openOptions) {
    if (!isSupported.value) return;
    const eyeDropper = new window.EyeDropper();
    const result = await eyeDropper.open(openOptions);
    sRGBHex.value = result.sRGBHex;
    return result;
  }
  return { isSupported, sRGBHex, open };
}
function useFavicon(newIcon = null, options = {}) {
  const {
    baseUrl = '',
    rel = 'icon',
    document: document2 = defaultDocument,
  } = options;
  const favicon = toRef2(newIcon);
  const applyIcon = (icon) => {
    const elements =
      document2 == null
        ? void 0
        : document2.head.querySelectorAll(`link[rel*="${rel}"]`);
    if (!elements || elements.length === 0) {
      const link = document2 == null ? void 0 : document2.createElement('link');
      if (link) {
        link.rel = rel;
        link.href = `${baseUrl}${icon}`;
        link.type = `image/${icon.split('.').pop()}`;
        document2 == null ? void 0 : document2.head.append(link);
      }
      return;
    }
    elements == null
      ? void 0
      : elements.forEach((el) => (el.href = `${baseUrl}${icon}`));
  };
  watch(
    favicon,
    (i, o) => {
      if (typeof i === 'string' && i !== o) applyIcon(i);
    },
    { immediate: true },
  );
  return favicon;
}
var payloadMapping = {
  json: 'application/json',
  text: 'text/plain',
};
function isFetchOptions(obj) {
  return (
    obj &&
    containsProp(
      obj,
      'immediate',
      'refetch',
      'initialData',
      'timeout',
      'beforeFetch',
      'afterFetch',
      'onFetchError',
      'fetch',
      'updateDataOnError',
    )
  );
}
function isAbsoluteURL(url) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}
function headersToObject(headers) {
  if (typeof Headers !== 'undefined' && headers instanceof Headers)
    return Object.fromEntries(headers.entries());
  return headers;
}
function combineCallbacks(combination, ...callbacks) {
  if (combination === 'overwrite') {
    return async (ctx) => {
      const callback = callbacks[callbacks.length - 1];
      if (callback) return { ...ctx, ...(await callback(ctx)) };
      return ctx;
    };
  } else {
    return async (ctx) => {
      for (const callback of callbacks) {
        if (callback) ctx = { ...ctx, ...(await callback(ctx)) };
      }
      return ctx;
    };
  }
}
function createFetch(config = {}) {
  const _combination = config.combination || 'chain';
  const _options = config.options || {};
  const _fetchOptions = config.fetchOptions || {};
  function useFactoryFetch(url, ...args) {
    const computedUrl = computed(() => {
      const baseUrl = toValue(config.baseUrl);
      const targetUrl = toValue(url);
      return baseUrl && !isAbsoluteURL(targetUrl)
        ? joinPaths(baseUrl, targetUrl)
        : targetUrl;
    });
    let options = _options;
    let fetchOptions = _fetchOptions;
    if (args.length > 0) {
      if (isFetchOptions(args[0])) {
        options = {
          ...options,
          ...args[0],
          beforeFetch: combineCallbacks(
            _combination,
            _options.beforeFetch,
            args[0].beforeFetch,
          ),
          afterFetch: combineCallbacks(
            _combination,
            _options.afterFetch,
            args[0].afterFetch,
          ),
          onFetchError: combineCallbacks(
            _combination,
            _options.onFetchError,
            args[0].onFetchError,
          ),
        };
      } else {
        fetchOptions = {
          ...fetchOptions,
          ...args[0],
          headers: {
            ...(headersToObject(fetchOptions.headers) || {}),
            ...(headersToObject(args[0].headers) || {}),
          },
        };
      }
    }
    if (args.length > 1 && isFetchOptions(args[1])) {
      options = {
        ...options,
        ...args[1],
        beforeFetch: combineCallbacks(
          _combination,
          _options.beforeFetch,
          args[1].beforeFetch,
        ),
        afterFetch: combineCallbacks(
          _combination,
          _options.afterFetch,
          args[1].afterFetch,
        ),
        onFetchError: combineCallbacks(
          _combination,
          _options.onFetchError,
          args[1].onFetchError,
        ),
      };
    }
    return useFetch(computedUrl, fetchOptions, options);
  }
  return useFactoryFetch;
}
function useFetch(url, ...args) {
  var _a;
  const supportsAbort = typeof AbortController === 'function';
  let fetchOptions = {};
  let options = {
    immediate: true,
    refetch: false,
    timeout: 0,
    updateDataOnError: false,
  };
  const config = {
    method: 'GET',
    type: 'text',
    payload: void 0,
  };
  if (args.length > 0) {
    if (isFetchOptions(args[0])) options = { ...options, ...args[0] };
    else fetchOptions = args[0];
  }
  if (args.length > 1) {
    if (isFetchOptions(args[1])) options = { ...options, ...args[1] };
  }
  const {
    fetch = (_a = defaultWindow) == null ? void 0 : _a.fetch,
    initialData,
    timeout,
  } = options;
  const responseEvent = createEventHook();
  const errorEvent = createEventHook();
  const finallyEvent = createEventHook();
  const isFinished = ref(false);
  const isFetching = ref(false);
  const aborted = ref(false);
  const statusCode = ref(null);
  const response = shallowRef(null);
  const error = shallowRef(null);
  const data = shallowRef(initialData || null);
  const canAbort = computed(() => supportsAbort && isFetching.value);
  let controller;
  let timer;
  const abort = () => {
    if (supportsAbort) {
      controller == null ? void 0 : controller.abort();
      controller = new AbortController();
      controller.signal.onabort = () => (aborted.value = true);
      fetchOptions = {
        ...fetchOptions,
        signal: controller.signal,
      };
    }
  };
  const loading = (isLoading) => {
    isFetching.value = isLoading;
    isFinished.value = !isLoading;
  };
  if (timeout) timer = useTimeoutFn(abort, timeout, { immediate: false });
  let executeCounter = 0;
  const execute = async (throwOnFailed = false) => {
    var _a2, _b;
    abort();
    loading(true);
    error.value = null;
    statusCode.value = null;
    aborted.value = false;
    executeCounter += 1;
    const currentExecuteCounter = executeCounter;
    const defaultFetchOptions = {
      method: config.method,
      headers: {},
    };
    if (config.payload) {
      const headers = headersToObject(defaultFetchOptions.headers);
      const payload = toValue(config.payload);
      if (
        !config.payloadType &&
        payload &&
        Object.getPrototypeOf(payload) === Object.prototype &&
        !(payload instanceof FormData)
      )
        config.payloadType = 'json';
      if (config.payloadType)
        headers['Content-Type'] =
          (_a2 = payloadMapping[config.payloadType]) != null
            ? _a2
            : config.payloadType;
      defaultFetchOptions.body =
        config.payloadType === 'json' ? JSON.stringify(payload) : payload;
    }
    let isCanceled = false;
    const context = {
      url: toValue(url),
      options: {
        ...defaultFetchOptions,
        ...fetchOptions,
      },
      cancel: () => {
        isCanceled = true;
      },
    };
    if (options.beforeFetch)
      Object.assign(context, await options.beforeFetch(context));
    if (isCanceled || !fetch) {
      loading(false);
      return Promise.resolve(null);
    }
    let responseData = null;
    if (timer) timer.start();
    return fetch(context.url, {
      ...defaultFetchOptions,
      ...context.options,
      headers: {
        ...headersToObject(defaultFetchOptions.headers),
        ...headersToObject(
          (_b = context.options) == null ? void 0 : _b.headers,
        ),
      },
    })
      .then(async (fetchResponse) => {
        response.value = fetchResponse;
        statusCode.value = fetchResponse.status;
        responseData = await fetchResponse.clone()[config.type]();
        if (!fetchResponse.ok) {
          data.value = initialData || null;
          throw new Error(fetchResponse.statusText);
        }
        if (options.afterFetch) {
          ({ data: responseData } = await options.afterFetch({
            data: responseData,
            response: fetchResponse,
          }));
        }
        data.value = responseData;
        responseEvent.trigger(fetchResponse);
        return fetchResponse;
      })
      .catch(async (fetchError) => {
        let errorData = fetchError.message || fetchError.name;
        if (options.onFetchError) {
          ({ error: errorData, data: responseData } =
            await options.onFetchError({
              data: responseData,
              error: fetchError,
              response: response.value,
            }));
        }
        error.value = errorData;
        if (options.updateDataOnError) data.value = responseData;
        errorEvent.trigger(fetchError);
        if (throwOnFailed) throw fetchError;
        return null;
      })
      .finally(() => {
        if (currentExecuteCounter === executeCounter) loading(false);
        if (timer) timer.stop();
        finallyEvent.trigger(null);
      });
  };
  const refetch = toRef2(options.refetch);
  watch([refetch, toRef2(url)], ([refetch2]) => refetch2 && execute(), {
    deep: true,
  });
  const shell = {
    isFinished: readonly(isFinished),
    isFetching: readonly(isFetching),
    statusCode,
    response,
    error,
    data,
    canAbort,
    aborted,
    abort,
    execute,
    onFetchResponse: responseEvent.on,
    onFetchError: errorEvent.on,
    onFetchFinally: finallyEvent.on,
    // method
    get: setMethod('GET'),
    put: setMethod('PUT'),
    post: setMethod('POST'),
    delete: setMethod('DELETE'),
    patch: setMethod('PATCH'),
    head: setMethod('HEAD'),
    options: setMethod('OPTIONS'),
    // type
    json: setType('json'),
    text: setType('text'),
    blob: setType('blob'),
    arrayBuffer: setType('arrayBuffer'),
    formData: setType('formData'),
  };
  function setMethod(method) {
    return (payload, payloadType) => {
      if (!isFetching.value) {
        config.method = method;
        config.payload = payload;
        config.payloadType = payloadType;
        if (isRef(config.payload)) {
          watch(
            [refetch, toRef2(config.payload)],
            ([refetch2]) => refetch2 && execute(),
            { deep: true },
          );
        }
        return {
          ...shell,
          then(onFulfilled, onRejected) {
            return waitUntilFinished().then(onFulfilled, onRejected);
          },
        };
      }
      return void 0;
    };
  }
  function waitUntilFinished() {
    return new Promise((resolve, reject) => {
      until(isFinished)
        .toBe(true)
        .then(() => resolve(shell))
        .catch((error2) => reject(error2));
    });
  }
  function setType(type) {
    return () => {
      if (!isFetching.value) {
        config.type = type;
        return {
          ...shell,
          then(onFulfilled, onRejected) {
            return waitUntilFinished().then(onFulfilled, onRejected);
          },
        };
      }
      return void 0;
    };
  }
  if (options.immediate) Promise.resolve().then(() => execute());
  return {
    ...shell,
    then(onFulfilled, onRejected) {
      return waitUntilFinished().then(onFulfilled, onRejected);
    },
  };
}
function joinPaths(start, end) {
  if (!start.endsWith('/') && !end.startsWith('/')) return `${start}/${end}`;
  return `${start}${end}`;
}
var DEFAULT_OPTIONS = {
  multiple: true,
  accept: '*',
  reset: false,
  directory: false,
};
function useFileDialog(options = {}) {
  const { document: document2 = defaultDocument } = options;
  const files = ref(null);
  const { on: onChange, trigger } = createEventHook();
  let input;
  if (document2) {
    input = document2.createElement('input');
    input.type = 'file';
    input.onchange = (event) => {
      const result = event.target;
      files.value = result.files;
      trigger(files.value);
    };
  }
  const reset = () => {
    files.value = null;
    if (input) {
      input.value = '';
      trigger(null);
    }
  };
  const open = (localOptions) => {
    if (!input) return;
    const _options = {
      ...DEFAULT_OPTIONS,
      ...options,
      ...localOptions,
    };
    input.multiple = _options.multiple;
    input.accept = _options.accept;
    input.webkitdirectory = _options.directory;
    if (hasOwn(_options, 'capture')) input.capture = _options.capture;
    if (_options.reset) reset();
    input.click();
  };
  return {
    files: readonly(files),
    open,
    reset,
    onChange,
  };
}
function useFileSystemAccess(options = {}) {
  const { window: _window = defaultWindow, dataType = 'Text' } = options;
  const window2 = _window;
  const isSupported = useSupported(
    () =>
      window2 &&
      'showSaveFilePicker' in window2 &&
      'showOpenFilePicker' in window2,
  );
  const fileHandle = ref();
  const data = ref();
  const file = ref();
  const fileName = computed(() => {
    var _a, _b;
    return (_b = (_a = file.value) == null ? void 0 : _a.name) != null
      ? _b
      : '';
  });
  const fileMIME = computed(() => {
    var _a, _b;
    return (_b = (_a = file.value) == null ? void 0 : _a.type) != null
      ? _b
      : '';
  });
  const fileSize = computed(() => {
    var _a, _b;
    return (_b = (_a = file.value) == null ? void 0 : _a.size) != null ? _b : 0;
  });
  const fileLastModified = computed(() => {
    var _a, _b;
    return (_b = (_a = file.value) == null ? void 0 : _a.lastModified) != null
      ? _b
      : 0;
  });
  async function open(_options = {}) {
    if (!isSupported.value) return;
    const [handle] = await window2.showOpenFilePicker({
      ...toValue(options),
      ..._options,
    });
    fileHandle.value = handle;
    await updateData();
  }
  async function create(_options = {}) {
    if (!isSupported.value) return;
    fileHandle.value = await window2.showSaveFilePicker({
      ...options,
      ..._options,
    });
    data.value = void 0;
    await updateData();
  }
  async function save(_options = {}) {
    if (!isSupported.value) return;
    if (!fileHandle.value) return saveAs(_options);
    if (data.value) {
      const writableStream = await fileHandle.value.createWritable();
      await writableStream.write(data.value);
      await writableStream.close();
    }
    await updateFile();
  }
  async function saveAs(_options = {}) {
    if (!isSupported.value) return;
    fileHandle.value = await window2.showSaveFilePicker({
      ...options,
      ..._options,
    });
    if (data.value) {
      const writableStream = await fileHandle.value.createWritable();
      await writableStream.write(data.value);
      await writableStream.close();
    }
    await updateFile();
  }
  async function updateFile() {
    var _a;
    file.value = await ((_a = fileHandle.value) == null
      ? void 0
      : _a.getFile());
  }
  async function updateData() {
    var _a, _b;
    await updateFile();
    const type = toValue(dataType);
    if (type === 'Text')
      data.value = await ((_a = file.value) == null ? void 0 : _a.text());
    else if (type === 'ArrayBuffer')
      data.value = await ((_b = file.value) == null
        ? void 0
        : _b.arrayBuffer());
    else if (type === 'Blob') data.value = file.value;
  }
  watch(() => toValue(dataType), updateData);
  return {
    isSupported,
    data,
    file,
    fileName,
    fileMIME,
    fileSize,
    fileLastModified,
    open,
    create,
    save,
    saveAs,
    updateData,
  };
}
function useFocus(target, options = {}) {
  const { initialValue = false, focusVisible = false } = options;
  const innerFocused = ref(false);
  const targetElement = computed(() => unrefElement(target));
  useEventListener(targetElement, 'focus', (event) => {
    var _a, _b;
    if (
      !focusVisible ||
      ((_b = (_a = event.target).matches) == null
        ? void 0
        : _b.call(_a, ':focus-visible'))
    )
      innerFocused.value = true;
  });
  useEventListener(targetElement, 'blur', () => (innerFocused.value = false));
  const focused = computed({
    get: () => innerFocused.value,
    set(value) {
      var _a, _b;
      if (!value && innerFocused.value)
        (_a = targetElement.value) == null ? void 0 : _a.blur();
      else if (value && !innerFocused.value)
        (_b = targetElement.value) == null ? void 0 : _b.focus();
    },
  });
  watch(
    targetElement,
    () => {
      focused.value = initialValue;
    },
    { immediate: true, flush: 'post' },
  );
  return { focused };
}
function useFocusWithin(target, options = {}) {
  const activeElement = useActiveElement(options);
  const targetElement = computed(() => unrefElement(target));
  const focused = computed(() =>
    targetElement.value && activeElement.value
      ? targetElement.value.contains(activeElement.value)
      : false,
  );
  return { focused };
}
function useFps(options) {
  var _a;
  const fps = ref(0);
  if (typeof performance === 'undefined') return fps;
  const every =
    (_a = options == null ? void 0 : options.every) != null ? _a : 10;
  let last = performance.now();
  let ticks = 0;
  useRafFn(() => {
    ticks += 1;
    if (ticks >= every) {
      const now2 = performance.now();
      const diff = now2 - last;
      fps.value = Math.round(1e3 / (diff / ticks));
      last = now2;
      ticks = 0;
    }
  });
  return fps;
}
var eventHandlers = [
  'fullscreenchange',
  'webkitfullscreenchange',
  'webkitendfullscreen',
  'mozfullscreenchange',
  'MSFullscreenChange',
];
function useFullscreen(target, options = {}) {
  const { document: document2 = defaultDocument, autoExit = false } = options;
  const targetRef = computed(() => {
    var _a;
    return (_a = unrefElement(target)) != null
      ? _a
      : document2 == null
        ? void 0
        : document2.querySelector('html');
  });
  const isFullscreen = ref(false);
  const requestMethod = computed(() => {
    return [
      'requestFullscreen',
      'webkitRequestFullscreen',
      'webkitEnterFullscreen',
      'webkitEnterFullScreen',
      'webkitRequestFullScreen',
      'mozRequestFullScreen',
      'msRequestFullscreen',
    ].find(
      (m) =>
        (document2 && m in document2) ||
        (targetRef.value && m in targetRef.value),
    );
  });
  const exitMethod = computed(() => {
    return [
      'exitFullscreen',
      'webkitExitFullscreen',
      'webkitExitFullScreen',
      'webkitCancelFullScreen',
      'mozCancelFullScreen',
      'msExitFullscreen',
    ].find(
      (m) =>
        (document2 && m in document2) ||
        (targetRef.value && m in targetRef.value),
    );
  });
  const fullscreenEnabled = computed(() => {
    return [
      'fullScreen',
      'webkitIsFullScreen',
      'webkitDisplayingFullscreen',
      'mozFullScreen',
      'msFullscreenElement',
    ].find(
      (m) =>
        (document2 && m in document2) ||
        (targetRef.value && m in targetRef.value),
    );
  });
  const fullscreenElementMethod = [
    'fullscreenElement',
    'webkitFullscreenElement',
    'mozFullScreenElement',
    'msFullscreenElement',
  ].find((m) => document2 && m in document2);
  const isSupported = useSupported(
    () =>
      targetRef.value &&
      document2 &&
      requestMethod.value !== void 0 &&
      exitMethod.value !== void 0 &&
      fullscreenEnabled.value !== void 0,
  );
  const isCurrentElementFullScreen = () => {
    if (fullscreenElementMethod)
      return (
        (document2 == null ? void 0 : document2[fullscreenElementMethod]) ===
        targetRef.value
      );
    return false;
  };
  const isElementFullScreen = () => {
    if (fullscreenEnabled.value) {
      if (document2 && document2[fullscreenEnabled.value] != null) {
        return document2[fullscreenEnabled.value];
      } else {
        const target2 = targetRef.value;
        if (
          (target2 == null ? void 0 : target2[fullscreenEnabled.value]) != null
        ) {
          return Boolean(target2[fullscreenEnabled.value]);
        }
      }
    }
    return false;
  };
  async function exit() {
    if (!isSupported.value || !isFullscreen.value) return;
    if (exitMethod.value) {
      if ((document2 == null ? void 0 : document2[exitMethod.value]) != null) {
        await document2[exitMethod.value]();
      } else {
        const target2 = targetRef.value;
        if ((target2 == null ? void 0 : target2[exitMethod.value]) != null)
          await target2[exitMethod.value]();
      }
    }
    isFullscreen.value = false;
  }
  async function enter() {
    if (!isSupported.value || isFullscreen.value) return;
    if (isElementFullScreen()) await exit();
    const target2 = targetRef.value;
    if (
      requestMethod.value &&
      (target2 == null ? void 0 : target2[requestMethod.value]) != null
    ) {
      await target2[requestMethod.value]();
      isFullscreen.value = true;
    }
  }
  async function toggle() {
    await (isFullscreen.value ? exit() : enter());
  }
  const handlerCallback = () => {
    const isElementFullScreenValue = isElementFullScreen();
    if (
      !isElementFullScreenValue ||
      (isElementFullScreenValue && isCurrentElementFullScreen())
    )
      isFullscreen.value = isElementFullScreenValue;
  };
  useEventListener(document2, eventHandlers, handlerCallback, false);
  useEventListener(
    () => unrefElement(targetRef),
    eventHandlers,
    handlerCallback,
    false,
  );
  if (autoExit) tryOnScopeDispose(exit);
  return {
    isSupported,
    isFullscreen,
    enter,
    exit,
    toggle,
  };
}
function mapGamepadToXbox360Controller(gamepad) {
  return computed(() => {
    if (gamepad.value) {
      return {
        buttons: {
          a: gamepad.value.buttons[0],
          b: gamepad.value.buttons[1],
          x: gamepad.value.buttons[2],
          y: gamepad.value.buttons[3],
        },
        bumper: {
          left: gamepad.value.buttons[4],
          right: gamepad.value.buttons[5],
        },
        triggers: {
          left: gamepad.value.buttons[6],
          right: gamepad.value.buttons[7],
        },
        stick: {
          left: {
            horizontal: gamepad.value.axes[0],
            vertical: gamepad.value.axes[1],
            button: gamepad.value.buttons[10],
          },
          right: {
            horizontal: gamepad.value.axes[2],
            vertical: gamepad.value.axes[3],
            button: gamepad.value.buttons[11],
          },
        },
        dpad: {
          up: gamepad.value.buttons[12],
          down: gamepad.value.buttons[13],
          left: gamepad.value.buttons[14],
          right: gamepad.value.buttons[15],
        },
        back: gamepad.value.buttons[8],
        start: gamepad.value.buttons[9],
      };
    }
    return null;
  });
}
function useGamepad(options = {}) {
  const { navigator = defaultNavigator } = options;
  const isSupported = useSupported(
    () => navigator && 'getGamepads' in navigator,
  );
  const gamepads = ref([]);
  const onConnectedHook = createEventHook();
  const onDisconnectedHook = createEventHook();
  const stateFromGamepad = (gamepad) => {
    const hapticActuators = [];
    const vibrationActuator =
      'vibrationActuator' in gamepad ? gamepad.vibrationActuator : null;
    if (vibrationActuator) hapticActuators.push(vibrationActuator);
    if (gamepad.hapticActuators)
      hapticActuators.push(...gamepad.hapticActuators);
    return {
      ...gamepad,
      id: gamepad.id,
      hapticActuators,
      axes: gamepad.axes.map((axes) => axes),
      buttons: gamepad.buttons.map((button) => ({
        pressed: button.pressed,
        touched: button.touched,
        value: button.value,
      })),
      index: gamepad.index,
    };
  };
  const updateGamepadState = () => {
    const _gamepads =
      (navigator == null ? void 0 : navigator.getGamepads()) || [];
    for (const gamepad of _gamepads) {
      if (gamepad && gamepads.value[gamepad.index])
        gamepads.value[gamepad.index] = stateFromGamepad(gamepad);
    }
  };
  const { isActive, pause, resume } = useRafFn(updateGamepadState);
  const onGamepadConnected = (gamepad) => {
    if (!gamepads.value.some(({ index }) => index === gamepad.index)) {
      gamepads.value.push(stateFromGamepad(gamepad));
      onConnectedHook.trigger(gamepad.index);
    }
    resume();
  };
  const onGamepadDisconnected = (gamepad) => {
    gamepads.value = gamepads.value.filter((x) => x.index !== gamepad.index);
    onDisconnectedHook.trigger(gamepad.index);
  };
  useEventListener('gamepadconnected', (e) => onGamepadConnected(e.gamepad));
  useEventListener('gamepaddisconnected', (e) =>
    onGamepadDisconnected(e.gamepad),
  );
  tryOnMounted(() => {
    const _gamepads =
      (navigator == null ? void 0 : navigator.getGamepads()) || [];
    for (const gamepad of _gamepads) {
      if (gamepad && gamepads.value[gamepad.index]) onGamepadConnected(gamepad);
    }
  });
  pause();
  return {
    isSupported,
    onConnected: onConnectedHook.on,
    onDisconnected: onDisconnectedHook.on,
    gamepads,
    pause,
    resume,
    isActive,
  };
}
function useGeolocation(options = {}) {
  const {
    enableHighAccuracy = true,
    maximumAge = 3e4,
    timeout = 27e3,
    navigator = defaultNavigator,
    immediate = true,
  } = options;
  const isSupported = useSupported(
    () => navigator && 'geolocation' in navigator,
  );
  const locatedAt = ref(null);
  const error = shallowRef(null);
  const coords = ref({
    accuracy: 0,
    latitude: Number.POSITIVE_INFINITY,
    longitude: Number.POSITIVE_INFINITY,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  });
  function updatePosition(position) {
    locatedAt.value = position.timestamp;
    coords.value = position.coords;
    error.value = null;
  }
  let watcher;
  function resume() {
    if (isSupported.value) {
      watcher = navigator.geolocation.watchPosition(
        updatePosition,
        (err) => (error.value = err),
        {
          enableHighAccuracy,
          maximumAge,
          timeout,
        },
      );
    }
  }
  if (immediate) resume();
  function pause() {
    if (watcher && navigator) navigator.geolocation.clearWatch(watcher);
  }
  tryOnScopeDispose(() => {
    pause();
  });
  return {
    isSupported,
    coords,
    locatedAt,
    error,
    resume,
    pause,
  };
}
var defaultEvents$1 = [
  'mousemove',
  'mousedown',
  'resize',
  'keydown',
  'touchstart',
  'wheel',
];
var oneMinute = 6e4;
function useIdle(timeout = oneMinute, options = {}) {
  const {
    initialState = false,
    listenForVisibilityChange = true,
    events: events2 = defaultEvents$1,
    window: window2 = defaultWindow,
    eventFilter = throttleFilter(50),
  } = options;
  const idle = ref(initialState);
  const lastActive = ref(timestamp());
  let timer;
  const reset = () => {
    idle.value = false;
    clearTimeout(timer);
    timer = setTimeout(() => (idle.value = true), timeout);
  };
  const onEvent = createFilterWrapper(eventFilter, () => {
    lastActive.value = timestamp();
    reset();
  });
  if (window2) {
    const document2 = window2.document;
    for (const event of events2)
      useEventListener(window2, event, onEvent, { passive: true });
    if (listenForVisibilityChange) {
      useEventListener(document2, 'visibilitychange', () => {
        if (!document2.hidden) onEvent();
      });
    }
    reset();
  }
  return {
    idle,
    lastActive,
    reset,
  };
}
async function loadImage(options) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const {
      src,
      srcset,
      sizes,
      class: clazz,
      loading,
      crossorigin,
      referrerPolicy,
    } = options;
    img.src = src;
    if (srcset) img.srcset = srcset;
    if (sizes) img.sizes = sizes;
    if (clazz) img.className = clazz;
    if (loading) img.loading = loading;
    if (crossorigin) img.crossOrigin = crossorigin;
    if (referrerPolicy) img.referrerPolicy = referrerPolicy;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}
function useImage(options, asyncStateOptions = {}) {
  const state = useAsyncState(() => loadImage(toValue(options)), void 0, {
    resetOnExecute: true,
    ...asyncStateOptions,
  });
  watch(
    () => toValue(options),
    () => state.execute(asyncStateOptions.delay),
    { deep: true },
  );
  return state;
}
var ARRIVED_STATE_THRESHOLD_PIXELS = 1;
function useScroll(element, options = {}) {
  const {
    throttle = 0,
    idle = 200,
    onStop = noop,
    onScroll = noop,
    offset = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    eventListenerOptions = {
      capture: false,
      passive: true,
    },
    behavior = 'auto',
    window: window2 = defaultWindow,
    onError = (e) => {
      console.error(e);
    },
  } = options;
  const internalX = ref(0);
  const internalY = ref(0);
  const x = computed({
    get() {
      return internalX.value;
    },
    set(x2) {
      scrollTo2(x2, void 0);
    },
  });
  const y = computed({
    get() {
      return internalY.value;
    },
    set(y2) {
      scrollTo2(void 0, y2);
    },
  });
  function scrollTo2(_x, _y) {
    var _a, _b, _c;
    if (!window2) return;
    const _element = toValue(element);
    if (!_element) return;
    (_c = _element instanceof Document ? window2.document.body : _element) ==
    null
      ? void 0
      : _c.scrollTo({
          top: (_a = toValue(_y)) != null ? _a : y.value,
          left: (_b = toValue(_x)) != null ? _b : x.value,
          behavior: toValue(behavior),
        });
  }
  const isScrolling = ref(false);
  const arrivedState = reactive({
    left: true,
    right: false,
    top: true,
    bottom: false,
  });
  const directions = reactive({
    left: false,
    right: false,
    top: false,
    bottom: false,
  });
  const onScrollEnd = (e) => {
    if (!isScrolling.value) return;
    isScrolling.value = false;
    directions.left = false;
    directions.right = false;
    directions.top = false;
    directions.bottom = false;
    onStop(e);
  };
  const onScrollEndDebounced = useDebounceFn(onScrollEnd, throttle + idle);
  const setArrivedState = (target) => {
    var _a;
    if (!window2) return;
    const el =
      ((_a = target == null ? void 0 : target.document) == null
        ? void 0
        : _a.documentElement) ||
      (target == null ? void 0 : target.documentElement) ||
      unrefElement(target);
    const { display, flexDirection } = getComputedStyle(el);
    const scrollLeft = el.scrollLeft;
    directions.left = scrollLeft < internalX.value;
    directions.right = scrollLeft > internalX.value;
    const left = Math.abs(scrollLeft) <= (offset.left || 0);
    const right =
      Math.abs(scrollLeft) + el.clientWidth >=
      el.scrollWidth - (offset.right || 0) - ARRIVED_STATE_THRESHOLD_PIXELS;
    if (display === 'flex' && flexDirection === 'row-reverse') {
      arrivedState.left = right;
      arrivedState.right = left;
    } else {
      arrivedState.left = left;
      arrivedState.right = right;
    }
    internalX.value = scrollLeft;
    let scrollTop = el.scrollTop;
    if (target === window2.document && !scrollTop)
      scrollTop = window2.document.body.scrollTop;
    directions.top = scrollTop < internalY.value;
    directions.bottom = scrollTop > internalY.value;
    const top = Math.abs(scrollTop) <= (offset.top || 0);
    const bottom =
      Math.abs(scrollTop) + el.clientHeight >=
      el.scrollHeight - (offset.bottom || 0) - ARRIVED_STATE_THRESHOLD_PIXELS;
    if (display === 'flex' && flexDirection === 'column-reverse') {
      arrivedState.top = bottom;
      arrivedState.bottom = top;
    } else {
      arrivedState.top = top;
      arrivedState.bottom = bottom;
    }
    internalY.value = scrollTop;
  };
  const onScrollHandler = (e) => {
    var _a;
    if (!window2) return;
    const eventTarget = (_a = e.target.documentElement) != null ? _a : e.target;
    setArrivedState(eventTarget);
    isScrolling.value = true;
    onScrollEndDebounced(e);
    onScroll(e);
  };
  useEventListener(
    element,
    'scroll',
    throttle
      ? useThrottleFn(onScrollHandler, throttle, true, false)
      : onScrollHandler,
    eventListenerOptions,
  );
  tryOnMounted(() => {
    try {
      const _element = toValue(element);
      if (!_element) return;
      setArrivedState(_element);
    } catch (e) {
      onError(e);
    }
  });
  useEventListener(element, 'scrollend', onScrollEnd, eventListenerOptions);
  return {
    x,
    y,
    isScrolling,
    arrivedState,
    directions,
    measure() {
      const _element = toValue(element);
      if (window2 && _element) setArrivedState(_element);
    },
  };
}
function resolveElement(el) {
  if (typeof Window !== 'undefined' && el instanceof Window)
    return el.document.documentElement;
  if (typeof Document !== 'undefined' && el instanceof Document)
    return el.documentElement;
  return el;
}
function useInfiniteScroll(element, onLoadMore, options = {}) {
  var _a;
  const {
    direction = 'bottom',
    interval = 100,
    canLoadMore = () => true,
  } = options;
  const state = reactive(
    useScroll(element, {
      ...options,
      offset: {
        [direction]: (_a = options.distance) != null ? _a : 0,
        ...options.offset,
      },
    }),
  );
  const promise = ref();
  const isLoading = computed(() => !!promise.value);
  const observedElement = computed(() => {
    return resolveElement(toValue(element));
  });
  const isElementVisible = useElementVisibility(observedElement);
  function checkAndLoad() {
    state.measure();
    if (
      !observedElement.value ||
      !isElementVisible.value ||
      !canLoadMore(observedElement.value)
    )
      return;
    const { scrollHeight, clientHeight, scrollWidth, clientWidth } =
      observedElement.value;
    const isNarrower =
      direction === 'bottom' || direction === 'top'
        ? scrollHeight <= clientHeight
        : scrollWidth <= clientWidth;
    if (state.arrivedState[direction] || isNarrower) {
      if (!promise.value) {
        promise.value = Promise.all([
          onLoadMore(state),
          new Promise((resolve) => setTimeout(resolve, interval)),
        ]).finally(() => {
          promise.value = null;
          nextTick(() => checkAndLoad());
        });
      }
    }
  }
  watch(
    () => [state.arrivedState[direction], isElementVisible.value],
    checkAndLoad,
    { immediate: true },
  );
  return {
    isLoading,
  };
}
var defaultEvents = ['mousedown', 'mouseup', 'keydown', 'keyup'];
function useKeyModifier(modifier, options = {}) {
  const {
    events: events2 = defaultEvents,
    document: document2 = defaultDocument,
    initial = null,
  } = options;
  const state = ref(initial);
  if (document2) {
    events2.forEach((listenerEvent) => {
      useEventListener(document2, listenerEvent, (evt) => {
        if (typeof evt.getModifierState === 'function')
          state.value = evt.getModifierState(modifier);
      });
    });
  }
  return state;
}
function useLocalStorage(key, initialValue, options = {}) {
  const { window: window2 = defaultWindow } = options;
  return useStorage(
    key,
    initialValue,
    window2 == null ? void 0 : window2.localStorage,
    options,
  );
}
var DefaultMagicKeysAliasMap = {
  ctrl: 'control',
  command: 'meta',
  cmd: 'meta',
  option: 'alt',
  up: 'arrowup',
  down: 'arrowdown',
  left: 'arrowleft',
  right: 'arrowright',
};
function useMagicKeys(options = {}) {
  const {
    reactive: useReactive = false,
    target = defaultWindow,
    aliasMap = DefaultMagicKeysAliasMap,
    passive = true,
    onEventFired = noop,
  } = options;
  const current = reactive(/* @__PURE__ */ new Set());
  const obj = {
    toJSON() {
      return {};
    },
    current,
  };
  const refs = useReactive ? reactive(obj) : obj;
  const metaDeps = /* @__PURE__ */ new Set();
  const usedKeys = /* @__PURE__ */ new Set();
  function setRefs(key, value) {
    if (key in refs) {
      if (useReactive) refs[key] = value;
      else refs[key].value = value;
    }
  }
  function reset() {
    current.clear();
    for (const key of usedKeys) setRefs(key, false);
  }
  function updateRefs(e, value) {
    var _a, _b;
    const key = (_a = e.key) == null ? void 0 : _a.toLowerCase();
    const code = (_b = e.code) == null ? void 0 : _b.toLowerCase();
    const values = [code, key].filter(Boolean);
    if (key) {
      if (value) current.add(key);
      else current.delete(key);
    }
    for (const key2 of values) {
      usedKeys.add(key2);
      setRefs(key2, value);
    }
    if (key === 'meta' && !value) {
      metaDeps.forEach((key2) => {
        current.delete(key2);
        setRefs(key2, false);
      });
      metaDeps.clear();
    } else if (
      typeof e.getModifierState === 'function' &&
      e.getModifierState('Meta') &&
      value
    ) {
      [...current, ...values].forEach((key2) => metaDeps.add(key2));
    }
  }
  useEventListener(
    target,
    'keydown',
    (e) => {
      updateRefs(e, true);
      return onEventFired(e);
    },
    { passive },
  );
  useEventListener(
    target,
    'keyup',
    (e) => {
      updateRefs(e, false);
      return onEventFired(e);
    },
    { passive },
  );
  useEventListener('blur', reset, { passive: true });
  useEventListener('focus', reset, { passive: true });
  const proxy = new Proxy(refs, {
    get(target2, prop, rec) {
      if (typeof prop !== 'string') return Reflect.get(target2, prop, rec);
      prop = prop.toLowerCase();
      if (prop in aliasMap) prop = aliasMap[prop];
      if (!(prop in refs)) {
        if (/[+_-]/.test(prop)) {
          const keys2 = prop.split(/[+_-]/g).map((i) => i.trim());
          refs[prop] = computed(() =>
            keys2.every((key) => toValue(proxy[key])),
          );
        } else {
          refs[prop] = ref(false);
        }
      }
      const r = Reflect.get(target2, prop, rec);
      return useReactive ? toValue(r) : r;
    },
  });
  return proxy;
}
function usingElRef(source, cb) {
  if (toValue(source)) cb(toValue(source));
}
function timeRangeToArray(timeRanges) {
  let ranges = [];
  for (let i = 0; i < timeRanges.length; ++i)
    ranges = [...ranges, [timeRanges.start(i), timeRanges.end(i)]];
  return ranges;
}
function tracksToArray(tracks) {
  return Array.from(tracks).map(
    (
      {
        label,
        kind,
        language,
        mode,
        activeCues,
        cues,
        inBandMetadataTrackDispatchType,
      },
      id,
    ) => ({
      id,
      label,
      kind,
      language,
      mode,
      activeCues,
      cues,
      inBandMetadataTrackDispatchType,
    }),
  );
}
var defaultOptions = {
  src: '',
  tracks: [],
};
function useMediaControls(target, options = {}) {
  options = {
    ...defaultOptions,
    ...options,
  };
  const { document: document2 = defaultDocument } = options;
  const currentTime = ref(0);
  const duration = ref(0);
  const seeking = ref(false);
  const volume = ref(1);
  const waiting = ref(false);
  const ended = ref(false);
  const playing = ref(false);
  const rate = ref(1);
  const stalled = ref(false);
  const buffered = ref([]);
  const tracks = ref([]);
  const selectedTrack = ref(-1);
  const isPictureInPicture = ref(false);
  const muted = ref(false);
  const supportsPictureInPicture =
    document2 && 'pictureInPictureEnabled' in document2;
  const sourceErrorEvent = createEventHook();
  const disableTrack = (track) => {
    usingElRef(target, (el) => {
      if (track) {
        const id = typeof track === 'number' ? track : track.id;
        el.textTracks[id].mode = 'disabled';
      } else {
        for (let i = 0; i < el.textTracks.length; ++i)
          el.textTracks[i].mode = 'disabled';
      }
      selectedTrack.value = -1;
    });
  };
  const enableTrack = (track, disableTracks = true) => {
    usingElRef(target, (el) => {
      const id = typeof track === 'number' ? track : track.id;
      if (disableTracks) disableTrack();
      el.textTracks[id].mode = 'showing';
      selectedTrack.value = id;
    });
  };
  const togglePictureInPicture = () => {
    return new Promise((resolve, reject) => {
      usingElRef(target, async (el) => {
        if (supportsPictureInPicture) {
          if (!isPictureInPicture.value) {
            el.requestPictureInPicture().then(resolve).catch(reject);
          } else {
            document2.exitPictureInPicture().then(resolve).catch(reject);
          }
        }
      });
    });
  };
  watchEffect(() => {
    if (!document2) return;
    const el = toValue(target);
    if (!el) return;
    const src = toValue(options.src);
    let sources = [];
    if (!src) return;
    if (typeof src === 'string') sources = [{ src }];
    else if (Array.isArray(src)) sources = src;
    else if (isObject(src)) sources = [src];
    el.querySelectorAll('source').forEach((e) => {
      e.removeEventListener('error', sourceErrorEvent.trigger);
      e.remove();
    });
    sources.forEach(({ src: src2, type }) => {
      const source = document2.createElement('source');
      source.setAttribute('src', src2);
      source.setAttribute('type', type || '');
      source.addEventListener('error', sourceErrorEvent.trigger);
      el.appendChild(source);
    });
    el.load();
  });
  tryOnScopeDispose(() => {
    const el = toValue(target);
    if (!el) return;
    el.querySelectorAll('source').forEach((e) =>
      e.removeEventListener('error', sourceErrorEvent.trigger),
    );
  });
  watch([target, volume], () => {
    const el = toValue(target);
    if (!el) return;
    el.volume = volume.value;
  });
  watch([target, muted], () => {
    const el = toValue(target);
    if (!el) return;
    el.muted = muted.value;
  });
  watch([target, rate], () => {
    const el = toValue(target);
    if (!el) return;
    el.playbackRate = rate.value;
  });
  watchEffect(() => {
    if (!document2) return;
    const textTracks = toValue(options.tracks);
    const el = toValue(target);
    if (!textTracks || !textTracks.length || !el) return;
    el.querySelectorAll('track').forEach((e) => e.remove());
    textTracks.forEach(
      ({ default: isDefault, kind, label, src, srcLang }, i) => {
        const track = document2.createElement('track');
        track.default = isDefault || false;
        track.kind = kind;
        track.label = label;
        track.src = src;
        track.srclang = srcLang;
        if (track.default) selectedTrack.value = i;
        el.appendChild(track);
      },
    );
  });
  const { ignoreUpdates: ignoreCurrentTimeUpdates } = watchIgnorable(
    currentTime,
    (time) => {
      const el = toValue(target);
      if (!el) return;
      el.currentTime = time;
    },
  );
  const { ignoreUpdates: ignorePlayingUpdates } = watchIgnorable(
    playing,
    (isPlaying) => {
      const el = toValue(target);
      if (!el) return;
      isPlaying ? el.play() : el.pause();
    },
  );
  useEventListener(target, 'timeupdate', () =>
    ignoreCurrentTimeUpdates(
      () => (currentTime.value = toValue(target).currentTime),
    ),
  );
  useEventListener(
    target,
    'durationchange',
    () => (duration.value = toValue(target).duration),
  );
  useEventListener(
    target,
    'progress',
    () => (buffered.value = timeRangeToArray(toValue(target).buffered)),
  );
  useEventListener(target, 'seeking', () => (seeking.value = true));
  useEventListener(target, 'seeked', () => (seeking.value = false));
  useEventListener(target, ['waiting', 'loadstart'], () => {
    waiting.value = true;
    ignorePlayingUpdates(() => (playing.value = false));
  });
  useEventListener(target, 'loadeddata', () => (waiting.value = false));
  useEventListener(target, 'playing', () => {
    waiting.value = false;
    ended.value = false;
    ignorePlayingUpdates(() => (playing.value = true));
  });
  useEventListener(
    target,
    'ratechange',
    () => (rate.value = toValue(target).playbackRate),
  );
  useEventListener(target, 'stalled', () => (stalled.value = true));
  useEventListener(target, 'ended', () => (ended.value = true));
  useEventListener(target, 'pause', () =>
    ignorePlayingUpdates(() => (playing.value = false)),
  );
  useEventListener(target, 'play', () =>
    ignorePlayingUpdates(() => (playing.value = true)),
  );
  useEventListener(
    target,
    'enterpictureinpicture',
    () => (isPictureInPicture.value = true),
  );
  useEventListener(
    target,
    'leavepictureinpicture',
    () => (isPictureInPicture.value = false),
  );
  useEventListener(target, 'volumechange', () => {
    const el = toValue(target);
    if (!el) return;
    volume.value = el.volume;
    muted.value = el.muted;
  });
  const listeners = [];
  const stop = watch([target], () => {
    const el = toValue(target);
    if (!el) return;
    stop();
    listeners[0] = useEventListener(
      el.textTracks,
      'addtrack',
      () => (tracks.value = tracksToArray(el.textTracks)),
    );
    listeners[1] = useEventListener(
      el.textTracks,
      'removetrack',
      () => (tracks.value = tracksToArray(el.textTracks)),
    );
    listeners[2] = useEventListener(
      el.textTracks,
      'change',
      () => (tracks.value = tracksToArray(el.textTracks)),
    );
  });
  tryOnScopeDispose(() => listeners.forEach((listener) => listener()));
  return {
    currentTime,
    duration,
    waiting,
    seeking,
    ended,
    stalled,
    buffered,
    playing,
    rate,
    // Volume
    volume,
    muted,
    // Tracks
    tracks,
    selectedTrack,
    enableTrack,
    disableTrack,
    // Picture in Picture
    supportsPictureInPicture,
    togglePictureInPicture,
    isPictureInPicture,
    // Events
    onSourceError: sourceErrorEvent.on,
  };
}
function getMapVue2Compat() {
  const data = shallowReactive({});
  return {
    get: (key) => data[key],
    set: (key, value) => set(data, key, value),
    has: (key) => hasOwn(data, key),
    delete: (key) => del(data, key),
    clear: () => {
      Object.keys(data).forEach((key) => {
        del(data, key);
      });
    },
  };
}
function useMemoize(resolver, options) {
  const initCache = () => {
    if (options == null ? void 0 : options.cache)
      return shallowReactive(options.cache);
    if (isVue2) return getMapVue2Compat();
    return shallowReactive(/* @__PURE__ */ new Map());
  };
  const cache = initCache();
  const generateKey = (...args) =>
    (options == null ? void 0 : options.getKey)
      ? options.getKey(...args)
      : JSON.stringify(args);
  const _loadData = (key, ...args) => {
    cache.set(key, resolver(...args));
    return cache.get(key);
  };
  const loadData = (...args) => _loadData(generateKey(...args), ...args);
  const deleteData = (...args) => {
    cache.delete(generateKey(...args));
  };
  const clearData = () => {
    cache.clear();
  };
  const memoized = (...args) => {
    const key = generateKey(...args);
    if (cache.has(key)) return cache.get(key);
    return _loadData(key, ...args);
  };
  memoized.load = loadData;
  memoized.delete = deleteData;
  memoized.clear = clearData;
  memoized.generateKey = generateKey;
  memoized.cache = cache;
  return memoized;
}
function useMemory(options = {}) {
  const memory = ref();
  const isSupported = useSupported(
    () => typeof performance !== 'undefined' && 'memory' in performance,
  );
  if (isSupported.value) {
    const { interval = 1e3 } = options;
    useIntervalFn(
      () => {
        memory.value = performance.memory;
      },
      interval,
      {
        immediate: options.immediate,
        immediateCallback: options.immediateCallback,
      },
    );
  }
  return { isSupported, memory };
}
var UseMouseBuiltinExtractors = {
  page: (event) => [event.pageX, event.pageY],
  client: (event) => [event.clientX, event.clientY],
  screen: (event) => [event.screenX, event.screenY],
  movement: (event) =>
    event instanceof Touch ? null : [event.movementX, event.movementY],
};
function useMouse(options = {}) {
  const {
    type = 'page',
    touch = true,
    resetOnTouchEnds = false,
    initialValue = { x: 0, y: 0 },
    window: window2 = defaultWindow,
    target = window2,
    scroll = true,
    eventFilter,
  } = options;
  let _prevMouseEvent = null;
  const x = ref(initialValue.x);
  const y = ref(initialValue.y);
  const sourceType = ref(null);
  const extractor =
    typeof type === 'function' ? type : UseMouseBuiltinExtractors[type];
  const mouseHandler = (event) => {
    const result = extractor(event);
    _prevMouseEvent = event;
    if (result) {
      [x.value, y.value] = result;
      sourceType.value = 'mouse';
    }
  };
  const touchHandler = (event) => {
    if (event.touches.length > 0) {
      const result = extractor(event.touches[0]);
      if (result) {
        [x.value, y.value] = result;
        sourceType.value = 'touch';
      }
    }
  };
  const scrollHandler = () => {
    if (!_prevMouseEvent || !window2) return;
    const pos = extractor(_prevMouseEvent);
    if (_prevMouseEvent instanceof MouseEvent && pos) {
      x.value = pos[0] + window2.scrollX;
      y.value = pos[1] + window2.scrollY;
    }
  };
  const reset = () => {
    x.value = initialValue.x;
    y.value = initialValue.y;
  };
  const mouseHandlerWrapper = eventFilter
    ? (event) => eventFilter(() => mouseHandler(event), {})
    : (event) => mouseHandler(event);
  const touchHandlerWrapper = eventFilter
    ? (event) => eventFilter(() => touchHandler(event), {})
    : (event) => touchHandler(event);
  const scrollHandlerWrapper = eventFilter
    ? () => eventFilter(() => scrollHandler(), {})
    : () => scrollHandler();
  if (target) {
    const listenerOptions = { passive: true };
    useEventListener(
      target,
      ['mousemove', 'dragover'],
      mouseHandlerWrapper,
      listenerOptions,
    );
    if (touch && type !== 'movement') {
      useEventListener(
        target,
        ['touchstart', 'touchmove'],
        touchHandlerWrapper,
        listenerOptions,
      );
      if (resetOnTouchEnds)
        useEventListener(target, 'touchend', reset, listenerOptions);
    }
    if (scroll && type === 'page')
      useEventListener(window2, 'scroll', scrollHandlerWrapper, {
        passive: true,
      });
  }
  return {
    x,
    y,
    sourceType,
  };
}
function useMouseInElement(target, options = {}) {
  const { handleOutside = true, window: window2 = defaultWindow } = options;
  const type = options.type || 'page';
  const { x, y, sourceType } = useMouse(options);
  const targetRef = ref(
    target != null ? target : window2 == null ? void 0 : window2.document.body,
  );
  const elementX = ref(0);
  const elementY = ref(0);
  const elementPositionX = ref(0);
  const elementPositionY = ref(0);
  const elementHeight = ref(0);
  const elementWidth = ref(0);
  const isOutside = ref(true);
  let stop = () => {};
  if (window2) {
    stop = watch(
      [targetRef, x, y],
      () => {
        const el = unrefElement(targetRef);
        if (!el) return;
        const { left, top, width, height } = el.getBoundingClientRect();
        elementPositionX.value =
          left + (type === 'page' ? window2.pageXOffset : 0);
        elementPositionY.value =
          top + (type === 'page' ? window2.pageYOffset : 0);
        elementHeight.value = height;
        elementWidth.value = width;
        const elX = x.value - elementPositionX.value;
        const elY = y.value - elementPositionY.value;
        isOutside.value =
          width === 0 ||
          height === 0 ||
          elX < 0 ||
          elY < 0 ||
          elX > width ||
          elY > height;
        if (handleOutside || !isOutside.value) {
          elementX.value = elX;
          elementY.value = elY;
        }
      },
      { immediate: true },
    );
    useEventListener(document, 'mouseleave', () => {
      isOutside.value = true;
    });
  }
  return {
    x,
    y,
    sourceType,
    elementX,
    elementY,
    elementPositionX,
    elementPositionY,
    elementHeight,
    elementWidth,
    isOutside,
    stop,
  };
}
function useMousePressed(options = {}) {
  const {
    touch = true,
    drag = true,
    capture = false,
    initialValue = false,
    window: window2 = defaultWindow,
  } = options;
  const pressed = ref(initialValue);
  const sourceType = ref(null);
  if (!window2) {
    return {
      pressed,
      sourceType,
    };
  }
  const onPressed = (srcType) => () => {
    pressed.value = true;
    sourceType.value = srcType;
  };
  const onReleased = () => {
    pressed.value = false;
    sourceType.value = null;
  };
  const target = computed(() => unrefElement(options.target) || window2);
  useEventListener(target, 'mousedown', onPressed('mouse'), {
    passive: true,
    capture,
  });
  useEventListener(window2, 'mouseleave', onReleased, {
    passive: true,
    capture,
  });
  useEventListener(window2, 'mouseup', onReleased, { passive: true, capture });
  if (drag) {
    useEventListener(target, 'dragstart', onPressed('mouse'), {
      passive: true,
      capture,
    });
    useEventListener(window2, 'drop', onReleased, { passive: true, capture });
    useEventListener(window2, 'dragend', onReleased, {
      passive: true,
      capture,
    });
  }
  if (touch) {
    useEventListener(target, 'touchstart', onPressed('touch'), {
      passive: true,
      capture,
    });
    useEventListener(window2, 'touchend', onReleased, {
      passive: true,
      capture,
    });
    useEventListener(window2, 'touchcancel', onReleased, {
      passive: true,
      capture,
    });
  }
  return {
    pressed,
    sourceType,
  };
}
function useNavigatorLanguage(options = {}) {
  const { window: window2 = defaultWindow } = options;
  const navigator = window2 == null ? void 0 : window2.navigator;
  const isSupported = useSupported(() => navigator && 'language' in navigator);
  const language = ref(navigator == null ? void 0 : navigator.language);
  useEventListener(window2, 'languagechange', () => {
    if (navigator) language.value = navigator.language;
  });
  return {
    isSupported,
    language,
  };
}
function useNetwork(options = {}) {
  const { window: window2 = defaultWindow } = options;
  const navigator = window2 == null ? void 0 : window2.navigator;
  const isSupported = useSupported(
    () => navigator && 'connection' in navigator,
  );
  const isOnline = ref(true);
  const saveData = ref(false);
  const offlineAt = ref(void 0);
  const onlineAt = ref(void 0);
  const downlink = ref(void 0);
  const downlinkMax = ref(void 0);
  const rtt = ref(void 0);
  const effectiveType = ref(void 0);
  const type = ref('unknown');
  const connection = isSupported.value && navigator.connection;
  function updateNetworkInformation() {
    if (!navigator) return;
    isOnline.value = navigator.onLine;
    offlineAt.value = isOnline.value ? void 0 : Date.now();
    onlineAt.value = isOnline.value ? Date.now() : void 0;
    if (connection) {
      downlink.value = connection.downlink;
      downlinkMax.value = connection.downlinkMax;
      effectiveType.value = connection.effectiveType;
      rtt.value = connection.rtt;
      saveData.value = connection.saveData;
      type.value = connection.type;
    }
  }
  if (window2) {
    useEventListener(window2, 'offline', () => {
      isOnline.value = false;
      offlineAt.value = Date.now();
    });
    useEventListener(window2, 'online', () => {
      isOnline.value = true;
      onlineAt.value = Date.now();
    });
  }
  if (connection)
    useEventListener(connection, 'change', updateNetworkInformation, false);
  updateNetworkInformation();
  return {
    isSupported,
    isOnline,
    saveData,
    offlineAt,
    onlineAt,
    downlink,
    downlinkMax,
    effectiveType,
    rtt,
    type,
  };
}
function useNow(options = {}) {
  const {
    controls: exposeControls = false,
    interval = 'requestAnimationFrame',
  } = options;
  const now2 = ref(/* @__PURE__ */ new Date());
  const update = () => (now2.value = /* @__PURE__ */ new Date());
  const controls =
    interval === 'requestAnimationFrame'
      ? useRafFn(update, { immediate: true })
      : useIntervalFn(update, interval, { immediate: true });
  if (exposeControls) {
    return {
      now: now2,
      ...controls,
    };
  } else {
    return now2;
  }
}
function useObjectUrl(object) {
  const url = ref();
  const release = () => {
    if (url.value) URL.revokeObjectURL(url.value);
    url.value = void 0;
  };
  watch(
    () => toValue(object),
    (newObject) => {
      release();
      if (newObject) url.value = URL.createObjectURL(newObject);
    },
    { immediate: true },
  );
  tryOnScopeDispose(release);
  return readonly(url);
}
function useClamp(value, min, max) {
  if (typeof value === 'function' || isReadonly(value))
    return computed(() => clamp(toValue(value), toValue(min), toValue(max)));
  const _value = ref(value);
  return computed({
    get() {
      return (_value.value = clamp(_value.value, toValue(min), toValue(max)));
    },
    set(value2) {
      _value.value = clamp(value2, toValue(min), toValue(max));
    },
  });
}
function useOffsetPagination(options) {
  const {
    total = Number.POSITIVE_INFINITY,
    pageSize = 10,
    page = 1,
    onPageChange = noop,
    onPageSizeChange = noop,
    onPageCountChange = noop,
  } = options;
  const currentPageSize = useClamp(pageSize, 1, Number.POSITIVE_INFINITY);
  const pageCount = computed(() =>
    Math.max(1, Math.ceil(toValue(total) / toValue(currentPageSize))),
  );
  const currentPage = useClamp(page, 1, pageCount);
  const isFirstPage = computed(() => currentPage.value === 1);
  const isLastPage = computed(() => currentPage.value === pageCount.value);
  if (isRef(page)) {
    syncRef(page, currentPage, {
      direction: isReadonly(page) ? 'ltr' : 'both',
    });
  }
  if (isRef(pageSize)) {
    syncRef(pageSize, currentPageSize, {
      direction: isReadonly(pageSize) ? 'ltr' : 'both',
    });
  }
  function prev() {
    currentPage.value--;
  }
  function next() {
    currentPage.value++;
  }
  const returnValue = {
    currentPage,
    currentPageSize,
    pageCount,
    isFirstPage,
    isLastPage,
    prev,
    next,
  };
  watch(currentPage, () => {
    onPageChange(reactive(returnValue));
  });
  watch(currentPageSize, () => {
    onPageSizeChange(reactive(returnValue));
  });
  watch(pageCount, () => {
    onPageCountChange(reactive(returnValue));
  });
  return returnValue;
}
function useOnline(options = {}) {
  const { isOnline } = useNetwork(options);
  return isOnline;
}
function usePageLeave(options = {}) {
  const { window: window2 = defaultWindow } = options;
  const isLeft = ref(false);
  const handler = (event) => {
    if (!window2) return;
    event = event || window2.event;
    const from = event.relatedTarget || event.toElement;
    isLeft.value = !from;
  };
  if (window2) {
    useEventListener(window2, 'mouseout', handler, { passive: true });
    useEventListener(window2.document, 'mouseleave', handler, {
      passive: true,
    });
    useEventListener(window2.document, 'mouseenter', handler, {
      passive: true,
    });
  }
  return isLeft;
}
function useScreenOrientation(options = {}) {
  const { window: window2 = defaultWindow } = options;
  const isSupported = useSupported(
    () => window2 && 'screen' in window2 && 'orientation' in window2.screen,
  );
  const screenOrientation = isSupported.value ? window2.screen.orientation : {};
  const orientation = ref(screenOrientation.type);
  const angle = ref(screenOrientation.angle || 0);
  if (isSupported.value) {
    useEventListener(window2, 'orientationchange', () => {
      orientation.value = screenOrientation.type;
      angle.value = screenOrientation.angle;
    });
  }
  const lockOrientation = (type) => {
    if (isSupported.value && typeof screenOrientation.lock === 'function')
      return screenOrientation.lock(type);
    return Promise.reject(new Error('Not supported'));
  };
  const unlockOrientation = () => {
    if (isSupported.value && typeof screenOrientation.unlock === 'function')
      screenOrientation.unlock();
  };
  return {
    isSupported,
    orientation,
    angle,
    lockOrientation,
    unlockOrientation,
  };
}
function useParallax(target, options = {}) {
  const {
    deviceOrientationTiltAdjust = (i) => i,
    deviceOrientationRollAdjust = (i) => i,
    mouseTiltAdjust = (i) => i,
    mouseRollAdjust = (i) => i,
    window: window2 = defaultWindow,
  } = options;
  const orientation = reactive(useDeviceOrientation({ window: window2 }));
  const screenOrientation = reactive(useScreenOrientation({ window: window2 }));
  const {
    elementX: x,
    elementY: y,
    elementWidth: width,
    elementHeight: height,
  } = useMouseInElement(target, { handleOutside: false, window: window2 });
  const source = computed(() => {
    if (
      orientation.isSupported &&
      ((orientation.alpha != null && orientation.alpha !== 0) ||
        (orientation.gamma != null && orientation.gamma !== 0))
    )
      return 'deviceOrientation';
    return 'mouse';
  });
  const roll = computed(() => {
    if (source.value === 'deviceOrientation') {
      let value;
      switch (screenOrientation.orientation) {
        case 'landscape-primary':
          value = orientation.gamma / 90;
          break;
        case 'landscape-secondary':
          value = -orientation.gamma / 90;
          break;
        case 'portrait-primary':
          value = -orientation.beta / 90;
          break;
        case 'portrait-secondary':
          value = orientation.beta / 90;
          break;
        default:
          value = -orientation.beta / 90;
      }
      return deviceOrientationRollAdjust(value);
    } else {
      const value = -(y.value - height.value / 2) / height.value;
      return mouseRollAdjust(value);
    }
  });
  const tilt = computed(() => {
    if (source.value === 'deviceOrientation') {
      let value;
      switch (screenOrientation.orientation) {
        case 'landscape-primary':
          value = orientation.beta / 90;
          break;
        case 'landscape-secondary':
          value = -orientation.beta / 90;
          break;
        case 'portrait-primary':
          value = orientation.gamma / 90;
          break;
        case 'portrait-secondary':
          value = -orientation.gamma / 90;
          break;
        default:
          value = orientation.gamma / 90;
      }
      return deviceOrientationTiltAdjust(value);
    } else {
      const value = (x.value - width.value / 2) / width.value;
      return mouseTiltAdjust(value);
    }
  });
  return { roll, tilt, source };
}
function useParentElement(element = useCurrentElement()) {
  const parentElement = shallowRef();
  const update = () => {
    const el = unrefElement(element);
    if (el) parentElement.value = el.parentElement;
  };
  tryOnMounted(update);
  watch(() => toValue(element), update);
  return parentElement;
}
function usePerformanceObserver(options, callback) {
  const {
    window: window2 = defaultWindow,
    immediate = true,
    ...performanceOptions
  } = options;
  const isSupported = useSupported(
    () => window2 && 'PerformanceObserver' in window2,
  );
  let observer;
  const stop = () => {
    observer == null ? void 0 : observer.disconnect();
  };
  const start = () => {
    if (isSupported.value) {
      stop();
      observer = new PerformanceObserver(callback);
      observer.observe(performanceOptions);
    }
  };
  tryOnScopeDispose(stop);
  if (immediate) start();
  return {
    isSupported,
    start,
    stop,
  };
}
var defaultState = {
  x: 0,
  y: 0,
  pointerId: 0,
  pressure: 0,
  tiltX: 0,
  tiltY: 0,
  width: 0,
  height: 0,
  twist: 0,
  pointerType: null,
};
var keys = Object.keys(defaultState);
function usePointer(options = {}) {
  const { target = defaultWindow } = options;
  const isInside = ref(false);
  const state = ref(options.initialValue || {});
  Object.assign(state.value, defaultState, state.value);
  const handler = (event) => {
    isInside.value = true;
    if (
      options.pointerTypes &&
      !options.pointerTypes.includes(event.pointerType)
    )
      return;
    state.value = objectPick(event, keys, false);
  };
  if (target) {
    const listenerOptions = { passive: true };
    useEventListener(
      target,
      ['pointerdown', 'pointermove', 'pointerup'],
      handler,
      listenerOptions,
    );
    useEventListener(
      target,
      'pointerleave',
      () => (isInside.value = false),
      listenerOptions,
    );
  }
  return {
    ...toRefs2(state),
    isInside,
  };
}
function usePointerLock(target, options = {}) {
  const { document: document2 = defaultDocument } = options;
  const isSupported = useSupported(
    () => document2 && 'pointerLockElement' in document2,
  );
  const element = ref();
  const triggerElement = ref();
  let targetElement;
  if (isSupported.value) {
    useEventListener(document2, 'pointerlockchange', () => {
      var _a;
      const currentElement =
        (_a = document2.pointerLockElement) != null ? _a : element.value;
      if (targetElement && currentElement === targetElement) {
        element.value = document2.pointerLockElement;
        if (!element.value) targetElement = triggerElement.value = null;
      }
    });
    useEventListener(document2, 'pointerlockerror', () => {
      var _a;
      const currentElement =
        (_a = document2.pointerLockElement) != null ? _a : element.value;
      if (targetElement && currentElement === targetElement) {
        const action = document2.pointerLockElement ? 'release' : 'acquire';
        throw new Error(`Failed to ${action} pointer lock.`);
      }
    });
  }
  async function lock(e) {
    var _a;
    if (!isSupported.value)
      throw new Error('Pointer Lock API is not supported by your browser.');
    triggerElement.value = e instanceof Event ? e.currentTarget : null;
    targetElement =
      e instanceof Event
        ? (_a = unrefElement(target)) != null
          ? _a
          : triggerElement.value
        : unrefElement(e);
    if (!targetElement) throw new Error('Target element undefined.');
    targetElement.requestPointerLock();
    return await until(element).toBe(targetElement);
  }
  async function unlock() {
    if (!element.value) return false;
    document2.exitPointerLock();
    await until(element).toBeNull();
    return true;
  }
  return {
    isSupported,
    element,
    triggerElement,
    lock,
    unlock,
  };
}
function usePointerSwipe(target, options = {}) {
  const targetRef = toRef2(target);
  const {
    threshold = 50,
    onSwipe,
    onSwipeEnd,
    onSwipeStart,
    disableTextSelect = false,
  } = options;
  const posStart = reactive({ x: 0, y: 0 });
  const updatePosStart = (x, y) => {
    posStart.x = x;
    posStart.y = y;
  };
  const posEnd = reactive({ x: 0, y: 0 });
  const updatePosEnd = (x, y) => {
    posEnd.x = x;
    posEnd.y = y;
  };
  const distanceX = computed(() => posStart.x - posEnd.x);
  const distanceY = computed(() => posStart.y - posEnd.y);
  const { max, abs } = Math;
  const isThresholdExceeded = computed(
    () => max(abs(distanceX.value), abs(distanceY.value)) >= threshold,
  );
  const isSwiping = ref(false);
  const isPointerDown = ref(false);
  const direction = computed(() => {
    if (!isThresholdExceeded.value) return 'none';
    if (abs(distanceX.value) > abs(distanceY.value)) {
      return distanceX.value > 0 ? 'left' : 'right';
    } else {
      return distanceY.value > 0 ? 'up' : 'down';
    }
  });
  const eventIsAllowed = (e) => {
    var _a, _b, _c;
    const isReleasingButton = e.buttons === 0;
    const isPrimaryButton = e.buttons === 1;
    return (_c =
      (_b =
        (_a = options.pointerTypes) == null
          ? void 0
          : _a.includes(e.pointerType)) != null
        ? _b
        : isReleasingButton || isPrimaryButton) != null
      ? _c
      : true;
  };
  const stops = [
    useEventListener(target, 'pointerdown', (e) => {
      if (!eventIsAllowed(e)) return;
      isPointerDown.value = true;
      const eventTarget = e.target;
      eventTarget == null ? void 0 : eventTarget.setPointerCapture(e.pointerId);
      const { clientX: x, clientY: y } = e;
      updatePosStart(x, y);
      updatePosEnd(x, y);
      onSwipeStart == null ? void 0 : onSwipeStart(e);
    }),
    useEventListener(target, 'pointermove', (e) => {
      if (!eventIsAllowed(e)) return;
      if (!isPointerDown.value) return;
      const { clientX: x, clientY: y } = e;
      updatePosEnd(x, y);
      if (!isSwiping.value && isThresholdExceeded.value) isSwiping.value = true;
      if (isSwiping.value) onSwipe == null ? void 0 : onSwipe(e);
    }),
    useEventListener(target, 'pointerup', (e) => {
      if (!eventIsAllowed(e)) return;
      if (isSwiping.value)
        onSwipeEnd == null ? void 0 : onSwipeEnd(e, direction.value);
      isPointerDown.value = false;
      isSwiping.value = false;
    }),
  ];
  tryOnMounted(() => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    (_b = (_a = targetRef.value) == null ? void 0 : _a.style) == null
      ? void 0
      : _b.setProperty('touch-action', 'none');
    if (disableTextSelect) {
      (_d = (_c = targetRef.value) == null ? void 0 : _c.style) == null
        ? void 0
        : _d.setProperty('-webkit-user-select', 'none');
      (_f = (_e = targetRef.value) == null ? void 0 : _e.style) == null
        ? void 0
        : _f.setProperty('-ms-user-select', 'none');
      (_h = (_g = targetRef.value) == null ? void 0 : _g.style) == null
        ? void 0
        : _h.setProperty('user-select', 'none');
    }
  });
  const stop = () => stops.forEach((s) => s());
  return {
    isSwiping: readonly(isSwiping),
    direction: readonly(direction),
    posStart: readonly(posStart),
    posEnd: readonly(posEnd),
    distanceX,
    distanceY,
    stop,
  };
}
function usePreferredColorScheme(options) {
  const isLight = useMediaQuery('(prefers-color-scheme: light)', options);
  const isDark = useMediaQuery('(prefers-color-scheme: dark)', options);
  return computed(() => {
    if (isDark.value) return 'dark';
    if (isLight.value) return 'light';
    return 'no-preference';
  });
}
function usePreferredContrast(options) {
  const isMore = useMediaQuery('(prefers-contrast: more)', options);
  const isLess = useMediaQuery('(prefers-contrast: less)', options);
  const isCustom = useMediaQuery('(prefers-contrast: custom)', options);
  return computed(() => {
    if (isMore.value) return 'more';
    if (isLess.value) return 'less';
    if (isCustom.value) return 'custom';
    return 'no-preference';
  });
}
function usePreferredLanguages(options = {}) {
  const { window: window2 = defaultWindow } = options;
  if (!window2) return ref(['en']);
  const navigator = window2.navigator;
  const value = ref(navigator.languages);
  useEventListener(window2, 'languagechange', () => {
    value.value = navigator.languages;
  });
  return value;
}
function usePreferredReducedMotion(options) {
  const isReduced = useMediaQuery('(prefers-reduced-motion: reduce)', options);
  return computed(() => {
    if (isReduced.value) return 'reduce';
    return 'no-preference';
  });
}
function usePrevious(value, initialValue) {
  const previous = shallowRef(initialValue);
  watch(
    toRef2(value),
    (_, oldValue) => {
      previous.value = oldValue;
    },
    { flush: 'sync' },
  );
  return readonly(previous);
}
var topVarName = '--vueuse-safe-area-top';
var rightVarName = '--vueuse-safe-area-right';
var bottomVarName = '--vueuse-safe-area-bottom';
var leftVarName = '--vueuse-safe-area-left';
function useScreenSafeArea() {
  const top = ref('');
  const right = ref('');
  const bottom = ref('');
  const left = ref('');
  if (isClient) {
    const topCssVar = useCssVar(topVarName);
    const rightCssVar = useCssVar(rightVarName);
    const bottomCssVar = useCssVar(bottomVarName);
    const leftCssVar = useCssVar(leftVarName);
    topCssVar.value = 'env(safe-area-inset-top, 0px)';
    rightCssVar.value = 'env(safe-area-inset-right, 0px)';
    bottomCssVar.value = 'env(safe-area-inset-bottom, 0px)';
    leftCssVar.value = 'env(safe-area-inset-left, 0px)';
    update();
    useEventListener('resize', useDebounceFn(update));
  }
  function update() {
    top.value = getValue(topVarName);
    right.value = getValue(rightVarName);
    bottom.value = getValue(bottomVarName);
    left.value = getValue(leftVarName);
  }
  return {
    top,
    right,
    bottom,
    left,
    update,
  };
}
function getValue(position) {
  return getComputedStyle(document.documentElement).getPropertyValue(position);
}
function useScriptTag(src, onLoaded = noop, options = {}) {
  const {
    immediate = true,
    manual = false,
    type = 'text/javascript',
    async = true,
    crossOrigin,
    referrerPolicy,
    noModule,
    defer,
    document: document2 = defaultDocument,
    attrs = {},
  } = options;
  const scriptTag = ref(null);
  let _promise = null;
  const loadScript = (waitForScriptLoad) =>
    new Promise((resolve, reject) => {
      const resolveWithElement = (el2) => {
        scriptTag.value = el2;
        resolve(el2);
        return el2;
      };
      if (!document2) {
        resolve(false);
        return;
      }
      let shouldAppend = false;
      let el = document2.querySelector(`script[src="${toValue(src)}"]`);
      if (!el) {
        el = document2.createElement('script');
        el.type = type;
        el.async = async;
        el.src = toValue(src);
        if (defer) el.defer = defer;
        if (crossOrigin) el.crossOrigin = crossOrigin;
        if (noModule) el.noModule = noModule;
        if (referrerPolicy) el.referrerPolicy = referrerPolicy;
        Object.entries(attrs).forEach(([name, value]) =>
          el == null ? void 0 : el.setAttribute(name, value),
        );
        shouldAppend = true;
      } else if (el.hasAttribute('data-loaded')) {
        resolveWithElement(el);
      }
      el.addEventListener('error', (event) => reject(event));
      el.addEventListener('abort', (event) => reject(event));
      el.addEventListener('load', () => {
        el.setAttribute('data-loaded', 'true');
        onLoaded(el);
        resolveWithElement(el);
      });
      if (shouldAppend) el = document2.head.appendChild(el);
      if (!waitForScriptLoad) resolveWithElement(el);
    });
  const load = (waitForScriptLoad = true) => {
    if (!_promise) _promise = loadScript(waitForScriptLoad);
    return _promise;
  };
  const unload = () => {
    if (!document2) return;
    _promise = null;
    if (scriptTag.value) scriptTag.value = null;
    const el = document2.querySelector(`script[src="${toValue(src)}"]`);
    if (el) document2.head.removeChild(el);
  };
  if (immediate && !manual) tryOnMounted(load);
  if (!manual) tryOnUnmounted(unload);
  return { scriptTag, load, unload };
}
function checkOverflowScroll(ele) {
  const style = window.getComputedStyle(ele);
  if (
    style.overflowX === 'scroll' ||
    style.overflowY === 'scroll' ||
    (style.overflowX === 'auto' && ele.clientWidth < ele.scrollWidth) ||
    (style.overflowY === 'auto' && ele.clientHeight < ele.scrollHeight)
  ) {
    return true;
  } else {
    const parent = ele.parentNode;
    if (!parent || parent.tagName === 'BODY') return false;
    return checkOverflowScroll(parent);
  }
}
function preventDefault(rawEvent) {
  const e = rawEvent || window.event;
  const _target = e.target;
  if (checkOverflowScroll(_target)) return false;
  if (e.touches.length > 1) return true;
  if (e.preventDefault) e.preventDefault();
  return false;
}
var elInitialOverflow = /* @__PURE__ */ new WeakMap();
function useScrollLock(element, initialState = false) {
  const isLocked = ref(initialState);
  let stopTouchMoveListener = null;
  watch(
    toRef2(element),
    (el) => {
      const target = resolveElement(toValue(el));
      if (target) {
        const ele = target;
        if (!elInitialOverflow.get(ele))
          elInitialOverflow.set(ele, ele.style.overflow);
        if (isLocked.value) ele.style.overflow = 'hidden';
      }
    },
    {
      immediate: true,
    },
  );
  const lock = () => {
    const el = resolveElement(toValue(element));
    if (!el || isLocked.value) return;
    if (isIOS) {
      stopTouchMoveListener = useEventListener(
        el,
        'touchmove',
        (e) => {
          preventDefault(e);
        },
        { passive: false },
      );
    }
    el.style.overflow = 'hidden';
    isLocked.value = true;
  };
  const unlock = () => {
    var _a;
    const el = resolveElement(toValue(element));
    if (!el || !isLocked.value) return;
    isIOS && (stopTouchMoveListener == null ? void 0 : stopTouchMoveListener());
    el.style.overflow = (_a = elInitialOverflow.get(el)) != null ? _a : '';
    elInitialOverflow.delete(el);
    isLocked.value = false;
  };
  tryOnScopeDispose(unlock);
  return computed({
    get() {
      return isLocked.value;
    },
    set(v) {
      if (v) lock();
      else unlock();
    },
  });
}
function useSessionStorage(key, initialValue, options = {}) {
  const { window: window2 = defaultWindow } = options;
  return useStorage(
    key,
    initialValue,
    window2 == null ? void 0 : window2.sessionStorage,
    options,
  );
}
function useShare(shareOptions = {}, options = {}) {
  const { navigator = defaultNavigator } = options;
  const _navigator = navigator;
  const isSupported = useSupported(
    () => _navigator && 'canShare' in _navigator,
  );
  const share = async (overrideOptions = {}) => {
    if (isSupported.value) {
      const data = {
        ...toValue(shareOptions),
        ...toValue(overrideOptions),
      };
      let granted = true;
      if (data.files && _navigator.canShare)
        granted = _navigator.canShare({ files: data.files });
      if (granted) return _navigator.share(data);
    }
  };
  return {
    isSupported,
    share,
  };
}
var defaultSortFn = (source, compareFn) => source.sort(compareFn);
var defaultCompare = (a, b) => a - b;
function useSorted(...args) {
  var _a, _b, _c, _d;
  const [source] = args;
  let compareFn = defaultCompare;
  let options = {};
  if (args.length === 2) {
    if (typeof args[1] === 'object') {
      options = args[1];
      compareFn = (_a = options.compareFn) != null ? _a : defaultCompare;
    } else {
      compareFn = (_b = args[1]) != null ? _b : defaultCompare;
    }
  } else if (args.length > 2) {
    compareFn = (_c = args[1]) != null ? _c : defaultCompare;
    options = (_d = args[2]) != null ? _d : {};
  }
  const { dirty = false, sortFn = defaultSortFn } = options;
  if (!dirty) return computed(() => sortFn([...toValue(source)], compareFn));
  watchEffect(() => {
    const result = sortFn(toValue(source), compareFn);
    if (isRef(source)) source.value = result;
    else source.splice(0, source.length, ...result);
  });
  return source;
}
function useSpeechRecognition(options = {}) {
  const {
    interimResults = true,
    continuous = true,
    window: window2 = defaultWindow,
  } = options;
  const lang = toRef2(options.lang || 'en-US');
  const isListening = ref(false);
  const isFinal = ref(false);
  const result = ref('');
  const error = shallowRef(void 0);
  const toggle = (value = !isListening.value) => {
    isListening.value = value;
  };
  const start = () => {
    isListening.value = true;
  };
  const stop = () => {
    isListening.value = false;
  };
  const SpeechRecognition =
    window2 && (window2.SpeechRecognition || window2.webkitSpeechRecognition);
  const isSupported = useSupported(() => SpeechRecognition);
  let recognition;
  if (isSupported.value) {
    recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = toValue(lang);
    recognition.onstart = () => {
      isFinal.value = false;
    };
    watch(lang, (lang2) => {
      if (recognition && !isListening.value) recognition.lang = lang2;
    });
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result2) => {
          isFinal.value = result2.isFinal;
          return result2[0];
        })
        .map((result2) => result2.transcript)
        .join('');
      result.value = transcript;
      error.value = void 0;
    };
    recognition.onerror = (event) => {
      error.value = event;
    };
    recognition.onend = () => {
      isListening.value = false;
      recognition.lang = toValue(lang);
    };
    watch(isListening, () => {
      if (isListening.value) recognition.start();
      else recognition.stop();
    });
  }
  tryOnScopeDispose(() => {
    isListening.value = false;
  });
  return {
    isSupported,
    isListening,
    isFinal,
    recognition,
    result,
    error,
    toggle,
    start,
    stop,
  };
}
function useSpeechSynthesis(text, options = {}) {
  const {
    pitch = 1,
    rate = 1,
    volume = 1,
    window: window2 = defaultWindow,
  } = options;
  const synth = window2 && window2.speechSynthesis;
  const isSupported = useSupported(() => synth);
  const isPlaying = ref(false);
  const status = ref('init');
  const spokenText = toRef2(text || '');
  const lang = toRef2(options.lang || 'en-US');
  const error = shallowRef(void 0);
  const toggle = (value = !isPlaying.value) => {
    isPlaying.value = value;
  };
  const bindEventsForUtterance = (utterance2) => {
    utterance2.lang = toValue(lang);
    utterance2.voice = toValue(options.voice) || null;
    utterance2.pitch = toValue(pitch);
    utterance2.rate = toValue(rate);
    utterance2.volume = volume;
    utterance2.onstart = () => {
      isPlaying.value = true;
      status.value = 'play';
    };
    utterance2.onpause = () => {
      isPlaying.value = false;
      status.value = 'pause';
    };
    utterance2.onresume = () => {
      isPlaying.value = true;
      status.value = 'play';
    };
    utterance2.onend = () => {
      isPlaying.value = false;
      status.value = 'end';
    };
    utterance2.onerror = (event) => {
      error.value = event;
    };
  };
  const utterance = computed(() => {
    isPlaying.value = false;
    status.value = 'init';
    const newUtterance = new SpeechSynthesisUtterance(spokenText.value);
    bindEventsForUtterance(newUtterance);
    return newUtterance;
  });
  const speak = () => {
    synth.cancel();
    utterance && synth.speak(utterance.value);
  };
  const stop = () => {
    synth.cancel();
    isPlaying.value = false;
  };
  if (isSupported.value) {
    bindEventsForUtterance(utterance.value);
    watch(lang, (lang2) => {
      if (utterance.value && !isPlaying.value) utterance.value.lang = lang2;
    });
    if (options.voice) {
      watch(options.voice, () => {
        synth.cancel();
      });
    }
    watch(isPlaying, () => {
      if (isPlaying.value) synth.resume();
      else synth.pause();
    });
  }
  tryOnScopeDispose(() => {
    isPlaying.value = false;
  });
  return {
    isSupported,
    isPlaying,
    status,
    utterance,
    error,
    stop,
    toggle,
    speak,
  };
}
function useStepper(steps, initialStep) {
  const stepsRef = ref(steps);
  const stepNames = computed(() =>
    Array.isArray(stepsRef.value)
      ? stepsRef.value
      : Object.keys(stepsRef.value),
  );
  const index = ref(
    stepNames.value.indexOf(
      initialStep != null ? initialStep : stepNames.value[0],
    ),
  );
  const current = computed(() => at(index.value));
  const isFirst = computed(() => index.value === 0);
  const isLast = computed(() => index.value === stepNames.value.length - 1);
  const next = computed(() => stepNames.value[index.value + 1]);
  const previous = computed(() => stepNames.value[index.value - 1]);
  function at(index2) {
    if (Array.isArray(stepsRef.value)) return stepsRef.value[index2];
    return stepsRef.value[stepNames.value[index2]];
  }
  function get2(step) {
    if (!stepNames.value.includes(step)) return;
    return at(stepNames.value.indexOf(step));
  }
  function goTo(step) {
    if (stepNames.value.includes(step))
      index.value = stepNames.value.indexOf(step);
  }
  function goToNext() {
    if (isLast.value) return;
    index.value++;
  }
  function goToPrevious() {
    if (isFirst.value) return;
    index.value--;
  }
  function goBackTo(step) {
    if (isAfter(step)) goTo(step);
  }
  function isNext(step) {
    return stepNames.value.indexOf(step) === index.value + 1;
  }
  function isPrevious(step) {
    return stepNames.value.indexOf(step) === index.value - 1;
  }
  function isCurrent(step) {
    return stepNames.value.indexOf(step) === index.value;
  }
  function isBefore(step) {
    return index.value < stepNames.value.indexOf(step);
  }
  function isAfter(step) {
    return index.value > stepNames.value.indexOf(step);
  }
  return {
    steps: stepsRef,
    stepNames,
    index,
    current,
    next,
    previous,
    isFirst,
    isLast,
    at,
    get: get2,
    goTo,
    goToNext,
    goToPrevious,
    goBackTo,
    isNext,
    isPrevious,
    isCurrent,
    isBefore,
    isAfter,
  };
}
function useStorageAsync(key, initialValue, storage, options = {}) {
  var _a;
  const {
    flush = 'pre',
    deep = true,
    listenToStorageChanges = true,
    writeDefaults = true,
    mergeDefaults = false,
    shallow,
    window: window2 = defaultWindow,
    eventFilter,
    onError = (e) => {
      console.error(e);
    },
  } = options;
  const rawInit = toValue(initialValue);
  const type = guessSerializerType(rawInit);
  const data = (shallow ? shallowRef : ref)(initialValue);
  const serializer =
    (_a = options.serializer) != null ? _a : StorageSerializers[type];
  if (!storage) {
    try {
      storage = getSSRHandler('getDefaultStorageAsync', () => {
        var _a2;
        return (_a2 = defaultWindow) == null ? void 0 : _a2.localStorage;
      })();
    } catch (e) {
      onError(e);
    }
  }
  async function read(event) {
    if (!storage || (event && event.key !== key)) return;
    try {
      const rawValue = event ? event.newValue : await storage.getItem(key);
      if (rawValue == null) {
        data.value = rawInit;
        if (writeDefaults && rawInit !== null)
          await storage.setItem(key, await serializer.write(rawInit));
      } else if (mergeDefaults) {
        const value = await serializer.read(rawValue);
        if (typeof mergeDefaults === 'function')
          data.value = mergeDefaults(value, rawInit);
        else if (type === 'object' && !Array.isArray(value))
          data.value = { ...rawInit, ...value };
        else data.value = value;
      } else {
        data.value = await serializer.read(rawValue);
      }
    } catch (e) {
      onError(e);
    }
  }
  read();
  if (window2 && listenToStorageChanges)
    useEventListener(window2, 'storage', (e) =>
      Promise.resolve().then(() => read(e)),
    );
  if (storage) {
    watchWithFilter(
      data,
      async () => {
        try {
          if (data.value == null) await storage.removeItem(key);
          else await storage.setItem(key, await serializer.write(data.value));
        } catch (e) {
          onError(e);
        }
      },
      {
        flush,
        deep,
        eventFilter,
      },
    );
  }
  return data;
}
var _id = 0;
function useStyleTag(css, options = {}) {
  const isLoaded = ref(false);
  const {
    document: document2 = defaultDocument,
    immediate = true,
    manual = false,
    id = `vueuse_styletag_${++_id}`,
  } = options;
  const cssRef = ref(css);
  let stop = () => {};
  const load = () => {
    if (!document2) return;
    const el = document2.getElementById(id) || document2.createElement('style');
    if (!el.isConnected) {
      el.id = id;
      if (options.media) el.media = options.media;
      document2.head.appendChild(el);
    }
    if (isLoaded.value) return;
    stop = watch(
      cssRef,
      (value) => {
        el.textContent = value;
      },
      { immediate: true },
    );
    isLoaded.value = true;
  };
  const unload = () => {
    if (!document2 || !isLoaded.value) return;
    stop();
    document2.head.removeChild(document2.getElementById(id));
    isLoaded.value = false;
  };
  if (immediate && !manual) tryOnMounted(load);
  if (!manual) tryOnScopeDispose(unload);
  return {
    id,
    css: cssRef,
    unload,
    load,
    isLoaded: readonly(isLoaded),
  };
}
function useSwipe(target, options = {}) {
  const {
    threshold = 50,
    onSwipe,
    onSwipeEnd,
    onSwipeStart,
    passive = true,
    window: window2 = defaultWindow,
  } = options;
  const coordsStart = reactive({ x: 0, y: 0 });
  const coordsEnd = reactive({ x: 0, y: 0 });
  const diffX = computed(() => coordsStart.x - coordsEnd.x);
  const diffY = computed(() => coordsStart.y - coordsEnd.y);
  const { max, abs } = Math;
  const isThresholdExceeded = computed(
    () => max(abs(diffX.value), abs(diffY.value)) >= threshold,
  );
  const isSwiping = ref(false);
  const direction = computed(() => {
    if (!isThresholdExceeded.value) return 'none';
    if (abs(diffX.value) > abs(diffY.value)) {
      return diffX.value > 0 ? 'left' : 'right';
    } else {
      return diffY.value > 0 ? 'up' : 'down';
    }
  });
  const getTouchEventCoords = (e) => [
    e.touches[0].clientX,
    e.touches[0].clientY,
  ];
  const updateCoordsStart = (x, y) => {
    coordsStart.x = x;
    coordsStart.y = y;
  };
  const updateCoordsEnd = (x, y) => {
    coordsEnd.x = x;
    coordsEnd.y = y;
  };
  let listenerOptions;
  const isPassiveEventSupported = checkPassiveEventSupport(
    window2 == null ? void 0 : window2.document,
  );
  if (!passive)
    listenerOptions = isPassiveEventSupported
      ? { passive: false, capture: true }
      : { capture: true };
  else
    listenerOptions = isPassiveEventSupported
      ? { passive: true }
      : { capture: false };
  const onTouchEnd = (e) => {
    if (isSwiping.value)
      onSwipeEnd == null ? void 0 : onSwipeEnd(e, direction.value);
    isSwiping.value = false;
  };
  const stops = [
    useEventListener(
      target,
      'touchstart',
      (e) => {
        if (e.touches.length !== 1) return;
        if (listenerOptions.capture && !listenerOptions.passive)
          e.preventDefault();
        const [x, y] = getTouchEventCoords(e);
        updateCoordsStart(x, y);
        updateCoordsEnd(x, y);
        onSwipeStart == null ? void 0 : onSwipeStart(e);
      },
      listenerOptions,
    ),
    useEventListener(
      target,
      'touchmove',
      (e) => {
        if (e.touches.length !== 1) return;
        const [x, y] = getTouchEventCoords(e);
        updateCoordsEnd(x, y);
        if (!isSwiping.value && isThresholdExceeded.value)
          isSwiping.value = true;
        if (isSwiping.value) onSwipe == null ? void 0 : onSwipe(e);
      },
      listenerOptions,
    ),
    useEventListener(
      target,
      ['touchend', 'touchcancel'],
      onTouchEnd,
      listenerOptions,
    ),
  ];
  const stop = () => stops.forEach((s) => s());
  return {
    isPassiveEventSupported,
    isSwiping,
    direction,
    coordsStart,
    coordsEnd,
    lengthX: diffX,
    lengthY: diffY,
    stop,
  };
}
function checkPassiveEventSupport(document2) {
  if (!document2) return false;
  let supportsPassive = false;
  const optionsBlock = {
    get passive() {
      supportsPassive = true;
      return false;
    },
  };
  document2.addEventListener('x', noop, optionsBlock);
  document2.removeEventListener('x', noop);
  return supportsPassive;
}
function useTemplateRefsList() {
  const refs = ref([]);
  refs.value.set = (el) => {
    if (el) refs.value.push(el);
  };
  onBeforeUpdate(() => {
    refs.value.length = 0;
  });
  return refs;
}
function useTextDirection(options = {}) {
  const {
    document: document2 = defaultDocument,
    selector = 'html',
    observe = false,
    initialValue = 'ltr',
  } = options;
  function getValue2() {
    var _a, _b;
    return (_b =
      (_a = document2 == null ? void 0 : document2.querySelector(selector)) ==
      null
        ? void 0
        : _a.getAttribute('dir')) != null
      ? _b
      : initialValue;
  }
  const dir = ref(getValue2());
  tryOnMounted(() => (dir.value = getValue2()));
  if (observe && document2) {
    useMutationObserver(
      document2.querySelector(selector),
      () => (dir.value = getValue2()),
      { attributes: true },
    );
  }
  return computed({
    get() {
      return dir.value;
    },
    set(v) {
      var _a, _b;
      dir.value = v;
      if (!document2) return;
      if (dir.value)
        (_a = document2.querySelector(selector)) == null
          ? void 0
          : _a.setAttribute('dir', dir.value);
      else
        (_b = document2.querySelector(selector)) == null
          ? void 0
          : _b.removeAttribute('dir');
    },
  });
}
function getRangesFromSelection(selection) {
  var _a;
  const rangeCount = (_a = selection.rangeCount) != null ? _a : 0;
  return Array.from({ length: rangeCount }, (_, i) => selection.getRangeAt(i));
}
function useTextSelection(options = {}) {
  const { window: window2 = defaultWindow } = options;
  const selection = ref(null);
  const text = computed(() => {
    var _a, _b;
    return (_b = (_a = selection.value) == null ? void 0 : _a.toString()) !=
      null
      ? _b
      : '';
  });
  const ranges = computed(() =>
    selection.value ? getRangesFromSelection(selection.value) : [],
  );
  const rects = computed(() =>
    ranges.value.map((range) => range.getBoundingClientRect()),
  );
  function onSelectionChange() {
    selection.value = null;
    if (window2) selection.value = window2.getSelection();
  }
  if (window2)
    useEventListener(window2.document, 'selectionchange', onSelectionChange);
  return {
    text,
    rects,
    ranges,
    selection,
  };
}
function useTextareaAutosize(options) {
  var _a;
  const textarea = ref(options == null ? void 0 : options.element);
  const input = ref(options == null ? void 0 : options.input);
  const styleProp =
    (_a = options == null ? void 0 : options.styleProp) != null ? _a : 'height';
  const textareaScrollHeight = ref(1);
  function triggerResize() {
    var _a2, _b;
    if (!textarea.value) return;
    let height = '';
    textarea.value.style[styleProp] = '1px';
    textareaScrollHeight.value =
      (_a2 = textarea.value) == null ? void 0 : _a2.scrollHeight;
    if (options == null ? void 0 : options.styleTarget)
      toValue(options.styleTarget).style[styleProp] =
        `${textareaScrollHeight.value}px`;
    else height = `${textareaScrollHeight.value}px`;
    textarea.value.style[styleProp] = height;
    (_b = options == null ? void 0 : options.onResize) == null
      ? void 0
      : _b.call(options);
  }
  watch([input, textarea], () => nextTick(triggerResize), { immediate: true });
  useResizeObserver(textarea, () => triggerResize());
  if (options == null ? void 0 : options.watch)
    watch(options.watch, triggerResize, { immediate: true, deep: true });
  return {
    textarea,
    input,
    triggerResize,
  };
}
function useThrottledRefHistory(source, options = {}) {
  const { throttle = 200, trailing = true } = options;
  const filter = throttleFilter(throttle, trailing);
  const history = useRefHistory(source, { ...options, eventFilter: filter });
  return {
    ...history,
  };
}
var DEFAULT_UNITS = [
  { max: 6e4, value: 1e3, name: 'second' },
  { max: 276e4, value: 6e4, name: 'minute' },
  { max: 72e6, value: 36e5, name: 'hour' },
  { max: 5184e5, value: 864e5, name: 'day' },
  { max: 24192e5, value: 6048e5, name: 'week' },
  { max: 28512e6, value: 2592e6, name: 'month' },
  { max: Number.POSITIVE_INFINITY, value: 31536e6, name: 'year' },
];
var DEFAULT_MESSAGES = {
  justNow: 'just now',
  past: (n) => (n.match(/\d/) ? `${n} ago` : n),
  future: (n) => (n.match(/\d/) ? `in ${n}` : n),
  month: (n, past) =>
    n === 1
      ? past
        ? 'last month'
        : 'next month'
      : `${n} month${n > 1 ? 's' : ''}`,
  year: (n, past) =>
    n === 1
      ? past
        ? 'last year'
        : 'next year'
      : `${n} year${n > 1 ? 's' : ''}`,
  day: (n, past) =>
    n === 1 ? (past ? 'yesterday' : 'tomorrow') : `${n} day${n > 1 ? 's' : ''}`,
  week: (n, past) =>
    n === 1
      ? past
        ? 'last week'
        : 'next week'
      : `${n} week${n > 1 ? 's' : ''}`,
  hour: (n) => `${n} hour${n > 1 ? 's' : ''}`,
  minute: (n) => `${n} minute${n > 1 ? 's' : ''}`,
  second: (n) => `${n} second${n > 1 ? 's' : ''}`,
  invalid: '',
};
function DEFAULT_FORMATTER(date) {
  return date.toISOString().slice(0, 10);
}
function useTimeAgo(time, options = {}) {
  const { controls: exposeControls = false, updateInterval = 3e4 } = options;
  const { now: now2, ...controls } = useNow({
    interval: updateInterval,
    controls: true,
  });
  const timeAgo = computed(() =>
    formatTimeAgo(new Date(toValue(time)), options, toValue(now2)),
  );
  if (exposeControls) {
    return {
      timeAgo,
      ...controls,
    };
  } else {
    return timeAgo;
  }
}
function formatTimeAgo(from, options = {}, now2 = Date.now()) {
  var _a;
  const {
    max,
    messages = DEFAULT_MESSAGES,
    fullDateFormatter = DEFAULT_FORMATTER,
    units = DEFAULT_UNITS,
    showSecond = false,
    rounding = 'round',
  } = options;
  const roundFn =
    typeof rounding === 'number' ? (n) => +n.toFixed(rounding) : Math[rounding];
  const diff = +now2 - +from;
  const absDiff = Math.abs(diff);
  function getValue2(diff2, unit) {
    return roundFn(Math.abs(diff2) / unit.value);
  }
  function format(diff2, unit) {
    const val = getValue2(diff2, unit);
    const past = diff2 > 0;
    const str = applyFormat(unit.name, val, past);
    return applyFormat(past ? 'past' : 'future', str, past);
  }
  function applyFormat(name, val, isPast) {
    const formatter = messages[name];
    if (typeof formatter === 'function') return formatter(val, isPast);
    return formatter.replace('{0}', val.toString());
  }
  if (absDiff < 6e4 && !showSecond) return messages.justNow;
  if (typeof max === 'number' && absDiff > max)
    return fullDateFormatter(new Date(from));
  if (typeof max === 'string') {
    const unitMax =
      (_a = units.find((i) => i.name === max)) == null ? void 0 : _a.max;
    if (unitMax && absDiff > unitMax) return fullDateFormatter(new Date(from));
  }
  for (const [idx, unit] of units.entries()) {
    const val = getValue2(diff, unit);
    if (val <= 0 && units[idx - 1]) return format(diff, units[idx - 1]);
    if (absDiff < unit.max) return format(diff, unit);
  }
  return messages.invalid;
}
function useTimeoutPoll(fn, interval, timeoutPollOptions) {
  const { start } = useTimeoutFn(loop, interval, { immediate: false });
  const isActive = ref(false);
  async function loop() {
    if (!isActive.value) return;
    await fn();
    start();
  }
  function resume() {
    if (!isActive.value) {
      isActive.value = true;
      loop();
    }
  }
  function pause() {
    isActive.value = false;
  }
  if (timeoutPollOptions == null ? void 0 : timeoutPollOptions.immediate)
    resume();
  tryOnScopeDispose(pause);
  return {
    isActive,
    pause,
    resume,
  };
}
function useTimestamp(options = {}) {
  const {
    controls: exposeControls = false,
    offset = 0,
    immediate = true,
    interval = 'requestAnimationFrame',
    callback,
  } = options;
  const ts = ref(timestamp() + offset);
  const update = () => (ts.value = timestamp() + offset);
  const cb = callback
    ? () => {
        update();
        callback(ts.value);
      }
    : update;
  const controls =
    interval === 'requestAnimationFrame'
      ? useRafFn(cb, { immediate })
      : useIntervalFn(cb, interval, { immediate });
  if (exposeControls) {
    return {
      timestamp: ts,
      ...controls,
    };
  } else {
    return ts;
  }
}
function useTitle(newTitle = null, options = {}) {
  var _a, _b, _c;
  const { document: document2 = defaultDocument, restoreOnUnmount = (t) => t } =
    options;
  const originalTitle =
    (_a = document2 == null ? void 0 : document2.title) != null ? _a : '';
  const title = toRef2(
    (_b =
      newTitle != null
        ? newTitle
        : document2 == null
          ? void 0
          : document2.title) != null
      ? _b
      : null,
  );
  const isReadonly2 = newTitle && typeof newTitle === 'function';
  function format(t) {
    if (!('titleTemplate' in options)) return t;
    const template = options.titleTemplate || '%s';
    return typeof template === 'function'
      ? template(t)
      : toValue(template).replace(/%s/g, t);
  }
  watch(
    title,
    (t, o) => {
      if (t !== o && document2)
        document2.title = format(typeof t === 'string' ? t : '');
    },
    { immediate: true },
  );
  if (options.observe && !options.titleTemplate && document2 && !isReadonly2) {
    useMutationObserver(
      (_c = document2.head) == null ? void 0 : _c.querySelector('title'),
      () => {
        if (document2 && document2.title !== title.value)
          title.value = format(document2.title);
      },
      { childList: true },
    );
  }
  tryOnBeforeUnmount(() => {
    if (restoreOnUnmount) {
      const restoredTitle = restoreOnUnmount(originalTitle, title.value || '');
      if (restoredTitle != null && document2) document2.title = restoredTitle;
    }
  });
  return title;
}
var _TransitionPresets = {
  easeInSine: [0.12, 0, 0.39, 0],
  easeOutSine: [0.61, 1, 0.88, 1],
  easeInOutSine: [0.37, 0, 0.63, 1],
  easeInQuad: [0.11, 0, 0.5, 0],
  easeOutQuad: [0.5, 1, 0.89, 1],
  easeInOutQuad: [0.45, 0, 0.55, 1],
  easeInCubic: [0.32, 0, 0.67, 0],
  easeOutCubic: [0.33, 1, 0.68, 1],
  easeInOutCubic: [0.65, 0, 0.35, 1],
  easeInQuart: [0.5, 0, 0.75, 0],
  easeOutQuart: [0.25, 1, 0.5, 1],
  easeInOutQuart: [0.76, 0, 0.24, 1],
  easeInQuint: [0.64, 0, 0.78, 0],
  easeOutQuint: [0.22, 1, 0.36, 1],
  easeInOutQuint: [0.83, 0, 0.17, 1],
  easeInExpo: [0.7, 0, 0.84, 0],
  easeOutExpo: [0.16, 1, 0.3, 1],
  easeInOutExpo: [0.87, 0, 0.13, 1],
  easeInCirc: [0.55, 0, 1, 0.45],
  easeOutCirc: [0, 0.55, 0.45, 1],
  easeInOutCirc: [0.85, 0, 0.15, 1],
  easeInBack: [0.36, 0, 0.66, -0.56],
  easeOutBack: [0.34, 1.56, 0.64, 1],
  easeInOutBack: [0.68, -0.6, 0.32, 1.6],
};
var TransitionPresets = Object.assign(
  {},
  { linear: identity },
  _TransitionPresets,
);
function createEasingFunction([p0, p1, p2, p3]) {
  const a = (a1, a2) => 1 - 3 * a2 + 3 * a1;
  const b = (a1, a2) => 3 * a2 - 6 * a1;
  const c = (a1) => 3 * a1;
  const calcBezier = (t, a1, a2) =>
    ((a(a1, a2) * t + b(a1, a2)) * t + c(a1)) * t;
  const getSlope = (t, a1, a2) =>
    3 * a(a1, a2) * t * t + 2 * b(a1, a2) * t + c(a1);
  const getTforX = (x) => {
    let aGuessT = x;
    for (let i = 0; i < 4; ++i) {
      const currentSlope = getSlope(aGuessT, p0, p2);
      if (currentSlope === 0) return aGuessT;
      const currentX = calcBezier(aGuessT, p0, p2) - x;
      aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
  };
  return (x) => (p0 === p1 && p2 === p3 ? x : calcBezier(getTforX(x), p1, p3));
}
function lerp(a, b, alpha) {
  return a + alpha * (b - a);
}
function toVec(t) {
  return (typeof t === 'number' ? [t] : t) || [];
}
function executeTransition(source, from, to, options = {}) {
  var _a, _b;
  const fromVal = toValue(from);
  const toVal = toValue(to);
  const v1 = toVec(fromVal);
  const v2 = toVec(toVal);
  const duration = (_a = toValue(options.duration)) != null ? _a : 1e3;
  const startedAt = Date.now();
  const endAt = Date.now() + duration;
  const trans =
    typeof options.transition === 'function'
      ? options.transition
      : (_b = toValue(options.transition)) != null
        ? _b
        : identity;
  const ease =
    typeof trans === 'function' ? trans : createEasingFunction(trans);
  return new Promise((resolve) => {
    source.value = fromVal;
    const tick = () => {
      var _a2;
      if ((_a2 = options.abort) == null ? void 0 : _a2.call(options)) {
        resolve();
        return;
      }
      const now2 = Date.now();
      const alpha = ease((now2 - startedAt) / duration);
      const arr = toVec(source.value).map((n, i) => lerp(v1[i], v2[i], alpha));
      if (Array.isArray(source.value))
        source.value = arr.map((n, i) => {
          var _a3, _b2;
          return lerp(
            (_a3 = v1[i]) != null ? _a3 : 0,
            (_b2 = v2[i]) != null ? _b2 : 0,
            alpha,
          );
        });
      else if (typeof source.value === 'number') source.value = arr[0];
      if (now2 < endAt) {
        requestAnimationFrame(tick);
      } else {
        source.value = toVal;
        resolve();
      }
    };
    tick();
  });
}
function useTransition(source, options = {}) {
  let currentId = 0;
  const sourceVal = () => {
    const v = toValue(source);
    return typeof v === 'number' ? v : v.map(toValue);
  };
  const outputRef = ref(sourceVal());
  watch(
    sourceVal,
    async (to) => {
      var _a, _b;
      if (toValue(options.disabled)) return;
      const id = ++currentId;
      if (options.delay) await promiseTimeout(toValue(options.delay));
      if (id !== currentId) return;
      const toVal = Array.isArray(to) ? to.map(toValue) : toValue(to);
      (_a = options.onStarted) == null ? void 0 : _a.call(options);
      await executeTransition(outputRef, outputRef.value, toVal, {
        ...options,
        abort: () => {
          var _a2;
          return (
            id !== currentId ||
            ((_a2 = options.abort) == null ? void 0 : _a2.call(options))
          );
        },
      });
      (_b = options.onFinished) == null ? void 0 : _b.call(options);
    },
    { deep: true },
  );
  watch(
    () => toValue(options.disabled),
    (disabled) => {
      if (disabled) {
        currentId++;
        outputRef.value = sourceVal();
      }
    },
  );
  tryOnScopeDispose(() => {
    currentId++;
  });
  return computed(() =>
    toValue(options.disabled) ? sourceVal() : outputRef.value,
  );
}
function useUrlSearchParams(mode = 'history', options = {}) {
  const {
    initialValue = {},
    removeNullishValues = true,
    removeFalsyValues = false,
    write: enableWrite = true,
    window: window2 = defaultWindow,
  } = options;
  if (!window2) return reactive(initialValue);
  const state = reactive({});
  function getRawParams() {
    if (mode === 'history') {
      return window2.location.search || '';
    } else if (mode === 'hash') {
      const hash = window2.location.hash || '';
      const index = hash.indexOf('?');
      return index > 0 ? hash.slice(index) : '';
    } else {
      return (window2.location.hash || '').replace(/^#/, '');
    }
  }
  function constructQuery(params) {
    const stringified = params.toString();
    if (mode === 'history')
      return `${stringified ? `?${stringified}` : ''}${window2.location.hash || ''}`;
    if (mode === 'hash-params')
      return `${window2.location.search || ''}${stringified ? `#${stringified}` : ''}`;
    const hash = window2.location.hash || '#';
    const index = hash.indexOf('?');
    if (index > 0)
      return `${hash.slice(0, index)}${stringified ? `?${stringified}` : ''}`;
    return `${hash}${stringified ? `?${stringified}` : ''}`;
  }
  function read() {
    return new URLSearchParams(getRawParams());
  }
  function updateState(params) {
    const unusedKeys = new Set(Object.keys(state));
    for (const key of params.keys()) {
      const paramsForKey = params.getAll(key);
      state[key] =
        paramsForKey.length > 1 ? paramsForKey : params.get(key) || '';
      unusedKeys.delete(key);
    }
    Array.from(unusedKeys).forEach((key) => delete state[key]);
  }
  const { pause, resume } = watchPausable(
    state,
    () => {
      const params = new URLSearchParams('');
      Object.keys(state).forEach((key) => {
        const mapEntry = state[key];
        if (Array.isArray(mapEntry))
          mapEntry.forEach((value) => params.append(key, value));
        else if (removeNullishValues && mapEntry == null) params.delete(key);
        else if (removeFalsyValues && !mapEntry) params.delete(key);
        else params.set(key, mapEntry);
      });
      write(params);
    },
    { deep: true },
  );
  function write(params, shouldUpdate) {
    pause();
    if (shouldUpdate) updateState(params);
    window2.history.replaceState(
      window2.history.state,
      window2.document.title,
      window2.location.pathname + constructQuery(params),
    );
    resume();
  }
  function onChanged() {
    if (!enableWrite) return;
    write(read(), true);
  }
  useEventListener(window2, 'popstate', onChanged, false);
  if (mode !== 'history')
    useEventListener(window2, 'hashchange', onChanged, false);
  const initial = read();
  if (initial.keys().next().value) updateState(initial);
  else Object.assign(state, initialValue);
  return state;
}
function useUserMedia(options = {}) {
  var _a, _b;
  const enabled = ref((_a = options.enabled) != null ? _a : false);
  const autoSwitch = ref((_b = options.autoSwitch) != null ? _b : true);
  const constraints = ref(options.constraints);
  const { navigator = defaultNavigator } = options;
  const isSupported = useSupported(() => {
    var _a2;
    return (_a2 = navigator == null ? void 0 : navigator.mediaDevices) == null
      ? void 0
      : _a2.getUserMedia;
  });
  const stream = shallowRef();
  function getDeviceOptions(type) {
    switch (type) {
      case 'video': {
        if (constraints.value) return constraints.value.video || false;
        break;
      }
      case 'audio': {
        if (constraints.value) return constraints.value.audio || false;
        break;
      }
    }
  }
  async function _start() {
    if (!isSupported.value || stream.value) return;
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: getDeviceOptions('video'),
      audio: getDeviceOptions('audio'),
    });
    return stream.value;
  }
  function _stop() {
    var _a2;
    (_a2 = stream.value) == null
      ? void 0
      : _a2.getTracks().forEach((t) => t.stop());
    stream.value = void 0;
  }
  function stop() {
    _stop();
    enabled.value = false;
  }
  async function start() {
    await _start();
    if (stream.value) enabled.value = true;
    return stream.value;
  }
  async function restart() {
    _stop();
    return await start();
  }
  watch(
    enabled,
    (v) => {
      if (v) _start();
      else _stop();
    },
    { immediate: true },
  );
  watch(
    constraints,
    () => {
      if (autoSwitch.value && stream.value) restart();
    },
    { immediate: true },
  );
  tryOnScopeDispose(() => {
    stop();
  });
  return {
    isSupported,
    stream,
    start,
    stop,
    restart,
    constraints,
    enabled,
    autoSwitch,
  };
}
function useVModel(props, key, emit, options = {}) {
  var _a, _b, _c, _d, _e;
  const {
    clone = false,
    passive = false,
    eventName,
    deep = false,
    defaultValue,
    shouldEmit,
  } = options;
  const vm = getCurrentInstance();
  const _emit =
    emit ||
    (vm == null ? void 0 : vm.emit) ||
    ((_a = vm == null ? void 0 : vm.$emit) == null ? void 0 : _a.bind(vm)) ||
    ((_c = (_b = vm == null ? void 0 : vm.proxy) == null ? void 0 : _b.$emit) ==
    null
      ? void 0
      : _c.bind(vm == null ? void 0 : vm.proxy));
  let event = eventName;
  if (!key) {
    if (isVue2) {
      const modelOptions =
        (_e =
          (_d = vm == null ? void 0 : vm.proxy) == null
            ? void 0
            : _d.$options) == null
          ? void 0
          : _e.model;
      key = (modelOptions == null ? void 0 : modelOptions.value) || 'value';
      if (!eventName)
        event = (modelOptions == null ? void 0 : modelOptions.event) || 'input';
    } else {
      key = 'modelValue';
    }
  }
  event = event || `update:${key.toString()}`;
  const cloneFn = (val) =>
    !clone ? val : typeof clone === 'function' ? clone(val) : cloneFnJSON(val);
  const getValue2 = () =>
    isDef(props[key]) ? cloneFn(props[key]) : defaultValue;
  const triggerEmit = (value) => {
    if (shouldEmit) {
      if (shouldEmit(value)) _emit(event, value);
    } else {
      _emit(event, value);
    }
  };
  if (passive) {
    const initialValue = getValue2();
    const proxy = ref(initialValue);
    let isUpdating = false;
    watch(
      () => props[key],
      (v) => {
        if (!isUpdating) {
          isUpdating = true;
          proxy.value = cloneFn(v);
          nextTick(() => (isUpdating = false));
        }
      },
    );
    watch(
      proxy,
      (v) => {
        if (!isUpdating && (v !== props[key] || deep)) triggerEmit(v);
      },
      { deep },
    );
    return proxy;
  } else {
    return computed({
      get() {
        return getValue2();
      },
      set(value) {
        triggerEmit(value);
      },
    });
  }
}
function useVModels(props, emit, options = {}) {
  const ret = {};
  for (const key in props) {
    ret[key] = useVModel(props, key, emit, options);
  }
  return ret;
}
function useVibrate(options) {
  const {
    pattern = [],
    interval = 0,
    navigator = defaultNavigator,
  } = options || {};
  const isSupported = useSupported(
    () => typeof navigator !== 'undefined' && 'vibrate' in navigator,
  );
  const patternRef = toRef2(pattern);
  let intervalControls;
  const vibrate = (pattern2 = patternRef.value) => {
    if (isSupported.value) navigator.vibrate(pattern2);
  };
  const stop = () => {
    if (isSupported.value) navigator.vibrate(0);
    intervalControls == null ? void 0 : intervalControls.pause();
  };
  if (interval > 0) {
    intervalControls = useIntervalFn(vibrate, interval, {
      immediate: false,
      immediateCallback: false,
    });
  }
  return {
    isSupported,
    pattern,
    intervalControls,
    vibrate,
    stop,
  };
}
function useVirtualList(list, options) {
  const {
    containerStyle,
    wrapperProps,
    scrollTo: scrollTo2,
    calculateRange,
    currentList,
    containerRef,
  } = 'itemHeight' in options
    ? useVerticalVirtualList(options, list)
    : useHorizontalVirtualList(options, list);
  return {
    list: currentList,
    scrollTo: scrollTo2,
    containerProps: {
      ref: containerRef,
      onScroll: () => {
        calculateRange();
      },
      style: containerStyle,
    },
    wrapperProps,
  };
}
function useVirtualListResources(list) {
  const containerRef = ref(null);
  const size = useElementSize(containerRef);
  const currentList = ref([]);
  const source = shallowRef(list);
  const state = ref({ start: 0, end: 10 });
  return { state, source, currentList, size, containerRef };
}
function createGetViewCapacity(state, source, itemSize) {
  return (containerSize) => {
    if (typeof itemSize === 'number')
      return Math.ceil(containerSize / itemSize);
    const { start = 0 } = state.value;
    let sum = 0;
    let capacity = 0;
    for (let i = start; i < source.value.length; i++) {
      const size = itemSize(i);
      sum += size;
      capacity = i;
      if (sum > containerSize) break;
    }
    return capacity - start;
  };
}
function createGetOffset(source, itemSize) {
  return (scrollDirection) => {
    if (typeof itemSize === 'number')
      return Math.floor(scrollDirection / itemSize) + 1;
    let sum = 0;
    let offset = 0;
    for (let i = 0; i < source.value.length; i++) {
      const size = itemSize(i);
      sum += size;
      if (sum >= scrollDirection) {
        offset = i;
        break;
      }
    }
    return offset + 1;
  };
}
function createCalculateRange(
  type,
  overscan,
  getOffset,
  getViewCapacity,
  { containerRef, state, currentList, source },
) {
  return () => {
    const element = containerRef.value;
    if (element) {
      const offset = getOffset(
        type === 'vertical' ? element.scrollTop : element.scrollLeft,
      );
      const viewCapacity = getViewCapacity(
        type === 'vertical' ? element.clientHeight : element.clientWidth,
      );
      const from = offset - overscan;
      const to = offset + viewCapacity + overscan;
      state.value = {
        start: from < 0 ? 0 : from,
        end: to > source.value.length ? source.value.length : to,
      };
      currentList.value = source.value
        .slice(state.value.start, state.value.end)
        .map((ele, index) => ({
          data: ele,
          index: index + state.value.start,
        }));
    }
  };
}
function createGetDistance(itemSize, source) {
  return (index) => {
    if (typeof itemSize === 'number') {
      const size2 = index * itemSize;
      return size2;
    }
    const size = source.value
      .slice(0, index)
      .reduce((sum, _, i) => sum + itemSize(i), 0);
    return size;
  };
}
function useWatchForSizes(size, list, calculateRange) {
  watch([size.width, size.height, list], () => {
    calculateRange();
  });
}
function createComputedTotalSize(itemSize, source) {
  return computed(() => {
    if (typeof itemSize === 'number') return source.value.length * itemSize;
    return source.value.reduce((sum, _, index) => sum + itemSize(index), 0);
  });
}
var scrollToDictionaryForElementScrollKey = {
  horizontal: 'scrollLeft',
  vertical: 'scrollTop',
};
function createScrollTo(type, calculateRange, getDistance, containerRef) {
  return (index) => {
    if (containerRef.value) {
      containerRef.value[scrollToDictionaryForElementScrollKey[type]] =
        getDistance(index);
      calculateRange();
    }
  };
}
function useHorizontalVirtualList(options, list) {
  const resources = useVirtualListResources(list);
  const { state, source, currentList, size, containerRef } = resources;
  const containerStyle = { overflowX: 'auto' };
  const { itemWidth, overscan = 5 } = options;
  const getViewCapacity = createGetViewCapacity(state, source, itemWidth);
  const getOffset = createGetOffset(source, itemWidth);
  const calculateRange = createCalculateRange(
    'horizontal',
    overscan,
    getOffset,
    getViewCapacity,
    resources,
  );
  const getDistanceLeft = createGetDistance(itemWidth, source);
  const offsetLeft = computed(() => getDistanceLeft(state.value.start));
  const totalWidth = createComputedTotalSize(itemWidth, source);
  useWatchForSizes(size, list, calculateRange);
  const scrollTo2 = createScrollTo(
    'horizontal',
    calculateRange,
    getDistanceLeft,
    containerRef,
  );
  const wrapperProps = computed(() => {
    return {
      style: {
        height: '100%',
        width: `${totalWidth.value - offsetLeft.value}px`,
        marginLeft: `${offsetLeft.value}px`,
        display: 'flex',
      },
    };
  });
  return {
    scrollTo: scrollTo2,
    calculateRange,
    wrapperProps,
    containerStyle,
    currentList,
    containerRef,
  };
}
function useVerticalVirtualList(options, list) {
  const resources = useVirtualListResources(list);
  const { state, source, currentList, size, containerRef } = resources;
  const containerStyle = { overflowY: 'auto' };
  const { itemHeight, overscan = 5 } = options;
  const getViewCapacity = createGetViewCapacity(state, source, itemHeight);
  const getOffset = createGetOffset(source, itemHeight);
  const calculateRange = createCalculateRange(
    'vertical',
    overscan,
    getOffset,
    getViewCapacity,
    resources,
  );
  const getDistanceTop = createGetDistance(itemHeight, source);
  const offsetTop = computed(() => getDistanceTop(state.value.start));
  const totalHeight = createComputedTotalSize(itemHeight, source);
  useWatchForSizes(size, list, calculateRange);
  const scrollTo2 = createScrollTo(
    'vertical',
    calculateRange,
    getDistanceTop,
    containerRef,
  );
  const wrapperProps = computed(() => {
    return {
      style: {
        width: '100%',
        height: `${totalHeight.value - offsetTop.value}px`,
        marginTop: `${offsetTop.value}px`,
      },
    };
  });
  return {
    calculateRange,
    scrollTo: scrollTo2,
    containerStyle,
    wrapperProps,
    currentList,
    containerRef,
  };
}
function useWakeLock(options = {}) {
  const {
    navigator = defaultNavigator,
    document: document2 = defaultDocument,
  } = options;
  let wakeLock;
  const isSupported = useSupported(() => navigator && 'wakeLock' in navigator);
  const isActive = ref(false);
  async function onVisibilityChange() {
    if (!isSupported.value || !wakeLock) return;
    if (document2 && document2.visibilityState === 'visible')
      wakeLock = await navigator.wakeLock.request('screen');
    isActive.value = !wakeLock.released;
  }
  if (document2)
    useEventListener(document2, 'visibilitychange', onVisibilityChange, {
      passive: true,
    });
  async function request(type) {
    if (!isSupported.value) return;
    wakeLock = await navigator.wakeLock.request(type);
    isActive.value = !wakeLock.released;
  }
  async function release() {
    if (!isSupported.value || !wakeLock) return;
    await wakeLock.release();
    isActive.value = !wakeLock.released;
    wakeLock = null;
  }
  return {
    isSupported,
    isActive,
    request,
    release,
  };
}
function useWebNotification(options = {}) {
  const {
    window: window2 = defaultWindow,
    requestPermissions: _requestForPermissions = true,
  } = options;
  const defaultWebNotificationOptions = options;
  const isSupported = useSupported(
    () => !!window2 && 'Notification' in window2,
  );
  const permissionGranted = ref(
    isSupported.value &&
      'permission' in Notification &&
      Notification.permission === 'granted',
  );
  const notification = ref(null);
  const ensurePermissions = async () => {
    if (!isSupported.value) return;
    if (!permissionGranted.value && Notification.permission !== 'denied') {
      const result = await Notification.requestPermission();
      if (result === 'granted') permissionGranted.value = true;
    }
    return permissionGranted.value;
  };
  const { on: onClick, trigger: clickTrigger } = createEventHook();
  const { on: onShow, trigger: showTrigger } = createEventHook();
  const { on: onError, trigger: errorTrigger } = createEventHook();
  const { on: onClose, trigger: closeTrigger } = createEventHook();
  const show = async (overrides) => {
    if (!isSupported.value || !permissionGranted.value) return;
    const options2 = Object.assign(
      {},
      defaultWebNotificationOptions,
      overrides,
    );
    notification.value = new Notification(options2.title || '', options2);
    notification.value.onclick = clickTrigger;
    notification.value.onshow = showTrigger;
    notification.value.onerror = errorTrigger;
    notification.value.onclose = closeTrigger;
    return notification.value;
  };
  const close = () => {
    if (notification.value) notification.value.close();
    notification.value = null;
  };
  if (_requestForPermissions) tryOnMounted(ensurePermissions);
  tryOnScopeDispose(close);
  if (isSupported.value && window2) {
    const document2 = window2.document;
    useEventListener(document2, 'visibilitychange', (e) => {
      e.preventDefault();
      if (document2.visibilityState === 'visible') {
        close();
      }
    });
  }
  return {
    isSupported,
    notification,
    ensurePermissions,
    permissionGranted,
    show,
    close,
    onClick,
    onShow,
    onError,
    onClose,
  };
}
var DEFAULT_PING_MESSAGE = 'ping';
function resolveNestedOptions(options) {
  if (options === true) return {};
  return options;
}
function useWebSocket(url, options = {}) {
  const {
    onConnected,
    onDisconnected,
    onError,
    onMessage,
    immediate = true,
    autoClose = true,
    protocols = [],
  } = options;
  const data = ref(null);
  const status = ref('CLOSED');
  const wsRef = ref();
  const urlRef = toRef2(url);
  let heartbeatPause;
  let heartbeatResume;
  let explicitlyClosed = false;
  let retried = 0;
  let bufferedData = [];
  let pongTimeoutWait;
  const _sendBuffer = () => {
    if (bufferedData.length && wsRef.value && status.value === 'OPEN') {
      for (const buffer of bufferedData) wsRef.value.send(buffer);
      bufferedData = [];
    }
  };
  const resetHeartbeat = () => {
    clearTimeout(pongTimeoutWait);
    pongTimeoutWait = void 0;
  };
  const close = (code = 1e3, reason) => {
    if (!isClient || !wsRef.value) return;
    explicitlyClosed = true;
    resetHeartbeat();
    heartbeatPause == null ? void 0 : heartbeatPause();
    wsRef.value.close(code, reason);
    wsRef.value = void 0;
  };
  const send = (data2, useBuffer = true) => {
    if (!wsRef.value || status.value !== 'OPEN') {
      if (useBuffer) bufferedData.push(data2);
      return false;
    }
    _sendBuffer();
    wsRef.value.send(data2);
    return true;
  };
  const _init = () => {
    if (explicitlyClosed || typeof urlRef.value === 'undefined') return;
    const ws = new WebSocket(urlRef.value, protocols);
    wsRef.value = ws;
    status.value = 'CONNECTING';
    ws.onopen = () => {
      status.value = 'OPEN';
      onConnected == null ? void 0 : onConnected(ws);
      heartbeatResume == null ? void 0 : heartbeatResume();
      _sendBuffer();
    };
    ws.onclose = (ev) => {
      status.value = 'CLOSED';
      onDisconnected == null ? void 0 : onDisconnected(ws, ev);
      if (!explicitlyClosed && options.autoReconnect) {
        const {
          retries = -1,
          delay = 1e3,
          onFailed,
        } = resolveNestedOptions(options.autoReconnect);
        retried += 1;
        if (typeof retries === 'number' && (retries < 0 || retried < retries))
          setTimeout(_init, delay);
        else if (typeof retries === 'function' && retries())
          setTimeout(_init, delay);
        else onFailed == null ? void 0 : onFailed();
      }
    };
    ws.onerror = (e) => {
      onError == null ? void 0 : onError(ws, e);
    };
    ws.onmessage = (e) => {
      if (options.heartbeat) {
        resetHeartbeat();
        const { message = DEFAULT_PING_MESSAGE } = resolveNestedOptions(
          options.heartbeat,
        );
        if (e.data === message) return;
      }
      data.value = e.data;
      onMessage == null ? void 0 : onMessage(ws, e);
    };
  };
  if (options.heartbeat) {
    const {
      message = DEFAULT_PING_MESSAGE,
      interval = 1e3,
      pongTimeout = 1e3,
    } = resolveNestedOptions(options.heartbeat);
    const { pause, resume } = useIntervalFn(
      () => {
        send(message, false);
        if (pongTimeoutWait != null) return;
        pongTimeoutWait = setTimeout(() => {
          close();
          explicitlyClosed = false;
        }, pongTimeout);
      },
      interval,
      { immediate: false },
    );
    heartbeatPause = pause;
    heartbeatResume = resume;
  }
  if (autoClose) {
    if (isClient) useEventListener('beforeunload', () => close());
    tryOnScopeDispose(close);
  }
  const open = () => {
    if (!isClient && !isWorker) return;
    close();
    explicitlyClosed = false;
    retried = 0;
    _init();
  };
  if (immediate) open();
  return {
    data,
    status,
    close,
    send,
    open,
    ws: wsRef,
  };
}
function useWebWorker(arg0, workerOptions, options) {
  const { window: window2 = defaultWindow } = options != null ? options : {};
  const data = ref(null);
  const worker = shallowRef();
  const post = (...args) => {
    if (!worker.value) return;
    worker.value.postMessage(...args);
  };
  const terminate = function terminate2() {
    if (!worker.value) return;
    worker.value.terminate();
  };
  if (window2) {
    if (typeof arg0 === 'string')
      worker.value = new Worker(arg0, workerOptions);
    else if (typeof arg0 === 'function') worker.value = arg0();
    else worker.value = arg0;
    worker.value.onmessage = (e) => {
      data.value = e.data;
    };
    tryOnScopeDispose(() => {
      if (worker.value) worker.value.terminate();
    });
  }
  return {
    data,
    post,
    terminate,
    worker,
  };
}
function jobRunner(userFunc) {
  return (e) => {
    const userFuncArgs = e.data[0];
    return Promise.resolve(userFunc.apply(void 0, userFuncArgs))
      .then((result) => {
        postMessage(['SUCCESS', result]);
      })
      .catch((error) => {
        postMessage(['ERROR', error]);
      });
  };
}
function depsParser(deps) {
  if (deps.length === 0) return '';
  const depsString = deps.map((dep) => `'${dep}'`).toString();
  return `importScripts(${depsString})`;
}
function createWorkerBlobUrl(fn, deps) {
  const blobCode = `${depsParser(deps)}; onmessage=(${jobRunner})(${fn})`;
  const blob = new Blob([blobCode], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  return url;
}
function useWebWorkerFn(fn, options = {}) {
  const {
    dependencies = [],
    timeout,
    window: window2 = defaultWindow,
  } = options;
  const worker = ref();
  const workerStatus = ref('PENDING');
  const promise = ref({});
  const timeoutId = ref();
  const workerTerminate = (status = 'PENDING') => {
    if (worker.value && worker.value._url && window2) {
      worker.value.terminate();
      URL.revokeObjectURL(worker.value._url);
      promise.value = {};
      worker.value = void 0;
      window2.clearTimeout(timeoutId.value);
      workerStatus.value = status;
    }
  };
  workerTerminate();
  tryOnScopeDispose(workerTerminate);
  const generateWorker = () => {
    const blobUrl = createWorkerBlobUrl(fn, dependencies);
    const newWorker = new Worker(blobUrl);
    newWorker._url = blobUrl;
    newWorker.onmessage = (e) => {
      const { resolve = () => {}, reject = () => {} } = promise.value;
      const [status, result] = e.data;
      switch (status) {
        case 'SUCCESS':
          resolve(result);
          workerTerminate(status);
          break;
        default:
          reject(result);
          workerTerminate('ERROR');
          break;
      }
    };
    newWorker.onerror = (e) => {
      const { reject = () => {} } = promise.value;
      e.preventDefault();
      reject(e);
      workerTerminate('ERROR');
    };
    if (timeout) {
      timeoutId.value = setTimeout(
        () => workerTerminate('TIMEOUT_EXPIRED'),
        timeout,
      );
    }
    return newWorker;
  };
  const callWorker = (...fnArgs) =>
    new Promise((resolve, reject) => {
      promise.value = {
        resolve,
        reject,
      };
      worker.value && worker.value.postMessage([[...fnArgs]]);
      workerStatus.value = 'RUNNING';
    });
  const workerFn = (...fnArgs) => {
    if (workerStatus.value === 'RUNNING') {
      console.error(
        '[useWebWorkerFn] You can only run one instance of the worker at a time.',
      );
      return Promise.reject();
    }
    worker.value = generateWorker();
    return callWorker(...fnArgs);
  };
  return {
    workerFn,
    workerStatus,
    workerTerminate,
  };
}
function useWindowFocus(options = {}) {
  const { window: window2 = defaultWindow } = options;
  if (!window2) return ref(false);
  const focused = ref(window2.document.hasFocus());
  useEventListener(window2, 'blur', () => {
    focused.value = false;
  });
  useEventListener(window2, 'focus', () => {
    focused.value = true;
  });
  return focused;
}
function useWindowScroll(options = {}) {
  const { window: window2 = defaultWindow, behavior = 'auto' } = options;
  if (!window2) {
    return {
      x: ref(0),
      y: ref(0),
    };
  }
  const internalX = ref(window2.scrollX);
  const internalY = ref(window2.scrollY);
  const x = computed({
    get() {
      return internalX.value;
    },
    set(x2) {
      scrollTo({ left: x2, behavior });
    },
  });
  const y = computed({
    get() {
      return internalY.value;
    },
    set(y2) {
      scrollTo({ top: y2, behavior });
    },
  });
  useEventListener(
    window2,
    'scroll',
    () => {
      internalX.value = window2.scrollX;
      internalY.value = window2.scrollY;
    },
    {
      capture: false,
      passive: true,
    },
  );
  return { x, y };
}
function useWindowSize(options = {}) {
  const {
    window: window2 = defaultWindow,
    initialWidth = Number.POSITIVE_INFINITY,
    initialHeight = Number.POSITIVE_INFINITY,
    listenOrientation = true,
    includeScrollbar = true,
  } = options;
  const width = ref(initialWidth);
  const height = ref(initialHeight);
  const update = () => {
    if (window2) {
      if (includeScrollbar) {
        width.value = window2.innerWidth;
        height.value = window2.innerHeight;
      } else {
        width.value = window2.document.documentElement.clientWidth;
        height.value = window2.document.documentElement.clientHeight;
      }
    }
  };
  update();
  tryOnMounted(update);
  useEventListener('resize', update, { passive: true });
  if (listenOrientation) {
    const matches = useMediaQuery('(orientation: portrait)');
    watch(matches, () => update());
  }
  return { width, height };
}
export {
  DefaultMagicKeysAliasMap,
  StorageSerializers,
  TransitionPresets,
  assert,
  computedAsync as asyncComputed,
  refAutoReset as autoResetRef,
  breakpointsAntDesign,
  breakpointsBootstrapV5,
  breakpointsMasterCss,
  breakpointsPrimeFlex,
  breakpointsQuasar,
  breakpointsSematic,
  breakpointsTailwind,
  breakpointsVuetify,
  breakpointsVuetifyV2,
  breakpointsVuetifyV3,
  bypassFilter,
  camelize,
  clamp,
  cloneFnJSON,
  computedAsync,
  computedEager,
  computedInject,
  computedWithControl,
  containsProp,
  computedWithControl as controlledComputed,
  controlledRef,
  createEventHook,
  createFetch,
  createFilterWrapper,
  createGlobalState,
  createInjectionState,
  reactify as createReactiveFn,
  createReusableTemplate,
  createSharedComposable,
  createSingletonPromise,
  createTemplatePromise,
  createUnrefFn,
  customStorageEventName,
  debounceFilter,
  refDebounced as debouncedRef,
  watchDebounced as debouncedWatch,
  defaultDocument,
  defaultLocation,
  defaultNavigator,
  defaultWindow,
  directiveHooks,
  computedEager as eagerComputed,
  executeTransition,
  extendRef,
  formatDate,
  formatTimeAgo,
  get,
  getLifeCycleTarget,
  getSSRHandler,
  hasOwn,
  hyphenate,
  identity,
  watchIgnorable as ignorableWatch,
  increaseWithUnit,
  injectLocal,
  invoke,
  isClient,
  isDef,
  isDefined,
  isIOS,
  isObject,
  isWorker,
  makeDestructurable,
  mapGamepadToXbox360Controller,
  noop,
  normalizeDate,
  notNullish,
  now,
  objectEntries,
  objectOmit,
  objectPick,
  onClickOutside,
  onKeyDown,
  onKeyPressed,
  onKeyStroke,
  onKeyUp,
  onLongPress,
  onStartTyping,
  pausableFilter,
  watchPausable as pausableWatch,
  promiseTimeout,
  provideLocal,
  rand,
  reactify,
  reactifyObject,
  reactiveComputed,
  reactiveOmit,
  reactivePick,
  refAutoReset,
  refDebounced,
  refDefault,
  refThrottled,
  refWithControl,
  resolveRef,
  resolveUnref,
  set2 as set,
  setSSRHandler,
  syncRef,
  syncRefs,
  templateRef,
  throttleFilter,
  refThrottled as throttledRef,
  watchThrottled as throttledWatch,
  timestamp,
  toReactive,
  toRef2 as toRef,
  toRefs2 as toRefs,
  toValue,
  tryOnBeforeMount,
  tryOnBeforeUnmount,
  tryOnMounted,
  tryOnScopeDispose,
  tryOnUnmounted,
  unrefElement,
  until,
  useActiveElement,
  useAnimate,
  useArrayDifference,
  useArrayEvery,
  useArrayFilter,
  useArrayFind,
  useArrayFindIndex,
  useArrayFindLast,
  useArrayIncludes,
  useArrayJoin,
  useArrayMap,
  useArrayReduce,
  useArraySome,
  useArrayUnique,
  useAsyncQueue,
  useAsyncState,
  useBase64,
  useBattery,
  useBluetooth,
  useBreakpoints,
  useBroadcastChannel,
  useBrowserLocation,
  useCached,
  useClipboard,
  useClipboardItems,
  useCloned,
  useColorMode,
  useConfirmDialog,
  useCounter,
  useCssVar,
  useCurrentElement,
  useCycleList,
  useDark,
  useDateFormat,
  refDebounced as useDebounce,
  useDebounceFn,
  useDebouncedRefHistory,
  useDeviceMotion,
  useDeviceOrientation,
  useDevicePixelRatio,
  useDevicesList,
  useDisplayMedia,
  useDocumentVisibility,
  useDraggable,
  useDropZone,
  useElementBounding,
  useElementByPoint,
  useElementHover,
  useElementSize,
  useElementVisibility,
  useEventBus,
  useEventListener,
  useEventSource,
  useEyeDropper,
  useFavicon,
  useFetch,
  useFileDialog,
  useFileSystemAccess,
  useFocus,
  useFocusWithin,
  useFps,
  useFullscreen,
  useGamepad,
  useGeolocation,
  useIdle,
  useImage,
  useInfiniteScroll,
  useIntersectionObserver,
  useInterval,
  useIntervalFn,
  useKeyModifier,
  useLastChanged,
  useLocalStorage,
  useMagicKeys,
  useManualRefHistory,
  useMediaControls,
  useMediaQuery,
  useMemoize,
  useMemory,
  useMounted,
  useMouse,
  useMouseInElement,
  useMousePressed,
  useMutationObserver,
  useNavigatorLanguage,
  useNetwork,
  useNow,
  useObjectUrl,
  useOffsetPagination,
  useOnline,
  usePageLeave,
  useParallax,
  useParentElement,
  usePerformanceObserver,
  usePermission,
  usePointer,
  usePointerLock,
  usePointerSwipe,
  usePreferredColorScheme,
  usePreferredContrast,
  usePreferredDark,
  usePreferredLanguages,
  usePreferredReducedMotion,
  usePrevious,
  useRafFn,
  useRefHistory,
  useResizeObserver,
  useScreenOrientation,
  useScreenSafeArea,
  useScriptTag,
  useScroll,
  useScrollLock,
  useSessionStorage,
  useShare,
  useSorted,
  useSpeechRecognition,
  useSpeechSynthesis,
  useStepper,
  useStorage,
  useStorageAsync,
  useStyleTag,
  useSupported,
  useSwipe,
  useTemplateRefsList,
  useTextDirection,
  useTextSelection,
  useTextareaAutosize,
  refThrottled as useThrottle,
  useThrottleFn,
  useThrottledRefHistory,
  useTimeAgo,
  useTimeout,
  useTimeoutFn,
  useTimeoutPoll,
  useTimestamp,
  useTitle,
  useToNumber,
  useToString,
  useToggle,
  useTransition,
  useUrlSearchParams,
  useUserMedia,
  useVModel,
  useVModels,
  useVibrate,
  useVirtualList,
  useWakeLock,
  useWebNotification,
  useWebSocket,
  useWebWorker,
  useWebWorkerFn,
  useWindowFocus,
  useWindowScroll,
  useWindowSize,
  watchArray,
  watchAtMost,
  watchDebounced,
  watchDeep,
  watchIgnorable,
  watchImmediate,
  watchOnce,
  watchPausable,
  watchThrottled,
  watchTriggerable,
  watchWithFilter,
  whenever,
};
/*! Bundled license information:

vitepress/lib/vue-demi.mjs:
  (**
   * vue-demi v0.14.7
   * Copyright (c) 2020-present, Anthony Fu
   * @license MIT
   *)
*/
//# sourceMappingURL=vitepress___@vueuse_core.js.map
