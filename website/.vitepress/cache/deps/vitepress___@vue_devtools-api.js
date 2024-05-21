import { isReactive, isRef, toRaw } from './chunk-Z6W6QRLO.js';

// ../node_modules/.pnpm/@vue+devtools-shared@7.2.1/node_modules/@vue/devtools-shared/dist/index.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) =>
  function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])((fn = 0))), res;
  };
var __commonJS = (cb, mod) =>
  function __require() {
    return (
      mod ||
        (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod),
      mod.exports
    );
  };
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === 'object') || typeof from === 'function') {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target2) => (
  (target2 = mod != null ? __create(__getProtoOf(mod)) : {}),
  __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule
      ? __defProp(target2, 'default', { value: mod, enumerable: true })
      : target2,
    mod,
  )
);
var init_esm_shims = __esm({
  '../../node_modules/.pnpm/tsup@8.0.2_@microsoft+api-extractor@7.43.0_@types+node@20.12.12__postcss@8.4.38_typescript@5.4.5/node_modules/tsup/assets/esm_shims.js'() {
    'use strict';
  },
});
var require_rfdc = __commonJS({
  '../../node_modules/.pnpm/rfdc@1.3.1/node_modules/rfdc/index.js'(
    exports,
    module,
  ) {
    'use strict';
    init_esm_shims();
    module.exports = rfdc2;
    function copyBuffer(cur) {
      if (cur instanceof Buffer) {
        return Buffer.from(cur);
      }
      return new cur.constructor(
        cur.buffer.slice(),
        cur.byteOffset,
        cur.length,
      );
    }
    function rfdc2(opts) {
      opts = opts || {};
      if (opts.circles) return rfdcCircles(opts);
      return opts.proto ? cloneProto : clone;
      function cloneArray(a, fn) {
        var keys = Object.keys(a);
        var a2 = new Array(keys.length);
        for (var i = 0; i < keys.length; i++) {
          var k = keys[i];
          var cur = a[k];
          if (typeof cur !== 'object' || cur === null) {
            a2[k] = cur;
          } else if (cur instanceof Date) {
            a2[k] = new Date(cur);
          } else if (ArrayBuffer.isView(cur)) {
            a2[k] = copyBuffer(cur);
          } else {
            a2[k] = fn(cur);
          }
        }
        return a2;
      }
      function clone(o) {
        if (typeof o !== 'object' || o === null) return o;
        if (o instanceof Date) return new Date(o);
        if (Array.isArray(o)) return cloneArray(o, clone);
        if (o instanceof Map) return new Map(cloneArray(Array.from(o), clone));
        if (o instanceof Set) return new Set(cloneArray(Array.from(o), clone));
        var o2 = {};
        for (var k in o) {
          if (Object.hasOwnProperty.call(o, k) === false) continue;
          var cur = o[k];
          if (typeof cur !== 'object' || cur === null) {
            o2[k] = cur;
          } else if (cur instanceof Date) {
            o2[k] = new Date(cur);
          } else if (cur instanceof Map) {
            o2[k] = new Map(cloneArray(Array.from(cur), clone));
          } else if (cur instanceof Set) {
            o2[k] = new Set(cloneArray(Array.from(cur), clone));
          } else if (ArrayBuffer.isView(cur)) {
            o2[k] = copyBuffer(cur);
          } else {
            o2[k] = clone(cur);
          }
        }
        return o2;
      }
      function cloneProto(o) {
        if (typeof o !== 'object' || o === null) return o;
        if (o instanceof Date) return new Date(o);
        if (Array.isArray(o)) return cloneArray(o, cloneProto);
        if (o instanceof Map)
          return new Map(cloneArray(Array.from(o), cloneProto));
        if (o instanceof Set)
          return new Set(cloneArray(Array.from(o), cloneProto));
        var o2 = {};
        for (var k in o) {
          var cur = o[k];
          if (typeof cur !== 'object' || cur === null) {
            o2[k] = cur;
          } else if (cur instanceof Date) {
            o2[k] = new Date(cur);
          } else if (cur instanceof Map) {
            o2[k] = new Map(cloneArray(Array.from(cur), cloneProto));
          } else if (cur instanceof Set) {
            o2[k] = new Set(cloneArray(Array.from(cur), cloneProto));
          } else if (ArrayBuffer.isView(cur)) {
            o2[k] = copyBuffer(cur);
          } else {
            o2[k] = cloneProto(cur);
          }
        }
        return o2;
      }
    }
    function rfdcCircles(opts) {
      var refs = [];
      var refsNew = [];
      return opts.proto ? cloneProto : clone;
      function cloneArray(a, fn) {
        var keys = Object.keys(a);
        var a2 = new Array(keys.length);
        for (var i = 0; i < keys.length; i++) {
          var k = keys[i];
          var cur = a[k];
          if (typeof cur !== 'object' || cur === null) {
            a2[k] = cur;
          } else if (cur instanceof Date) {
            a2[k] = new Date(cur);
          } else if (ArrayBuffer.isView(cur)) {
            a2[k] = copyBuffer(cur);
          } else {
            var index = refs.indexOf(cur);
            if (index !== -1) {
              a2[k] = refsNew[index];
            } else {
              a2[k] = fn(cur);
            }
          }
        }
        return a2;
      }
      function clone(o) {
        if (typeof o !== 'object' || o === null) return o;
        if (o instanceof Date) return new Date(o);
        if (Array.isArray(o)) return cloneArray(o, clone);
        if (o instanceof Map) return new Map(cloneArray(Array.from(o), clone));
        if (o instanceof Set) return new Set(cloneArray(Array.from(o), clone));
        var o2 = {};
        refs.push(o);
        refsNew.push(o2);
        for (var k in o) {
          if (Object.hasOwnProperty.call(o, k) === false) continue;
          var cur = o[k];
          if (typeof cur !== 'object' || cur === null) {
            o2[k] = cur;
          } else if (cur instanceof Date) {
            o2[k] = new Date(cur);
          } else if (cur instanceof Map) {
            o2[k] = new Map(cloneArray(Array.from(cur), clone));
          } else if (cur instanceof Set) {
            o2[k] = new Set(cloneArray(Array.from(cur), clone));
          } else if (ArrayBuffer.isView(cur)) {
            o2[k] = copyBuffer(cur);
          } else {
            var i = refs.indexOf(cur);
            if (i !== -1) {
              o2[k] = refsNew[i];
            } else {
              o2[k] = clone(cur);
            }
          }
        }
        refs.pop();
        refsNew.pop();
        return o2;
      }
      function cloneProto(o) {
        if (typeof o !== 'object' || o === null) return o;
        if (o instanceof Date) return new Date(o);
        if (Array.isArray(o)) return cloneArray(o, cloneProto);
        if (o instanceof Map)
          return new Map(cloneArray(Array.from(o), cloneProto));
        if (o instanceof Set)
          return new Set(cloneArray(Array.from(o), cloneProto));
        var o2 = {};
        refs.push(o);
        refsNew.push(o2);
        for (var k in o) {
          var cur = o[k];
          if (typeof cur !== 'object' || cur === null) {
            o2[k] = cur;
          } else if (cur instanceof Date) {
            o2[k] = new Date(cur);
          } else if (cur instanceof Map) {
            o2[k] = new Map(cloneArray(Array.from(cur), cloneProto));
          } else if (cur instanceof Set) {
            o2[k] = new Set(cloneArray(Array.from(cur), cloneProto));
          } else if (ArrayBuffer.isView(cur)) {
            o2[k] = copyBuffer(cur);
          } else {
            var i = refs.indexOf(cur);
            if (i !== -1) {
              o2[k] = refsNew[i];
            } else {
              o2[k] = cloneProto(cur);
            }
          }
        }
        refs.pop();
        refsNew.pop();
        return o2;
      }
    }
  },
});
init_esm_shims();
init_esm_shims();
var isBrowser = typeof navigator !== 'undefined';
var target =
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
        ? global
        : {};
var isInChromePanel =
  typeof target.chrome !== 'undefined' && !!target.chrome.devtools;
var isInIframe = isBrowser && target.self !== target.top;
var isInElectron =
  typeof navigator !== 'undefined' &&
  navigator.userAgent.toLowerCase().includes('electron');
var isNuxtApp = typeof window !== 'undefined' && !!window.__NUXT__;
init_esm_shims();
var import_rfdc = __toESM(require_rfdc(), 1);
var deepClone = (0, import_rfdc.default)({ circles: true });
init_esm_shims();

// ../node_modules/.pnpm/hookable@5.5.3/node_modules/hookable/dist/index.mjs
function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === 'object' && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === 'function') {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
var defaultTask = { run: (function_) => function_() };
var _createTask = () => defaultTask;
var createTask =
  typeof console.createTask !== 'undefined' ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) =>
      promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve(),
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook2) => task.run(() => hook2(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}
var Hookable = class {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== 'function') {
      return () => {};
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message =
          `${originalName} hook has been deprecated` +
          (dep.to ? `, please use ${dep.to}` : '');
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, 'name', {
          get: () => '_' + name.replace(/\W+/g, '_') + '_hook_cb',
          configurable: true,
        });
      } catch {}
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === 'function') {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] =
      typeof deprecated === 'string' ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook2 of _hooks) {
      this.hook(name, hook2);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map((key) =>
      this.hook(key, hooks[key]),
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event =
      this._before || this._after
        ? { name, args: arguments_, context: {} }
        : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_,
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
};
function createHooks() {
  return new Hookable();
}

// ../node_modules/.pnpm/perfect-debounce@1.0.0/node_modules/perfect-debounce/dist/index.mjs
var DEBOUNCE_DEFAULTS = {
  trailing: true,
};
function debounce(fn, wait = 25, options = {}) {
  options = { ...DEBOUNCE_DEFAULTS, ...options };
  if (!Number.isFinite(wait)) {
    throw new TypeError('Expected `wait` to be a finite number');
  }
  let leadingValue;
  let timeout;
  let resolveList = [];
  let currentPromise;
  let trailingArgs;
  const applyFn = (_this, args) => {
    currentPromise = _applyPromised(fn, _this, args);
    currentPromise.finally(() => {
      currentPromise = null;
      if (options.trailing && trailingArgs && !timeout) {
        const promise = applyFn(_this, trailingArgs);
        trailingArgs = null;
        return promise;
      }
    });
    return currentPromise;
  };
  return function (...args) {
    if (currentPromise) {
      if (options.trailing) {
        trailingArgs = args;
      }
      return currentPromise;
    }
    return new Promise((resolve) => {
      const shouldCallNow = !timeout && options.leading;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        const promise = options.leading ? leadingValue : applyFn(this, args);
        for (const _resolve of resolveList) {
          _resolve(promise);
        }
        resolveList = [];
      }, wait);
      if (shouldCallNow) {
        leadingValue = applyFn(this, args);
        resolve(leadingValue);
      } else {
        resolveList.push(resolve);
      }
    });
  };
}
async function _applyPromised(fn, _this, args) {
  return await fn.apply(_this, args);
}

// ../node_modules/.pnpm/@vue+devtools-kit@7.2.1_vue@3.4.27_typescript@5.4.5_/node_modules/@vue/devtools-kit/dist/index.js
var __create2 = Object.create;
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames2 = Object.getOwnPropertyNames;
var __getProtoOf2 = Object.getPrototypeOf;
var __hasOwnProp2 = Object.prototype.hasOwnProperty;
var __esm2 = (fn, res) =>
  function __init() {
    return fn && (res = (0, fn[__getOwnPropNames2(fn)[0]])((fn = 0))), res;
  };
var __commonJS2 = (cb, mod) =>
  function __require() {
    return (
      mod ||
        (0, cb[__getOwnPropNames2(cb)[0]])(
          (mod = { exports: {} }).exports,
          mod,
        ),
      mod.exports
    );
  };
var __copyProps2 = (to, from, except, desc) => {
  if ((from && typeof from === 'object') || typeof from === 'function') {
    for (let key of __getOwnPropNames2(from))
      if (!__hasOwnProp2.call(to, key) && key !== except)
        __defProp2(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable,
        });
  }
  return to;
};
var __toESM2 = (mod, isNodeMode, target10) => (
  (target10 = mod != null ? __create2(__getProtoOf2(mod)) : {}),
  __copyProps2(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule
      ? __defProp2(target10, 'default', { value: mod, enumerable: true })
      : target10,
    mod,
  )
);
var init_esm_shims2 = __esm2({
  '../../node_modules/.pnpm/tsup@8.0.2_@microsoft+api-extractor@7.43.0_@types+node@20.12.12__postcss@8.4.38_typescript@5.4.5/node_modules/tsup/assets/esm_shims.js'() {
    'use strict';
  },
});
var require_speakingurl = __commonJS2({
  '../../node_modules/.pnpm/speakingurl@14.0.1/node_modules/speakingurl/lib/speakingurl.js'(
    exports,
    module,
  ) {
    'use strict';
    init_esm_shims2();
    (function (root) {
      'use strict';
      var charMap = {
        // latin
        À: 'A',
        Á: 'A',
        Â: 'A',
        Ã: 'A',
        Ä: 'Ae',
        Å: 'A',
        Æ: 'AE',
        Ç: 'C',
        È: 'E',
        É: 'E',
        Ê: 'E',
        Ë: 'E',
        Ì: 'I',
        Í: 'I',
        Î: 'I',
        Ï: 'I',
        Ð: 'D',
        Ñ: 'N',
        Ò: 'O',
        Ó: 'O',
        Ô: 'O',
        Õ: 'O',
        Ö: 'Oe',
        Ő: 'O',
        Ø: 'O',
        Ù: 'U',
        Ú: 'U',
        Û: 'U',
        Ü: 'Ue',
        Ű: 'U',
        Ý: 'Y',
        Þ: 'TH',
        ß: 'ss',
        à: 'a',
        á: 'a',
        â: 'a',
        ã: 'a',
        ä: 'ae',
        å: 'a',
        æ: 'ae',
        ç: 'c',
        è: 'e',
        é: 'e',
        ê: 'e',
        ë: 'e',
        ì: 'i',
        í: 'i',
        î: 'i',
        ï: 'i',
        ð: 'd',
        ñ: 'n',
        ò: 'o',
        ó: 'o',
        ô: 'o',
        õ: 'o',
        ö: 'oe',
        ő: 'o',
        ø: 'o',
        ù: 'u',
        ú: 'u',
        û: 'u',
        ü: 'ue',
        ű: 'u',
        ý: 'y',
        þ: 'th',
        ÿ: 'y',
        ẞ: 'SS',
        // language specific
        // Arabic
        ا: 'a',
        أ: 'a',
        إ: 'i',
        آ: 'aa',
        ؤ: 'u',
        ئ: 'e',
        ء: 'a',
        ب: 'b',
        ت: 't',
        ث: 'th',
        ج: 'j',
        ح: 'h',
        خ: 'kh',
        د: 'd',
        ذ: 'th',
        ر: 'r',
        ز: 'z',
        س: 's',
        ش: 'sh',
        ص: 's',
        ض: 'dh',
        ط: 't',
        ظ: 'z',
        ع: 'a',
        غ: 'gh',
        ف: 'f',
        ق: 'q',
        ك: 'k',
        ل: 'l',
        م: 'm',
        ن: 'n',
        ه: 'h',
        و: 'w',
        ي: 'y',
        ى: 'a',
        ة: 'h',
        ﻻ: 'la',
        ﻷ: 'laa',
        ﻹ: 'lai',
        ﻵ: 'laa',
        // Persian additional characters than Arabic
        گ: 'g',
        چ: 'ch',
        پ: 'p',
        ژ: 'zh',
        ک: 'k',
        ی: 'y',
        // Arabic diactrics
        'َ': 'a',
        'ً': 'an',
        'ِ': 'e',
        'ٍ': 'en',
        'ُ': 'u',
        'ٌ': 'on',
        'ْ': '',
        // Arabic numbers
        '٠': '0',
        '١': '1',
        '٢': '2',
        '٣': '3',
        '٤': '4',
        '٥': '5',
        '٦': '6',
        '٧': '7',
        '٨': '8',
        '٩': '9',
        // Persian numbers
        '۰': '0',
        '۱': '1',
        '۲': '2',
        '۳': '3',
        '۴': '4',
        '۵': '5',
        '۶': '6',
        '۷': '7',
        '۸': '8',
        '۹': '9',
        // Burmese consonants
        က: 'k',
        ခ: 'kh',
        ဂ: 'g',
        ဃ: 'ga',
        င: 'ng',
        စ: 's',
        ဆ: 'sa',
        ဇ: 'z',
        စျ: 'za',
        ည: 'ny',
        ဋ: 't',
        ဌ: 'ta',
        ဍ: 'd',
        ဎ: 'da',
        ဏ: 'na',
        တ: 't',
        ထ: 'ta',
        ဒ: 'd',
        ဓ: 'da',
        န: 'n',
        ပ: 'p',
        ဖ: 'pa',
        ဗ: 'b',
        ဘ: 'ba',
        မ: 'm',
        ယ: 'y',
        ရ: 'ya',
        လ: 'l',
        ဝ: 'w',
        သ: 'th',
        ဟ: 'h',
        ဠ: 'la',
        အ: 'a',
        // consonant character combos
        'ြ': 'y',
        'ျ': 'ya',
        'ွ': 'w',
        'ြွ': 'yw',
        'ျွ': 'ywa',
        'ှ': 'h',
        // independent vowels
        ဧ: 'e',
        '၏': '-e',
        ဣ: 'i',
        ဤ: '-i',
        ဉ: 'u',
        ဦ: '-u',
        ဩ: 'aw',
        သြော: 'aw',
        ဪ: 'aw',
        // numbers
        '၀': '0',
        '၁': '1',
        '၂': '2',
        '၃': '3',
        '၄': '4',
        '၅': '5',
        '၆': '6',
        '၇': '7',
        '၈': '8',
        '၉': '9',
        // virama and tone marks which are silent in transliteration
        '္': '',
        '့': '',
        'း': '',
        // Czech
        č: 'c',
        ď: 'd',
        ě: 'e',
        ň: 'n',
        ř: 'r',
        š: 's',
        ť: 't',
        ů: 'u',
        ž: 'z',
        Č: 'C',
        Ď: 'D',
        Ě: 'E',
        Ň: 'N',
        Ř: 'R',
        Š: 'S',
        Ť: 'T',
        Ů: 'U',
        Ž: 'Z',
        // Dhivehi
        ހ: 'h',
        ށ: 'sh',
        ނ: 'n',
        ރ: 'r',
        ބ: 'b',
        ޅ: 'lh',
        ކ: 'k',
        އ: 'a',
        ވ: 'v',
        މ: 'm',
        ފ: 'f',
        ދ: 'dh',
        ތ: 'th',
        ލ: 'l',
        ގ: 'g',
        ޏ: 'gn',
        ސ: 's',
        ޑ: 'd',
        ޒ: 'z',
        ޓ: 't',
        ޔ: 'y',
        ޕ: 'p',
        ޖ: 'j',
        ޗ: 'ch',
        ޘ: 'tt',
        ޙ: 'hh',
        ޚ: 'kh',
        ޛ: 'th',
        ޜ: 'z',
        ޝ: 'sh',
        ޞ: 's',
        ޟ: 'd',
        ޠ: 't',
        ޡ: 'z',
        ޢ: 'a',
        ޣ: 'gh',
        ޤ: 'q',
        ޥ: 'w',
        'ަ': 'a',
        'ާ': 'aa',
        'ި': 'i',
        'ީ': 'ee',
        'ު': 'u',
        'ޫ': 'oo',
        'ެ': 'e',
        'ޭ': 'ey',
        'ޮ': 'o',
        'ޯ': 'oa',
        'ް': '',
        // Georgian https://en.wikipedia.org/wiki/Romanization_of_Georgian
        // National system (2002)
        ა: 'a',
        ბ: 'b',
        გ: 'g',
        დ: 'd',
        ე: 'e',
        ვ: 'v',
        ზ: 'z',
        თ: 't',
        ი: 'i',
        კ: 'k',
        ლ: 'l',
        მ: 'm',
        ნ: 'n',
        ო: 'o',
        პ: 'p',
        ჟ: 'zh',
        რ: 'r',
        ს: 's',
        ტ: 't',
        უ: 'u',
        ფ: 'p',
        ქ: 'k',
        ღ: 'gh',
        ყ: 'q',
        შ: 'sh',
        ჩ: 'ch',
        ც: 'ts',
        ძ: 'dz',
        წ: 'ts',
        ჭ: 'ch',
        ხ: 'kh',
        ჯ: 'j',
        ჰ: 'h',
        // Greek
        α: 'a',
        β: 'v',
        γ: 'g',
        δ: 'd',
        ε: 'e',
        ζ: 'z',
        η: 'i',
        θ: 'th',
        ι: 'i',
        κ: 'k',
        λ: 'l',
        μ: 'm',
        ν: 'n',
        ξ: 'ks',
        ο: 'o',
        π: 'p',
        ρ: 'r',
        σ: 's',
        τ: 't',
        υ: 'y',
        φ: 'f',
        χ: 'x',
        ψ: 'ps',
        ω: 'o',
        ά: 'a',
        έ: 'e',
        ί: 'i',
        ό: 'o',
        ύ: 'y',
        ή: 'i',
        ώ: 'o',
        ς: 's',
        ϊ: 'i',
        ΰ: 'y',
        ϋ: 'y',
        ΐ: 'i',
        Α: 'A',
        Β: 'B',
        Γ: 'G',
        Δ: 'D',
        Ε: 'E',
        Ζ: 'Z',
        Η: 'I',
        Θ: 'TH',
        Ι: 'I',
        Κ: 'K',
        Λ: 'L',
        Μ: 'M',
        Ν: 'N',
        Ξ: 'KS',
        Ο: 'O',
        Π: 'P',
        Ρ: 'R',
        Σ: 'S',
        Τ: 'T',
        Υ: 'Y',
        Φ: 'F',
        Χ: 'X',
        Ψ: 'PS',
        Ω: 'O',
        Ά: 'A',
        Έ: 'E',
        Ί: 'I',
        Ό: 'O',
        Ύ: 'Y',
        Ή: 'I',
        Ώ: 'O',
        Ϊ: 'I',
        Ϋ: 'Y',
        // Latvian
        ā: 'a',
        // 'č': 'c', // duplicate
        ē: 'e',
        ģ: 'g',
        ī: 'i',
        ķ: 'k',
        ļ: 'l',
        ņ: 'n',
        // 'š': 's', // duplicate
        ū: 'u',
        // 'ž': 'z', // duplicate
        Ā: 'A',
        // 'Č': 'C', // duplicate
        Ē: 'E',
        Ģ: 'G',
        Ī: 'I',
        Ķ: 'k',
        Ļ: 'L',
        Ņ: 'N',
        // 'Š': 'S', // duplicate
        Ū: 'U',
        // 'Ž': 'Z', // duplicate
        // Macedonian
        Ќ: 'Kj',
        ќ: 'kj',
        Љ: 'Lj',
        љ: 'lj',
        Њ: 'Nj',
        њ: 'nj',
        Тс: 'Ts',
        тс: 'ts',
        // Polish
        ą: 'a',
        ć: 'c',
        ę: 'e',
        ł: 'l',
        ń: 'n',
        // 'ó': 'o', // duplicate
        ś: 's',
        ź: 'z',
        ż: 'z',
        Ą: 'A',
        Ć: 'C',
        Ę: 'E',
        Ł: 'L',
        Ń: 'N',
        Ś: 'S',
        Ź: 'Z',
        Ż: 'Z',
        // Ukranian
        Є: 'Ye',
        І: 'I',
        Ї: 'Yi',
        Ґ: 'G',
        є: 'ye',
        і: 'i',
        ї: 'yi',
        ґ: 'g',
        // Romanian
        ă: 'a',
        Ă: 'A',
        ș: 's',
        Ș: 'S',
        // 'ş': 's', // duplicate
        // 'Ş': 'S', // duplicate
        ț: 't',
        Ț: 'T',
        ţ: 't',
        Ţ: 'T',
        // Russian https://en.wikipedia.org/wiki/Romanization_of_Russian
        // ICAO
        а: 'a',
        б: 'b',
        в: 'v',
        г: 'g',
        д: 'd',
        е: 'e',
        ё: 'yo',
        ж: 'zh',
        з: 'z',
        и: 'i',
        й: 'i',
        к: 'k',
        л: 'l',
        м: 'm',
        н: 'n',
        о: 'o',
        п: 'p',
        р: 'r',
        с: 's',
        т: 't',
        у: 'u',
        ф: 'f',
        х: 'kh',
        ц: 'c',
        ч: 'ch',
        ш: 'sh',
        щ: 'sh',
        ъ: '',
        ы: 'y',
        ь: '',
        э: 'e',
        ю: 'yu',
        я: 'ya',
        А: 'A',
        Б: 'B',
        В: 'V',
        Г: 'G',
        Д: 'D',
        Е: 'E',
        Ё: 'Yo',
        Ж: 'Zh',
        З: 'Z',
        И: 'I',
        Й: 'I',
        К: 'K',
        Л: 'L',
        М: 'M',
        Н: 'N',
        О: 'O',
        П: 'P',
        Р: 'R',
        С: 'S',
        Т: 'T',
        У: 'U',
        Ф: 'F',
        Х: 'Kh',
        Ц: 'C',
        Ч: 'Ch',
        Ш: 'Sh',
        Щ: 'Sh',
        Ъ: '',
        Ы: 'Y',
        Ь: '',
        Э: 'E',
        Ю: 'Yu',
        Я: 'Ya',
        // Serbian
        ђ: 'dj',
        ј: 'j',
        // 'љ': 'lj',  // duplicate
        // 'њ': 'nj', // duplicate
        ћ: 'c',
        џ: 'dz',
        Ђ: 'Dj',
        Ј: 'j',
        // 'Љ': 'Lj', // duplicate
        // 'Њ': 'Nj', // duplicate
        Ћ: 'C',
        Џ: 'Dz',
        // Slovak
        ľ: 'l',
        ĺ: 'l',
        ŕ: 'r',
        Ľ: 'L',
        Ĺ: 'L',
        Ŕ: 'R',
        // Turkish
        ş: 's',
        Ş: 'S',
        ı: 'i',
        İ: 'I',
        // 'ç': 'c', // duplicate
        // 'Ç': 'C', // duplicate
        // 'ü': 'u', // duplicate, see langCharMap
        // 'Ü': 'U', // duplicate, see langCharMap
        // 'ö': 'o', // duplicate, see langCharMap
        // 'Ö': 'O', // duplicate, see langCharMap
        ğ: 'g',
        Ğ: 'G',
        // Vietnamese
        ả: 'a',
        Ả: 'A',
        ẳ: 'a',
        Ẳ: 'A',
        ẩ: 'a',
        Ẩ: 'A',
        đ: 'd',
        Đ: 'D',
        ẹ: 'e',
        Ẹ: 'E',
        ẽ: 'e',
        Ẽ: 'E',
        ẻ: 'e',
        Ẻ: 'E',
        ế: 'e',
        Ế: 'E',
        ề: 'e',
        Ề: 'E',
        ệ: 'e',
        Ệ: 'E',
        ễ: 'e',
        Ễ: 'E',
        ể: 'e',
        Ể: 'E',
        ỏ: 'o',
        ọ: 'o',
        Ọ: 'o',
        ố: 'o',
        Ố: 'O',
        ồ: 'o',
        Ồ: 'O',
        ổ: 'o',
        Ổ: 'O',
        ộ: 'o',
        Ộ: 'O',
        ỗ: 'o',
        Ỗ: 'O',
        ơ: 'o',
        Ơ: 'O',
        ớ: 'o',
        Ớ: 'O',
        ờ: 'o',
        Ờ: 'O',
        ợ: 'o',
        Ợ: 'O',
        ỡ: 'o',
        Ỡ: 'O',
        Ở: 'o',
        ở: 'o',
        ị: 'i',
        Ị: 'I',
        ĩ: 'i',
        Ĩ: 'I',
        ỉ: 'i',
        Ỉ: 'i',
        ủ: 'u',
        Ủ: 'U',
        ụ: 'u',
        Ụ: 'U',
        ũ: 'u',
        Ũ: 'U',
        ư: 'u',
        Ư: 'U',
        ứ: 'u',
        Ứ: 'U',
        ừ: 'u',
        Ừ: 'U',
        ự: 'u',
        Ự: 'U',
        ữ: 'u',
        Ữ: 'U',
        ử: 'u',
        Ử: 'ư',
        ỷ: 'y',
        Ỷ: 'y',
        ỳ: 'y',
        Ỳ: 'Y',
        ỵ: 'y',
        Ỵ: 'Y',
        ỹ: 'y',
        Ỹ: 'Y',
        ạ: 'a',
        Ạ: 'A',
        ấ: 'a',
        Ấ: 'A',
        ầ: 'a',
        Ầ: 'A',
        ậ: 'a',
        Ậ: 'A',
        ẫ: 'a',
        Ẫ: 'A',
        // 'ă': 'a', // duplicate
        // 'Ă': 'A', // duplicate
        ắ: 'a',
        Ắ: 'A',
        ằ: 'a',
        Ằ: 'A',
        ặ: 'a',
        Ặ: 'A',
        ẵ: 'a',
        Ẵ: 'A',
        '⓪': '0',
        '①': '1',
        '②': '2',
        '③': '3',
        '④': '4',
        '⑤': '5',
        '⑥': '6',
        '⑦': '7',
        '⑧': '8',
        '⑨': '9',
        '⑩': '10',
        '⑪': '11',
        '⑫': '12',
        '⑬': '13',
        '⑭': '14',
        '⑮': '15',
        '⑯': '16',
        '⑰': '17',
        '⑱': '18',
        '⑲': '18',
        '⑳': '18',
        '⓵': '1',
        '⓶': '2',
        '⓷': '3',
        '⓸': '4',
        '⓹': '5',
        '⓺': '6',
        '⓻': '7',
        '⓼': '8',
        '⓽': '9',
        '⓾': '10',
        '⓿': '0',
        '⓫': '11',
        '⓬': '12',
        '⓭': '13',
        '⓮': '14',
        '⓯': '15',
        '⓰': '16',
        '⓱': '17',
        '⓲': '18',
        '⓳': '19',
        '⓴': '20',
        'Ⓐ': 'A',
        'Ⓑ': 'B',
        'Ⓒ': 'C',
        'Ⓓ': 'D',
        'Ⓔ': 'E',
        'Ⓕ': 'F',
        'Ⓖ': 'G',
        'Ⓗ': 'H',
        'Ⓘ': 'I',
        'Ⓙ': 'J',
        'Ⓚ': 'K',
        'Ⓛ': 'L',
        'Ⓜ': 'M',
        'Ⓝ': 'N',
        'Ⓞ': 'O',
        'Ⓟ': 'P',
        'Ⓠ': 'Q',
        'Ⓡ': 'R',
        'Ⓢ': 'S',
        'Ⓣ': 'T',
        'Ⓤ': 'U',
        'Ⓥ': 'V',
        'Ⓦ': 'W',
        'Ⓧ': 'X',
        'Ⓨ': 'Y',
        'Ⓩ': 'Z',
        'ⓐ': 'a',
        'ⓑ': 'b',
        'ⓒ': 'c',
        'ⓓ': 'd',
        'ⓔ': 'e',
        'ⓕ': 'f',
        'ⓖ': 'g',
        'ⓗ': 'h',
        'ⓘ': 'i',
        'ⓙ': 'j',
        'ⓚ': 'k',
        'ⓛ': 'l',
        'ⓜ': 'm',
        'ⓝ': 'n',
        'ⓞ': 'o',
        'ⓟ': 'p',
        'ⓠ': 'q',
        'ⓡ': 'r',
        'ⓢ': 's',
        'ⓣ': 't',
        'ⓤ': 'u',
        'ⓦ': 'v',
        'ⓥ': 'w',
        'ⓧ': 'x',
        'ⓨ': 'y',
        'ⓩ': 'z',
        // symbols
        '“': '"',
        '”': '"',
        '‘': "'",
        '’': "'",
        '∂': 'd',
        ƒ: 'f',
        '™': '(TM)',
        '©': '(C)',
        œ: 'oe',
        Œ: 'OE',
        '®': '(R)',
        '†': '+',
        '℠': '(SM)',
        '…': '...',
        '˚': 'o',
        º: 'o',
        ª: 'a',
        '•': '*',
        '၊': ',',
        '။': '.',
        // currency
        $: 'USD',
        '€': 'EUR',
        '₢': 'BRN',
        '₣': 'FRF',
        '£': 'GBP',
        '₤': 'ITL',
        '₦': 'NGN',
        '₧': 'ESP',
        '₩': 'KRW',
        '₪': 'ILS',
        '₫': 'VND',
        '₭': 'LAK',
        '₮': 'MNT',
        '₯': 'GRD',
        '₱': 'ARS',
        '₲': 'PYG',
        '₳': 'ARA',
        '₴': 'UAH',
        '₵': 'GHS',
        '¢': 'cent',
        '¥': 'CNY',
        元: 'CNY',
        円: 'YEN',
        '﷼': 'IRR',
        '₠': 'EWE',
        '฿': 'THB',
        '₨': 'INR',
        '₹': 'INR',
        '₰': 'PF',
        '₺': 'TRY',
        '؋': 'AFN',
        '₼': 'AZN',
        лв: 'BGN',
        '៛': 'KHR',
        '₡': 'CRC',
        '₸': 'KZT',
        ден: 'MKD',
        zł: 'PLN',
        '₽': 'RUB',
        '₾': 'GEL',
      };
      var lookAheadCharArray = [
        // burmese
        '်',
        // Dhivehi
        'ް',
      ];
      var diatricMap = {
        // Burmese
        // dependent vowels
        'ာ': 'a',
        'ါ': 'a',
        'ေ': 'e',
        'ဲ': 'e',
        'ိ': 'i',
        'ီ': 'i',
        'ို': 'o',
        'ု': 'u',
        'ူ': 'u',
        'ေါင်': 'aung',
        'ော': 'aw',
        'ော်': 'aw',
        'ေါ': 'aw',
        'ေါ်': 'aw',
        '်': '်',
        // this is special case but the character will be converted to latin in the code
        က်: 'et',
        'ိုက်': 'aik',
        'ောက်': 'auk',
        င်: 'in',
        'ိုင်': 'aing',
        'ောင်': 'aung',
        စ်: 'it',
        ည်: 'i',
        တ်: 'at',
        'ိတ်': 'eik',
        'ုတ်': 'ok',
        'ွတ်': 'ut',
        'ေတ်': 'it',
        ဒ်: 'd',
        'ိုဒ်': 'ok',
        'ုဒ်': 'ait',
        န်: 'an',
        'ာန်': 'an',
        'ိန်': 'ein',
        'ုန်': 'on',
        'ွန်': 'un',
        ပ်: 'at',
        'ိပ်': 'eik',
        'ုပ်': 'ok',
        'ွပ်': 'ut',
        န်ုပ်: 'nub',
        မ်: 'an',
        'ိမ်': 'ein',
        'ုမ်': 'on',
        'ွမ်': 'un',
        ယ်: 'e',
        'ိုလ်': 'ol',
        ဉ်: 'in',
        'ံ': 'an',
        'ိံ': 'ein',
        'ုံ': 'on',
        // Dhivehi
        'ައް': 'ah',
        'ަށް': 'ah',
      };
      var langCharMap = {
        en: {},
        // default language
        az: {
          // Azerbaijani
          ç: 'c',
          ə: 'e',
          ğ: 'g',
          ı: 'i',
          ö: 'o',
          ş: 's',
          ü: 'u',
          Ç: 'C',
          Ə: 'E',
          Ğ: 'G',
          İ: 'I',
          Ö: 'O',
          Ş: 'S',
          Ü: 'U',
        },
        cs: {
          // Czech
          č: 'c',
          ď: 'd',
          ě: 'e',
          ň: 'n',
          ř: 'r',
          š: 's',
          ť: 't',
          ů: 'u',
          ž: 'z',
          Č: 'C',
          Ď: 'D',
          Ě: 'E',
          Ň: 'N',
          Ř: 'R',
          Š: 'S',
          Ť: 'T',
          Ů: 'U',
          Ž: 'Z',
        },
        fi: {
          // Finnish
          // 'å': 'a', duplicate see charMap/latin
          // 'Å': 'A', duplicate see charMap/latin
          ä: 'a',
          // ok
          Ä: 'A',
          // ok
          ö: 'o',
          // ok
          Ö: 'O',
          // ok
        },
        hu: {
          // Hungarian
          ä: 'a',
          // ok
          Ä: 'A',
          // ok
          // 'á': 'a', duplicate see charMap/latin
          // 'Á': 'A', duplicate see charMap/latin
          ö: 'o',
          // ok
          Ö: 'O',
          // ok
          // 'ő': 'o', duplicate see charMap/latin
          // 'Ő': 'O', duplicate see charMap/latin
          ü: 'u',
          Ü: 'U',
          ű: 'u',
          Ű: 'U',
        },
        lt: {
          // Lithuanian
          ą: 'a',
          č: 'c',
          ę: 'e',
          ė: 'e',
          į: 'i',
          š: 's',
          ų: 'u',
          ū: 'u',
          ž: 'z',
          Ą: 'A',
          Č: 'C',
          Ę: 'E',
          Ė: 'E',
          Į: 'I',
          Š: 'S',
          Ų: 'U',
          Ū: 'U',
        },
        lv: {
          // Latvian
          ā: 'a',
          č: 'c',
          ē: 'e',
          ģ: 'g',
          ī: 'i',
          ķ: 'k',
          ļ: 'l',
          ņ: 'n',
          š: 's',
          ū: 'u',
          ž: 'z',
          Ā: 'A',
          Č: 'C',
          Ē: 'E',
          Ģ: 'G',
          Ī: 'i',
          Ķ: 'k',
          Ļ: 'L',
          Ņ: 'N',
          Š: 'S',
          Ū: 'u',
          Ž: 'Z',
        },
        pl: {
          // Polish
          ą: 'a',
          ć: 'c',
          ę: 'e',
          ł: 'l',
          ń: 'n',
          ó: 'o',
          ś: 's',
          ź: 'z',
          ż: 'z',
          Ą: 'A',
          Ć: 'C',
          Ę: 'e',
          Ł: 'L',
          Ń: 'N',
          Ó: 'O',
          Ś: 'S',
          Ź: 'Z',
          Ż: 'Z',
        },
        sv: {
          // Swedish
          // 'å': 'a', duplicate see charMap/latin
          // 'Å': 'A', duplicate see charMap/latin
          ä: 'a',
          // ok
          Ä: 'A',
          // ok
          ö: 'o',
          // ok
          Ö: 'O',
          // ok
        },
        sk: {
          // Slovak
          ä: 'a',
          Ä: 'A',
        },
        sr: {
          // Serbian
          љ: 'lj',
          њ: 'nj',
          Љ: 'Lj',
          Њ: 'Nj',
          đ: 'dj',
          Đ: 'Dj',
        },
        tr: {
          // Turkish
          Ü: 'U',
          Ö: 'O',
          ü: 'u',
          ö: 'o',
        },
      };
      var symbolMap = {
        ar: {
          '∆': 'delta',
          '∞': 'la-nihaya',
          '♥': 'hob',
          '&': 'wa',
          '|': 'aw',
          '<': 'aqal-men',
          '>': 'akbar-men',
          '∑': 'majmou',
          '¤': 'omla',
        },
        az: {},
        ca: {
          '∆': 'delta',
          '∞': 'infinit',
          '♥': 'amor',
          '&': 'i',
          '|': 'o',
          '<': 'menys que',
          '>': 'mes que',
          '∑': 'suma dels',
          '¤': 'moneda',
        },
        cs: {
          '∆': 'delta',
          '∞': 'nekonecno',
          '♥': 'laska',
          '&': 'a',
          '|': 'nebo',
          '<': 'mensi nez',
          '>': 'vetsi nez',
          '∑': 'soucet',
          '¤': 'mena',
        },
        de: {
          '∆': 'delta',
          '∞': 'unendlich',
          '♥': 'Liebe',
          '&': 'und',
          '|': 'oder',
          '<': 'kleiner als',
          '>': 'groesser als',
          '∑': 'Summe von',
          '¤': 'Waehrung',
        },
        dv: {
          '∆': 'delta',
          '∞': 'kolunulaa',
          '♥': 'loabi',
          '&': 'aai',
          '|': 'noonee',
          '<': 'ah vure kuda',
          '>': 'ah vure bodu',
          '∑': 'jumula',
          '¤': 'faisaa',
        },
        en: {
          '∆': 'delta',
          '∞': 'infinity',
          '♥': 'love',
          '&': 'and',
          '|': 'or',
          '<': 'less than',
          '>': 'greater than',
          '∑': 'sum',
          '¤': 'currency',
        },
        es: {
          '∆': 'delta',
          '∞': 'infinito',
          '♥': 'amor',
          '&': 'y',
          '|': 'u',
          '<': 'menos que',
          '>': 'mas que',
          '∑': 'suma de los',
          '¤': 'moneda',
        },
        fa: {
          '∆': 'delta',
          '∞': 'bi-nahayat',
          '♥': 'eshgh',
          '&': 'va',
          '|': 'ya',
          '<': 'kamtar-az',
          '>': 'bishtar-az',
          '∑': 'majmooe',
          '¤': 'vahed',
        },
        fi: {
          '∆': 'delta',
          '∞': 'aarettomyys',
          '♥': 'rakkaus',
          '&': 'ja',
          '|': 'tai',
          '<': 'pienempi kuin',
          '>': 'suurempi kuin',
          '∑': 'summa',
          '¤': 'valuutta',
        },
        fr: {
          '∆': 'delta',
          '∞': 'infiniment',
          '♥': 'Amour',
          '&': 'et',
          '|': 'ou',
          '<': 'moins que',
          '>': 'superieure a',
          '∑': 'somme des',
          '¤': 'monnaie',
        },
        ge: {
          '∆': 'delta',
          '∞': 'usasruloba',
          '♥': 'siqvaruli',
          '&': 'da',
          '|': 'an',
          '<': 'naklebi',
          '>': 'meti',
          '∑': 'jami',
          '¤': 'valuta',
        },
        gr: {},
        hu: {
          '∆': 'delta',
          '∞': 'vegtelen',
          '♥': 'szerelem',
          '&': 'es',
          '|': 'vagy',
          '<': 'kisebb mint',
          '>': 'nagyobb mint',
          '∑': 'szumma',
          '¤': 'penznem',
        },
        it: {
          '∆': 'delta',
          '∞': 'infinito',
          '♥': 'amore',
          '&': 'e',
          '|': 'o',
          '<': 'minore di',
          '>': 'maggiore di',
          '∑': 'somma',
          '¤': 'moneta',
        },
        lt: {
          '∆': 'delta',
          '∞': 'begalybe',
          '♥': 'meile',
          '&': 'ir',
          '|': 'ar',
          '<': 'maziau nei',
          '>': 'daugiau nei',
          '∑': 'suma',
          '¤': 'valiuta',
        },
        lv: {
          '∆': 'delta',
          '∞': 'bezgaliba',
          '♥': 'milestiba',
          '&': 'un',
          '|': 'vai',
          '<': 'mazak neka',
          '>': 'lielaks neka',
          '∑': 'summa',
          '¤': 'valuta',
        },
        my: {
          '∆': 'kwahkhyaet',
          '∞': 'asaonasme',
          '♥': 'akhyait',
          '&': 'nhin',
          '|': 'tho',
          '<': 'ngethaw',
          '>': 'kyithaw',
          '∑': 'paungld',
          '¤': 'ngwekye',
        },
        mk: {},
        nl: {
          '∆': 'delta',
          '∞': 'oneindig',
          '♥': 'liefde',
          '&': 'en',
          '|': 'of',
          '<': 'kleiner dan',
          '>': 'groter dan',
          '∑': 'som',
          '¤': 'valuta',
        },
        pl: {
          '∆': 'delta',
          '∞': 'nieskonczonosc',
          '♥': 'milosc',
          '&': 'i',
          '|': 'lub',
          '<': 'mniejsze niz',
          '>': 'wieksze niz',
          '∑': 'suma',
          '¤': 'waluta',
        },
        pt: {
          '∆': 'delta',
          '∞': 'infinito',
          '♥': 'amor',
          '&': 'e',
          '|': 'ou',
          '<': 'menor que',
          '>': 'maior que',
          '∑': 'soma',
          '¤': 'moeda',
        },
        ro: {
          '∆': 'delta',
          '∞': 'infinit',
          '♥': 'dragoste',
          '&': 'si',
          '|': 'sau',
          '<': 'mai mic ca',
          '>': 'mai mare ca',
          '∑': 'suma',
          '¤': 'valuta',
        },
        ru: {
          '∆': 'delta',
          '∞': 'beskonechno',
          '♥': 'lubov',
          '&': 'i',
          '|': 'ili',
          '<': 'menshe',
          '>': 'bolshe',
          '∑': 'summa',
          '¤': 'valjuta',
        },
        sk: {
          '∆': 'delta',
          '∞': 'nekonecno',
          '♥': 'laska',
          '&': 'a',
          '|': 'alebo',
          '<': 'menej ako',
          '>': 'viac ako',
          '∑': 'sucet',
          '¤': 'mena',
        },
        sr: {},
        tr: {
          '∆': 'delta',
          '∞': 'sonsuzluk',
          '♥': 'ask',
          '&': 've',
          '|': 'veya',
          '<': 'kucuktur',
          '>': 'buyuktur',
          '∑': 'toplam',
          '¤': 'para birimi',
        },
        uk: {
          '∆': 'delta',
          '∞': 'bezkinechnist',
          '♥': 'lubov',
          '&': 'i',
          '|': 'abo',
          '<': 'menshe',
          '>': 'bilshe',
          '∑': 'suma',
          '¤': 'valjuta',
        },
        vn: {
          '∆': 'delta',
          '∞': 'vo cuc',
          '♥': 'yeu',
          '&': 'va',
          '|': 'hoac',
          '<': 'nho hon',
          '>': 'lon hon',
          '∑': 'tong',
          '¤': 'tien te',
        },
      };
      var uricChars = [';', '?', ':', '@', '&', '=', '+', '$', ',', '/'].join(
        '',
      );
      var uricNoSlashChars = [';', '?', ':', '@', '&', '=', '+', '$', ','].join(
        '',
      );
      var markChars = ['.', '!', '~', '*', "'", '(', ')'].join('');
      var getSlug = function getSlug2(input, opts) {
        var separator = '-';
        var result = '';
        var diatricString = '';
        var convertSymbols = true;
        var customReplacements = {};
        var maintainCase;
        var titleCase;
        var truncate;
        var uricFlag;
        var uricNoSlashFlag;
        var markFlag;
        var symbol;
        var langChar;
        var lucky;
        var i;
        var ch;
        var l;
        var lastCharWasSymbol;
        var lastCharWasDiatric;
        var allowedChars = '';
        if (typeof input !== 'string') {
          return '';
        }
        if (typeof opts === 'string') {
          separator = opts;
        }
        symbol = symbolMap.en;
        langChar = langCharMap.en;
        if (typeof opts === 'object') {
          maintainCase = opts.maintainCase || false;
          customReplacements =
            opts.custom && typeof opts.custom === 'object'
              ? opts.custom
              : customReplacements;
          truncate = (+opts.truncate > 1 && opts.truncate) || false;
          uricFlag = opts.uric || false;
          uricNoSlashFlag = opts.uricNoSlash || false;
          markFlag = opts.mark || false;
          convertSymbols =
            opts.symbols === false || opts.lang === false ? false : true;
          separator = opts.separator || separator;
          if (uricFlag) {
            allowedChars += uricChars;
          }
          if (uricNoSlashFlag) {
            allowedChars += uricNoSlashChars;
          }
          if (markFlag) {
            allowedChars += markChars;
          }
          symbol =
            opts.lang && symbolMap[opts.lang] && convertSymbols
              ? symbolMap[opts.lang]
              : convertSymbols
                ? symbolMap.en
                : {};
          langChar =
            opts.lang && langCharMap[opts.lang]
              ? langCharMap[opts.lang]
              : opts.lang === false || opts.lang === true
                ? {}
                : langCharMap.en;
          if (
            opts.titleCase &&
            typeof opts.titleCase.length === 'number' &&
            Array.prototype.toString.call(opts.titleCase)
          ) {
            opts.titleCase.forEach(function (v) {
              customReplacements[v + ''] = v + '';
            });
            titleCase = true;
          } else {
            titleCase = !!opts.titleCase;
          }
          if (
            opts.custom &&
            typeof opts.custom.length === 'number' &&
            Array.prototype.toString.call(opts.custom)
          ) {
            opts.custom.forEach(function (v) {
              customReplacements[v + ''] = v + '';
            });
          }
          Object.keys(customReplacements).forEach(function (v) {
            var r;
            if (v.length > 1) {
              r = new RegExp('\\b' + escapeChars(v) + '\\b', 'gi');
            } else {
              r = new RegExp(escapeChars(v), 'gi');
            }
            input = input.replace(r, customReplacements[v]);
          });
          for (ch in customReplacements) {
            allowedChars += ch;
          }
        }
        allowedChars += separator;
        allowedChars = escapeChars(allowedChars);
        input = input.replace(/(^\s+|\s+$)/g, '');
        lastCharWasSymbol = false;
        lastCharWasDiatric = false;
        for (i = 0, l = input.length; i < l; i++) {
          ch = input[i];
          if (isReplacedCustomChar(ch, customReplacements)) {
            lastCharWasSymbol = false;
          } else if (langChar[ch]) {
            ch =
              lastCharWasSymbol && langChar[ch].match(/[A-Za-z0-9]/)
                ? ' ' + langChar[ch]
                : langChar[ch];
            lastCharWasSymbol = false;
          } else if (ch in charMap) {
            if (i + 1 < l && lookAheadCharArray.indexOf(input[i + 1]) >= 0) {
              diatricString += ch;
              ch = '';
            } else if (lastCharWasDiatric === true) {
              ch = diatricMap[diatricString] + charMap[ch];
              diatricString = '';
            } else {
              ch =
                lastCharWasSymbol && charMap[ch].match(/[A-Za-z0-9]/)
                  ? ' ' + charMap[ch]
                  : charMap[ch];
            }
            lastCharWasSymbol = false;
            lastCharWasDiatric = false;
          } else if (ch in diatricMap) {
            diatricString += ch;
            ch = '';
            if (i === l - 1) {
              ch = diatricMap[diatricString];
            }
            lastCharWasDiatric = true;
          } else if (
            // process symbol chars
            symbol[ch] &&
            !(uricFlag && uricChars.indexOf(ch) !== -1) &&
            !(uricNoSlashFlag && uricNoSlashChars.indexOf(ch) !== -1)
          ) {
            ch =
              lastCharWasSymbol || result.substr(-1).match(/[A-Za-z0-9]/)
                ? separator + symbol[ch]
                : symbol[ch];
            ch +=
              input[i + 1] !== void 0 && input[i + 1].match(/[A-Za-z0-9]/)
                ? separator
                : '';
            lastCharWasSymbol = true;
          } else {
            if (lastCharWasDiatric === true) {
              ch = diatricMap[diatricString] + ch;
              diatricString = '';
              lastCharWasDiatric = false;
            } else if (
              lastCharWasSymbol &&
              (/[A-Za-z0-9]/.test(ch) || result.substr(-1).match(/A-Za-z0-9]/))
            ) {
              ch = ' ' + ch;
            }
            lastCharWasSymbol = false;
          }
          result += ch.replace(
            new RegExp('[^\\w\\s' + allowedChars + '_-]', 'g'),
            separator,
          );
        }
        if (titleCase) {
          result = result.replace(/(\w)(\S*)/g, function (_, i2, r) {
            var j = i2.toUpperCase() + (r !== null ? r : '');
            return Object.keys(customReplacements).indexOf(j.toLowerCase()) < 0
              ? j
              : j.toLowerCase();
          });
        }
        result = result
          .replace(/\s+/g, separator)
          .replace(new RegExp('\\' + separator + '+', 'g'), separator)
          .replace(
            new RegExp('(^\\' + separator + '+|\\' + separator + '+$)', 'g'),
            '',
          );
        if (truncate && result.length > truncate) {
          lucky = result.charAt(truncate) === separator;
          result = result.slice(0, truncate);
          if (!lucky) {
            result = result.slice(0, result.lastIndexOf(separator));
          }
        }
        if (!maintainCase && !titleCase) {
          result = result.toLowerCase();
        }
        return result;
      };
      var createSlug = function createSlug2(opts) {
        return function getSlugWithConfig(input) {
          return getSlug(input, opts);
        };
      };
      var escapeChars = function escapeChars2(input) {
        return input.replace(/[-\\^$*+?.()|[\]{}\/]/g, '\\$&');
      };
      var isReplacedCustomChar = function (ch, customReplacements) {
        for (var c in customReplacements) {
          if (customReplacements[c] === ch) {
            return true;
          }
        }
      };
      if (typeof module !== 'undefined' && module.exports) {
        module.exports = getSlug;
        module.exports.createSlug = createSlug;
      } else if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
          return getSlug;
        });
      } else {
        try {
          if (root.getSlug || root.createSlug) {
            throw 'speakingurl: globals exists /(getSlug|createSlug)/';
          } else {
            root.getSlug = getSlug;
            root.createSlug = createSlug;
          }
        } catch (e) {}
      }
    })(exports);
  },
});
var require_speakingurl2 = __commonJS2({
  '../../node_modules/.pnpm/speakingurl@14.0.1/node_modules/speakingurl/index.js'(
    exports,
    module,
  ) {
    'use strict';
    init_esm_shims2();
    module.exports = require_speakingurl();
  },
});
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
var _a;
var _b;
var devtoolsHooks =
  (_b = (_a = target).__VUE_DEVTOOLS_HOOK) != null
    ? _b
    : (_a.__VUE_DEVTOOLS_HOOK = createHooks());
var on = {
  vueAppInit(fn) {
    devtoolsHooks.hook('app:init', fn);
  },
  vueAppUnmount(fn) {
    devtoolsHooks.hook('app:unmount', fn);
  },
  vueAppConnected(fn) {
    devtoolsHooks.hook('app:connected', fn);
  },
  componentAdded(fn) {
    return devtoolsHooks.hook('component:added', fn);
  },
  componentUpdated(fn) {
    return devtoolsHooks.hook('component:updated', fn);
  },
  componentRemoved(fn) {
    return devtoolsHooks.hook('component:removed', fn);
  },
  setupDevtoolsPlugin(fn) {
    devtoolsHooks.hook('devtools-plugin:setup', fn);
  },
};
var hook = {
  on,
  setupDevToolsPlugin(pluginDescriptor, setupFn) {
    return devtoolsHooks.callHook(
      'devtools-plugin:setup',
      pluginDescriptor,
      setupFn,
    );
  },
};
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
var import_speakingurl = __toESM2(require_speakingurl2(), 1);
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
var _a2;
var _b2;
var apiHooks =
  (_b2 = (_a2 = target).__VUE_DEVTOOLS_API_HOOK) != null
    ? _b2
    : (_a2.__VUE_DEVTOOLS_API_HOOK = createHooks());
function getRoutes(router) {
  const routesMap = /* @__PURE__ */ new Map();
  return ((router == null ? void 0 : router.getRoutes()) || []).filter(
    (i) => !routesMap.has(i.path) && routesMap.set(i.path, 1),
  );
}
function filterRoutes(routes) {
  return routes.map((item) => {
    let { path, name, children } = item;
    if (children == null ? void 0 : children.length)
      children = filterRoutes(children);
    return {
      path,
      name,
      children,
    };
  });
}
function filterCurrentRoute(route) {
  if (route) {
    const { fullPath, hash, href, path, name, matched, params, query } = route;
    return {
      fullPath,
      hash,
      href,
      path,
      name,
      params,
      query,
      matched: filterRoutes(matched),
    };
  }
  return route;
}
function normalizeRouterInfo(appRecord, state) {
  function init() {
    var _a10;
    const router =
      (_a10 = appRecord.app) == null
        ? void 0
        : _a10.config.globalProperties.$router;
    const currentRoute = filterCurrentRoute(
      router == null ? void 0 : router.currentRoute.value,
    );
    const routes = filterRoutes(getRoutes(router));
    const c = console.warn;
    console.warn = () => {};
    target[ROUTER_INFO_KEY] = {
      currentRoute: currentRoute ? deepClone(currentRoute) : {},
      routes: deepClone(routes),
    };
    target[ROUTER_KEY] = router;
    console.warn = c;
  }
  init();
  hook.on.componentUpdated(
    debounce(() => {
      var _a10;
      if (
        ((_a10 = state.activeAppRecord) == null ? void 0 : _a10.app) !==
        appRecord.app
      )
        return;
      init();
      apiHooks.callHook('router-info:updated', target[ROUTER_INFO_KEY]);
    }, 200),
  );
}
function setupDevToolsPlugin(pluginDescriptor, setupFn) {
  return hook.setupDevToolsPlugin(pluginDescriptor, setupFn);
}
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
var StateEditor = class {
  constructor() {
    this.refEditor = new RefStateEditor();
  }
  set(object, path, value, cb) {
    const sections = Array.isArray(path) ? path : path.split('.');
    const markRef = false;
    while (sections.length > 1) {
      const section = sections.shift();
      if (object instanceof Map) object = object.get(section);
      if (object instanceof Set) object = Array.from(object.values())[section];
      else object = object[section];
      if (this.refEditor.isRef(object)) object = this.refEditor.get(object);
    }
    const field = sections[0];
    const item = this.refEditor.get(object)[field];
    if (cb) {
      cb(object, field, value);
    } else {
      if (this.refEditor.isRef(item)) this.refEditor.set(item, value);
      else if (markRef) object[field] = value;
      else object[field] = value;
    }
  }
  get(object, path) {
    const sections = Array.isArray(path) ? path : path.split('.');
    for (let i = 0; i < sections.length; i++) {
      if (object instanceof Map) object = object.get(sections[i]);
      else object = object[sections[i]];
      if (this.refEditor.isRef(object)) object = this.refEditor.get(object);
      if (!object) return void 0;
    }
    return object;
  }
  has(object, path, parent = false) {
    if (typeof object === 'undefined') return false;
    const sections = Array.isArray(path) ? path.slice() : path.split('.');
    const size = !parent ? 1 : 2;
    while (object && sections.length > size) {
      const section = sections.shift();
      object = object[section];
      if (this.refEditor.isRef(object)) object = this.refEditor.get(object);
    }
    return (
      object != null &&
      Object.prototype.hasOwnProperty.call(object, sections[0])
    );
  }
  createDefaultSetCallback(state) {
    return (object, field, value) => {
      if (state.remove || state.newKey) {
        if (Array.isArray(object)) object.splice(field, 1);
        else if (toRaw(object) instanceof Map) object.delete(field);
        else if (toRaw(object) instanceof Set)
          object.delete(Array.from(object.values())[field]);
        else Reflect.deleteProperty(object, field);
      }
      if (!state.remove) {
        const target10 = object[state.newKey || field];
        if (this.refEditor.isRef(target10)) this.refEditor.set(target10, value);
        else if (toRaw(object) instanceof Map)
          object.set(state.newKey || field, value);
        else if (toRaw(object) instanceof Set) object.add(value);
        else object[state.newKey || field] = value;
      }
    };
  }
};
var RefStateEditor = class {
  set(ref, value) {
    if (isRef(ref)) {
      ref.value = value;
    } else {
      if (ref instanceof Set && Array.isArray(value)) {
        ref.clear();
        value.forEach((v) => ref.add(v));
        return;
      }
      const currentKeys = Object.keys(value);
      if (ref instanceof Map) {
        const previousKeysSet2 = new Set(ref.keys());
        currentKeys.forEach((key) => {
          ref.set(key, Reflect.get(value, key));
          previousKeysSet2.delete(key);
        });
        previousKeysSet2.forEach((key) => ref.delete(key));
        return;
      }
      const previousKeysSet = new Set(Object.keys(ref));
      currentKeys.forEach((key) => {
        Reflect.set(ref, key, Reflect.get(value, key));
        previousKeysSet.delete(key);
      });
      previousKeysSet.forEach((key) => Reflect.deleteProperty(ref, key));
    }
  }
  get(ref) {
    return isRef(ref) ? ref.value : ref;
  }
  isRef(ref) {
    return isRef(ref) || isReactive(ref);
  }
};
var stateEditor = new StateEditor();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
var UNDEFINED = '__vue_devtool_undefined__';
var INFINITY = '__vue_devtool_infinity__';
var NEGATIVE_INFINITY = '__vue_devtool_negative_infinity__';
var NAN = '__vue_devtool_nan__';
init_esm_shims2();
init_esm_shims2();
var tokenMap = {
  [UNDEFINED]: 'undefined',
  [NAN]: 'NaN',
  [INFINITY]: 'Infinity',
  [NEGATIVE_INFINITY]: '-Infinity',
};
var reversedTokenMap = Object.entries(tokenMap).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
var MAX_SERIALIZED_SIZE = 512 * 1024;
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
function addCustomTab(tab) {
  if (devtoolsState.tabs.some((t) => t.name === tab.name)) return;
  devtoolsState.tabs.push(tab);
}
init_esm_shims2();
function addCustomCommand(action) {
  if (devtoolsState.commands.some((t) => t.id === action.id)) return;
  devtoolsState.commands.push(action);
}
function removeCustomCommand(actionId) {
  const index = devtoolsState.commands.findIndex((t) => t.id === actionId);
  if (index === -1) return;
  devtoolsState.commands.splice(index, 1);
}
init_esm_shims2();
var _a3;
var _b3;
(_b3 = (_a3 = target).__VUE_DEVTOOLS_COMPONENT_INSPECTOR_ENABLED__) != null
  ? _b3
  : (_a3.__VUE_DEVTOOLS_COMPONENT_INSPECTOR_ENABLED__ = true);
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
var STATE_KEY = '__VUE_DEVTOOLS_GLOBAL_STATE__';
function initStateFactory() {
  return {
    connected: false,
    clientConnected: false,
    appRecords: [],
    activeAppRecord: null,
    selectedComponentId: null,
    pluginBuffer: [],
    tabs: [],
    commands: [],
    vitePluginDetected: false,
    activeAppRecordId: null,
    highPerfModeEnabled: false,
  };
}
var _a4;
var _b4;
(_b4 = (_a4 = target)[STATE_KEY]) != null
  ? _b4
  : (_a4[STATE_KEY] = initStateFactory());
var callStateUpdatedHook = debounce((state, oldState) => {
  apiHooks.callHook('devtools:state-updated', state, oldState);
}, 80);
var callConnectedUpdatedHook = debounce((state, oldState) => {
  apiHooks.callHook('devtools:connected-updated', state, oldState);
}, 80);
var devtoolsState = new Proxy(target[STATE_KEY], {
  get(target10, property) {
    return target[STATE_KEY][property];
  },
  deleteProperty(target10, property) {
    delete target10[property];
    return true;
  },
  set(target10, property, value) {
    const oldState = { ...target[STATE_KEY] };
    target10[property] = value;
    target[STATE_KEY][property] = value;
    callStateUpdatedHook(target[STATE_KEY], oldState);
    if (
      ['connected', 'clientConnected'].includes(property.toString()) &&
      oldState[property] !== value
    )
      callConnectedUpdatedHook(target[STATE_KEY], oldState);
    return true;
  },
});
Object.defineProperty(devtoolsState.tabs, 'push', {
  configurable: true,
  value(...items) {
    const result = Array.prototype.push.apply(this, items);
    devtoolsState.tabs = this;
    apiHooks.callHook('custom-tabs:updated', this);
    return result;
  },
});
['push', 'splice'].forEach((method) => {
  Object.defineProperty(devtoolsState.commands, method, {
    configurable: true,
    value(...args) {
      const result = Array.prototype[method].apply(this, args);
      devtoolsState.commands = this;
      apiHooks.callHook('custom-commands:updated', this);
      return result;
    },
  });
});
init_esm_shims2();
init_esm_shims2();
var ROUTER_KEY = '__VUE_DEVTOOLS_ROUTER__';
var ROUTER_INFO_KEY = '__VUE_DEVTOOLS_ROUTER_INFO__';
var _a5;
var _b5;
(_b5 = (_a5 = target)[ROUTER_INFO_KEY]) != null
  ? _b5
  : (_a5[ROUTER_INFO_KEY] = {
      currentRoute: null,
      routes: [],
    });
var _a6;
var _b6;
(_b6 = (_a6 = target)[ROUTER_KEY]) != null ? _b6 : (_a6[ROUTER_KEY] = null);
var devtoolsRouterInfo = new Proxy(target[ROUTER_INFO_KEY], {
  get(target10, property) {
    return target[ROUTER_INFO_KEY][property];
  },
});
init_esm_shims2();
var CONTEXT_KEY = '__VUE_DEVTOOLS_CONTEXT__';
function initContextFactory() {
  return {
    appRecord: null,
    api: null,
    inspector: [],
    timelineLayer: [],
    routerInfo: {},
    router: null,
    activeInspectorTreeId: '',
    componentPluginHookBuffer: [],
  };
}
var _a7;
var _b7;
(_b7 = (_a7 = target)[CONTEXT_KEY]) != null
  ? _b7
  : (_a7[CONTEXT_KEY] = initContextFactory());
function resetDevToolsContext() {
  target[CONTEXT_KEY] = initContextFactory();
}
var devtoolsContext = new Proxy(target[CONTEXT_KEY], {
  get(target10, property) {
    if (property === 'router') return target[ROUTER_KEY];
    else if (property === 'clear') return resetDevToolsContext;
    return target[CONTEXT_KEY][property];
  },
  set(target10, property, value) {
    target[CONTEXT_KEY][property] = value;
    return true;
  },
});
var devtoolsAppRecords = new Proxy(devtoolsState.appRecords, {
  get(_, property) {
    if (property === 'value') return devtoolsState.appRecords;
    else if (property === 'active') return devtoolsState.activeAppRecord;
    else if (property === 'activeId') return devtoolsState.activeAppRecordId;
  },
  set(target10, property, value) {
    var _a10;
    const oldState = { ...devtoolsState };
    if (property === 'value') {
      devtoolsState.appRecords = value;
    } else if (property === 'active') {
      const _value = value;
      devtoolsState.activeAppRecord = _value;
      devtoolsContext.appRecord = _value;
      devtoolsContext.api = _value.api;
      devtoolsContext.inspector = (_a10 = _value.inspector) != null ? _a10 : [];
      normalizeRouterInfo(value, devtoolsState);
      devtoolsContext.routerInfo = devtoolsRouterInfo;
    } else if (property === 'activeId') {
      devtoolsState.activeAppRecordId = value;
    }
    callStateUpdatedHook(devtoolsState, oldState);
    if (
      ['connected', 'clientConnected'].includes(property.toString()) &&
      oldState[property] !== value
    )
      callConnectedUpdatedHook(devtoolsState, oldState);
    return true;
  },
});
var _a8;
var _b8;
var appRecordInfo =
  (_b8 = (_a8 = target).__VUE_DEVTOOLS_NEXT_APP_RECORD_INFO__) != null
    ? _b8
    : (_a8.__VUE_DEVTOOLS_NEXT_APP_RECORD_INFO__ = {
        id: 0,
        appIds: /* @__PURE__ */ new Set(),
      });
init_esm_shims2();
var _a9;
var _b9;
(_b9 = (_a9 = target).__VUE_DEVTOOLS_ENV__) != null
  ? _b9
  : (_a9.__VUE_DEVTOOLS_ENV__ = {
      vitePluginDetected: false,
    });
init_esm_shims2();
function onDevToolsConnected(fn) {
  return new Promise((resolve) => {
    if (devtoolsState.connected) {
      fn();
      resolve();
      return;
    }
    apiHooks.hook('devtools:connected-updated', (state) => {
      if (state.connected) {
        fn();
        resolve();
      }
    });
  });
}
function onDevToolsClientConnected(fn) {
  return new Promise((resolve) => {
    if (devtoolsState.connected && devtoolsState.clientConnected) {
      fn();
      resolve();
      return;
    }
    apiHooks.hook('devtools:connected-updated', (state) => {
      if (state.connected && state.clientConnected) {
        fn();
        resolve();
      }
    });
  });
}
init_esm_shims2();
export {
  addCustomCommand,
  addCustomTab,
  onDevToolsClientConnected,
  onDevToolsConnected,
  removeCustomCommand,
  setupDevToolsPlugin,
  setupDevToolsPlugin as setupDevtoolsPlugin,
};
//# sourceMappingURL=vitepress___@vue_devtools-api.js.map
