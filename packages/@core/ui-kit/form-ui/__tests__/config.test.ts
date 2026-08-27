import type { BaseFormComponentType } from '../src/types';

import { afterEach, describe, expect, it } from 'vitest';

import { globalShareState } from '@vben-core/shared/global-state';

import { COMPONENT_BIND_EVENT_MAP, setupVbenForm } from '../src/config';

/** 模拟注册两个未挂载协议的组件，用于验证绑定协议的重建 */
function registerTestComponents() {
  globalShareState.setComponents({
    MyCheckbox: {},
    MyInput: {},
  });
}

/** 清空绑定协议映射，恢复初始状态 */
function resetBindEventMap() {
  for (const key of Object.keys(COMPONENT_BIND_EVENT_MAP)) {
    Reflect.deleteProperty(
      COMPONENT_BIND_EVENT_MAP,
      key as BaseFormComponentType,
    );
  }
}

afterEach(() => {
  // 清理全局单例与映射，避免影响同文件其他用例
  globalShareState.setComponents({});
  resetBindEventMap();
});

describe('setup 绑定协议重建', () => {
  it('重复 setup 后清理上一次遗留的旧绑定协议', () => {
    registerTestComponents();

    // 第一次 setup：自定义协议，两个组件分别命中映射与兜底
    setupVbenForm({
      config: {
        baseModelPropName: 'value',
        modelPropNameMap: { MyCheckbox: 'checked' },
      },
    });
    expect(COMPONENT_BIND_EVENT_MAP.MyCheckbox).toBe('checked');
    expect(COMPONENT_BIND_EVENT_MAP.MyInput).toBe('value');

    // 第二次 setup：默认协议（组件均未挂载协议），旧条目应被清理，回退默认 modelValue
    setupVbenForm({
      config: {
        baseModelPropName: 'modelValue',
        modelPropNameMap: {},
      },
    });
    expect(COMPONENT_BIND_EVENT_MAP.MyCheckbox).toBeUndefined();
    expect(COMPONENT_BIND_EVENT_MAP.MyInput).toBeUndefined();
  });

  it('重复 setup 时组件定义处挂载的协议始终优先', () => {
    globalShareState.setComponents({
      MyCheckbox: { modelPropName: 'checked' },
      MyInput: {},
    });

    // 第一次 setup：自定义兜底协议
    setupVbenForm({ config: { baseModelPropName: 'value' } });
    expect(COMPONENT_BIND_EVENT_MAP.MyCheckbox).toBe('checked');
    expect(COMPONENT_BIND_EVENT_MAP.MyInput).toBe('value');

    // 第二次 setup：默认兜底协议，组件定义处挂载的协议不受影响，未挂载的组件回退默认
    setupVbenForm({ config: { baseModelPropName: 'modelValue' } });
    expect(COMPONENT_BIND_EVENT_MAP.MyCheckbox).toBe('checked');
    expect(COMPONENT_BIND_EVENT_MAP.MyInput).toBeUndefined();
  });
});
