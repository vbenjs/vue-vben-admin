const Mock = require('mockjs');
const { param2Obj } = require('./index');

const mockApiMethods = require.context('../', true, /^[^\_]*\.js$/);
let modules = {};
mockApiMethods.keys().forEach((key) => {
  if (key) {
    const mods = mockApiMethods(key);
    key = key.replace(/^\.\//, '').replace(/\.js$/, '');
    Object.keys(mods).forEach((mod) => {
      modules = { ...modules, ...mods };
    });
  }
});

function getModuleInfo(mockModules) {
  const moduleInfo = [];
  Object.keys(mockModules).forEach((key) => {
    const handle = mockModules[key];
    const { path, method, timeout } = parseKey(key);
    moduleInfo.push({ handle, path, method, timeout });
  });
  return moduleInfo;
}
function parseKey(key) {
  const len = key.length - key.replace(/\s/g, '').length;
  let method = 'get';
  let path = key;
  let timeout = 0;
  if (len > 0) {
    const splitEd = key.split(' ');
    method = splitEd[0].toLowerCase();
    path = splitEd[1];
    if (len === 2) {
      timeout = splitEd[2];
    }
  }
  return {
    method,
    path,
    timeout,
  };
}
function XHR2ExpressReqWrap(handle, timeout = 0) {
  return function (options) {
    let result = null;
    if (handle instanceof Function) {
      const { body, type, url } = options;
      result = handle({
        method: type,
        body: JSON.parse(body),
        query: param2Obj(url),
      });
    } else {
      result = handle;
    }

    return Mock.mock(result);
  };
}
function mockXHR() {
  const mockMethods = getModuleInfo(modules);
  Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send;
  Mock.XHR.prototype.send = function () {
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false;

      if (this.responseType) {
        this.custom.xhr.responseType = this.responseType;
      }
    }
    this.proxy_send(...arguments);
  };

  for (const { path, method, handle, timeout } of mockMethods) {
    setupMock(timeout);
    Mock.mock(new RegExp(path), method || 'get', XHR2ExpressReqWrap(handle, timeout));
  }
}
function setupMock(timeout = 0) {
  if (timeout) {
    Mock.setup({
      timeout,
    });
  }
}
mockXHR();
