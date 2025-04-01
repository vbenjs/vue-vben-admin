import type { Component } from 'vue';

import type { Recordable } from '@vben-core/typings';

import type { AlertProps, BeforeCloseScope } from './alert';

import { h, ref, render } from 'vue';

import { useSimpleLocale } from '@vben-core/composables';
import { Input } from '@vben-core/shadcn-ui';
import { isFunction, isString } from '@vben-core/shared/utils';

import Alert from './alert.vue';

const alerts = ref<Array<{ container: HTMLElement; instance: Component }>>([]);

const { $t } = useSimpleLocale();

export function vbenAlert(options: AlertProps): Promise<void>;
export function vbenAlert(
  message: string,
  options?: Partial<AlertProps>,
): Promise<void>;
export function vbenAlert(
  message: string,
  title?: string,
  options?: Partial<AlertProps>,
): Promise<void>;

export function vbenAlert(
  arg0: AlertProps | string,
  arg1?: Partial<AlertProps> | string,
  arg2?: Partial<AlertProps>,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const options: AlertProps = isString(arg0)
      ? {
          content: arg0,
        }
      : { ...arg0 };
    if (arg1) {
      if (isString(arg1)) {
        options.title = arg1;
      } else if (!isString(arg1)) {
        // 如果第二个参数是对象，则合并到选项中
        Object.assign(options, arg1);
      }
    }

    if (arg2 && !isString(arg2)) {
      Object.assign(options, arg2);
    }
    // 创建容器元素
    const container = document.createElement('div');
    document.body.append(container);

    // 创建一个引用，用于在回调中访问实例
    const alertRef = { container, instance: null as any };

    const props: AlertProps & Recordable<any> = {
      onClosed: (isConfirm: boolean) => {
        // 移除组件实例以及创建的所有dom（恢复页面到打开前的状态）
        // 从alerts数组中移除该实例
        alerts.value = alerts.value.filter((item) => item !== alertRef);

        // 从DOM中移除容器
        render(null, container);
        if (container.parentNode) {
          container.remove();
        }

        // 解析 Promise，传递用户操作结果
        if (isConfirm) {
          resolve();
        } else {
          reject(new Error('dialog cancelled'));
        }
      },
      ...options,
      open: true,
      title: options.title ?? $t.value('prompt'),
    };

    // 创建Alert组件的VNode
    const vnode = h(Alert, props);

    // 渲染组件到容器
    render(vnode, container);

    // 保存组件实例引用
    alertRef.instance = vnode.component?.proxy as Component;

    // 将实例和容器添加到alerts数组中
    alerts.value.push(alertRef);
  });
}

export function vbenConfirm(options: AlertProps): Promise<void>;
export function vbenConfirm(
  message: string,
  options?: Partial<AlertProps>,
): Promise<void>;
export function vbenConfirm(
  message: string,
  title?: string,
  options?: Partial<AlertProps>,
): Promise<void>;

export function vbenConfirm(
  arg0: AlertProps | string,
  arg1?: Partial<AlertProps> | string,
  arg2?: Partial<AlertProps>,
): Promise<void> {
  const defaultProps: Partial<AlertProps> = {
    showCancel: true,
  };
  if (!arg1) {
    return isString(arg0)
      ? vbenAlert(arg0, defaultProps)
      : vbenAlert({ ...defaultProps, ...arg0 });
  } else if (!arg2) {
    return isString(arg1)
      ? vbenAlert(arg0 as string, arg1, defaultProps)
      : vbenAlert(arg0 as string, { ...defaultProps, ...arg1 });
  }
  return vbenAlert(arg0 as string, arg1 as string, {
    ...defaultProps,
    ...arg2,
  });
}

export async function vbenPrompt<T = any>(
  options: Omit<AlertProps, 'beforeClose'> & {
    beforeClose?: (scope: {
      isConfirm: boolean;
      value: T | undefined;
    }) => boolean | Promise<boolean | undefined> | undefined;
    component?: Component;
    componentProps?: Recordable<any>;
    defaultValue?: T;
    modelPropName?: string;
  },
): Promise<T | undefined> {
  const {
    component: _component,
    componentProps: _componentProps,
    content,
    defaultValue,
    modelPropName: _modelPropName,
    ...delegated
  } = options;
  const contents: Component[] = [];
  const modelValue = ref<T | undefined>(defaultValue);
  if (isString(content)) {
    contents.push(h('span', content));
  } else {
    contents.push(content);
  }
  const componentProps = _componentProps || {};
  const modelPropName = _modelPropName || 'modelValue';
  componentProps[modelPropName] = modelValue.value;
  componentProps[`onUpdate:${modelPropName}`] = (val: any) => {
    modelValue.value = val;
  };
  const componentRef = h(_component || Input, componentProps);
  contents.push(componentRef);
  const props: AlertProps & Recordable<any> = {
    ...delegated,
    async beforeClose(scope: BeforeCloseScope) {
      if (delegated.beforeClose) {
        return await delegated.beforeClose({
          ...scope,
          value: modelValue.value,
        });
      }
    },
    content: h(
      'div',
      { class: 'flex flex-col gap-2' },
      { default: () => contents },
    ),
    onOpened() {
      // 组件挂载完成后，自动聚焦到输入组件
      if (
        componentRef.component?.exposed &&
        isFunction(componentRef.component.exposed.focus)
      ) {
        componentRef.component.exposed.focus();
      } else if (componentRef.el && isFunction(componentRef.el.focus)) {
        componentRef.el.focus();
      }
    },
  };
  await vbenConfirm(props);
  return modelValue.value;
}

export function clearAllAlerts() {
  alerts.value.forEach((alert) => {
    // 从DOM中移除容器
    render(null, alert.container);
    if (alert.container.parentNode) {
      alert.container.remove();
    }
  });
  alerts.value = [];
}
