import { Vue } from 'compatible-vue';

import { errorStore, ErrorTypeEnum, ErrorInfo } from '@/store/modules/error';
import { appStore } from '@/store/modules/app';

function processStackMsg(error: Error) {
  if (!error.stack) {
    return '';
  }
  let stack = error.stack
    .replace(/\n/gi, '') // 去掉换行，节省传输内容大小
    .replace(/\bat\b/gi, '@') // chrome中是at，ff中是@
    .split('@') // 以@分割信息
    .slice(0, 9) // 最大堆栈长度（Error.stackTraceLimit = 10），所以只取前10条
    .map((v) => v.replace(/^\s*|\s*$/g, '')) // 去除多余空格
    .join('~') // 手动添加分隔符，便于后期展示
    .replace(/\?[^:]+/gi, ''); // 去除js文件链接的多余参数(?x=1之类)
  const msg = error.toString();
  if (stack.indexOf(msg) < 0) {
    stack = msg + '@' + stack;
  }
  return stack;
}

function formatComponentName(vm: Vue) {
  if (vm.$root === vm) {
    return {
      name: 'root',
      path: 'root',
    };
  }

  const options = vm.$options as any;
  if (!options) {
    return {
      name: 'anonymous',
      path: 'anonymous',
    };
  }
  const name = options.name || options._componentTag;
  return {
    name: name,
    path: options.__file,
  };
}

function vueErrorHandler(err: Error, vm: Vue, info: string) {
  const { name, path } = formatComponentName(vm);
  errorStore.commitErrorInfoState({
    type: ErrorTypeEnum.VUE,
    name,
    file: path,
    message: err.message,
    stack: processStackMsg(err),
    detail: info,
    url: window.location.href,
  });
}

export function scriptErrorHandler(
  event: Event | string,
  source?: string,
  lineno?: number,
  colno?: number,
  error?: Error
) {
  if (event === 'Script error.' && !source) {
    return false;
  }
  setTimeout(function () {
    const errorInfo: Partial<ErrorInfo> = {};
    colno = colno || (window.event && (window.event as any).errorCharacter) || 0;
    errorInfo.message = event as string;
    if (error && error.stack) {
      errorInfo.stack = error.stack;
    } else {
      errorInfo.stack = '';
    }
    const name = source ? source.substr(source.lastIndexOf('/') + 1) : 'script';
    errorStore.commitErrorInfoState({
      type: ErrorTypeEnum.SCRIPT,
      name: name,
      file: source as string,
      detail: 'lineno' + lineno,
      url: window.location.href,
      ...(errorInfo as Pick<ErrorInfo, 'message' | 'stack'>),
    });
  }, 0);
  return true;
}

function registerPromiseErrorHandler() {
  window.addEventListener(
    'unhandledrejection',
    function (event: any) {
      errorStore.commitErrorInfoState({
        type: ErrorTypeEnum.PROMISE,
        name: 'Promise Error!',
        file: 'none',
        detail: 'promise error!',
        url: window.location.href,
        stack: 'promise error!',
        message: event.reason,
      });
    },
    true
  );
}

function registerResourceErrorHandler() {
  // 监控资源加载错误(img,script,css,以及jsonp)
  window.addEventListener(
    'error',
    function (e: Event) {
      const target = e.target ? e.target : (e.srcElement as any);

      errorStore.commitErrorInfoState({
        type: ErrorTypeEnum.RESOURCE,
        name: 'Resouce Error!',
        file: (e.target || ({} as any)).currentSrc,
        detail: JSON.stringify({
          tagName: target.localName,
          html: target.outerHTML,
          type: e.type,
        }),
        url: window.location.href,
        stack: 'resouce is not found',
        message: (e.target || ({} as any)).localName + ' is load error',
      });
    },
    true
  );
}

export function registerScriptErrorHandler() {
  const { useErrorHandle } = appStore.getProjCfg;
  if (!useErrorHandle) {
    return;
  }
  // Vue异常监控;
  Vue.config.errorHandler = vueErrorHandler;
  // js错误
  window.onerror = scriptErrorHandler;
  //  promise 异常
  registerPromiseErrorHandler();

  // 静态资源异常
  registerResourceErrorHandler();
}
