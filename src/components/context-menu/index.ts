import { Vue } from 'compatible-vue';
import contextMenuVue from './src/index.vue';
import { isClient } from '@/utils/is/index';
import { Options, Instance } from './src/types';
const ContextMenuConstructor = Vue.extend(contextMenuVue as any);
let instance: Instance | null;
export const createContextMenu = function (options: Options) {
  const { event } = options;
  try {
    event.preventDefault();
  } catch (e) {
    console.log(e);
  }
  if (!isClient) return;
  return new Promise((resolve) => {
    if (instance) {
      // 如果还有上一个未关闭
      instance.resolve('');
    }
    const bodyClick = function () {
      instance && instance.resolve('');
    };
    const remove = function () {
      instance && document.body.removeChild(instance.$el);
      document.body.removeEventListener('click', bodyClick);
      document.body.removeEventListener('scroll', bodyClick);
      instance = null;
    };

    instance = new ContextMenuConstructor({
      el: document.createElement('div'),
    });
    if (options.icon !== undefined) instance.icon = options.icon;
    if (options.styles !== undefined) instance.styles = options.styles;
    if (options.items !== undefined) instance.items = options.items;
    if (options.event !== undefined) {
      instance.customEvent = event;
      instance.axis = { x: event.clientX, y: event.clientY };
    }
    instance.resolve = function (...arg) {
      resolve(arg[0]);
      remove();
    };
    document.body.appendChild(instance.$el);
    document.body.addEventListener('click', bodyClick);
    document.body.addEventListener('scroll', bodyClick);
  });
};
export const offContextMenu = function () {
  if (instance) instance.resolve('');
};

export * from './src/types';
