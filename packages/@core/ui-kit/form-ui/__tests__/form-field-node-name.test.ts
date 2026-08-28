import type { VueWrapper } from '@vue/test-utils';

import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';

import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

// form-ui 是独立包，element-plus 是应用层依赖；测试直接解析 .pnpm 虚拟存储中的真实实现
// @ts-expect-error - 深路径 import 绕过包解析，类型声明缺失可预期
import {
  ElInput,
  ElTreeSelect,
} from '../../../../../node_modules/.pnpm/element-plus@2.14.5_vue@3.5.41_typescript@6.0.3_/node_modules/element-plus/es/index.mjs';
import { setupVbenForm } from '../src/config';
import { useVbenForm } from '../src/use-vben-form';

const wrappers: VueWrapper[] = [];

// 探针：记录 ElTreeSelect 实际收到的 props/attrs 键
let capturedTreeSelectKeys: string[] = [];
let capturedTreeSelectNodeName: unknown;

const ProbeTreeSelect = defineComponent({
  name: 'ProbeTreeSelect',
  inheritAttrs: false,
  setup(props, { attrs }) {
    capturedTreeSelectKeys = [...Object.keys(props), ...Object.keys(attrs)];
    capturedTreeSelectNodeName = Reflect.get(attrs, 'nodeName');
    return () => h(ElTreeSelect, { ...props, ...attrs });
  },
});

beforeAll(() => {
  setupVbenForm({
    config: {},
    rules: {},
  });
});

afterEach(() => {
  for (const wrapper of wrappers.splice(0)) {
    wrapper.unmount();
  }
  capturedTreeSelectKeys = [];
  capturedTreeSelectNodeName = undefined;
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('issue #8214: form field named nodeName crashes TreeSelect render', () => {
  it('renders MRE schema (TreeSelect parentId + Input nodeName) without error', async () => {
    // MRE: TreeSelect(fieldName parentId) + Input(fieldName nodeName)
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const [Form] = useVbenForm({
      schema: [
        {
          component: ProbeTreeSelect,
          componentProps: { data: [] },
          fieldName: 'parentId',
        },
        {
          component: ElInput,
          fieldName: 'nodeName',
        },
      ],
    });

    let renderError: unknown;
    const wrapper = mount(Form, {
      global: {
        config: {
          errorHandler: (error) => {
            renderError = error;
          },
        },
      },
    });
    wrappers.push(wrapper);
    await flushPromises();
    await nextTick();

    expect(renderError).toBeUndefined();
    expect(consoleError).not.toHaveBeenCalled();

    // 探针结果：ElTreeSelect 收到的键里不应有值为对象的 nodeName 键
    expect(capturedTreeSelectKeys).toContain('name');
    expect(capturedTreeSelectNodeName).toBeUndefined();
  });

  it('does not leak a nodeName keyed object into TreeSelect props when field is named nodeName', async () => {
    // 反向场景：TreeSelect 字段本身就是 nodeName（最严格情形）
    // 环境前提：happy-dom 的 <form> 必须支持 nodeName 固有属性，
    // 否则 conflictsWithFormProperty 检测会误判（返回 undefined → 不剥离 name）
    expect(Reflect.get(document.createElement('form'), 'nodeName')).toBe(
      'FORM',
    );
    const [Form] = useVbenForm({
      schema: [
        {
          component: ProbeTreeSelect,
          componentProps: { data: [] },
          fieldName: 'nodeName',
        },
      ],
    });

    let renderError: unknown;
    const wrapper = mount(Form, {
      global: {
        config: {
          errorHandler: (error) => {
            renderError = error;
          },
        },
      },
    });
    wrappers.push(wrapper);
    await flushPromises();
    await nextTick();

    expect(renderError).toBeUndefined();
    // 冲突字段（nodeName）的控件不应收到 name，否则 <input name="nodeName">
    // 会劫持 form.nodeName 访问器（issue #8214）
    expect(capturedTreeSelectKeys).not.toContain('name');
    expect(capturedTreeSelectNodeName).toBeUndefined();
  });
});
