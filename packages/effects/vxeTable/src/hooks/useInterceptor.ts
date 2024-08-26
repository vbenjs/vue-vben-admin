// VXE事件拦截

import { VxeUI } from 'vxe-table';

export const useInterceptor = () => {
  VxeUI.interceptor.add('event.clearEdit', (params) => {
    const { $event } = params;
    // console.log($event);
    // 比如点击了某个组件的弹出层面板之后，此时被激活单元格不应该被自动关闭，通过返回 false 可以阻止默认的行为。
    // console.log(typeof $event.target.className);
    if (
      typeof $event.target.className === 'object' ||
      $event.target.className.includes('n-')
    ) {
      return false;
    }
  });
};
