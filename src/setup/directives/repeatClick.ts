import { on, once } from '/@/utils/domUtils';

export default {
  beforeMount(el: Element, binding: any) {
    let interval: ReturnType<typeof setInterval> | null = null;
    let startTime = 0;
    const handler = () => binding.value && binding.value();
    const clear = () => {
      if (Date.now() - startTime < 100) {
        handler();
      }
      interval && clearInterval(interval);
      interval = null;
    };

    on(el, 'mousedown', (e) => {
      if ((e as any).button !== 0) return;
      startTime = Date.now();
      once(document as any, 'mouseup', clear);
      interval && clearInterval(interval);
      interval = setInterval(handler, 100);
    });
  },
};
