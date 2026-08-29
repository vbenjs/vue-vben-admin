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
import { COMPONENT_MAP, setupVbenForm } from '../src/config';
import { useVbenForm } from '../src/use-vben-form';

const wrappers: VueWrapper[] = [];

// 探针：记录 ElTreeSelect 实际收到的 props/attrs 键
let capturedTreeSelectKeys: string[] = [];
let capturedTreeSelectNodeName: unknown;
let capturedTreeSelectNameValue: unknown;
let capturedDeclaredName: unknown;

// 声明 name 为语义 prop 的探针组件：验证 componentProps.name 不被剥离
const DeclaredNameComponent = defineComponent({
  name: 'DeclaredNameComponent',
  props: {
    name: { type: String, default: '' },
  },
  setup(props) {
    capturedDeclaredName = props.name;
    return () => h('div', `name:${props.name ?? ''}`);
  },
});

const ProbeTreeSelect = defineComponent({
  name: 'ProbeTreeSelect',
  inheritAttrs: false,
  setup(props, { attrs }) {
    capturedTreeSelectKeys = [...Object.keys(props), ...Object.keys(attrs)];
    capturedTreeSelectNodeName = Reflect.get(attrs, 'nodeName');
    capturedTreeSelectNameValue = Reflect.get(attrs, 'name');
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
  capturedTreeSelectNameValue = undefined;
  capturedDeclaredName = undefined;
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

    // 打开 TreeSelect 弹层：issue #8214 的崩溃发生在弹层 floating 定位
    // （getNodeName 读取被劫持的 form.nodeName）阶段，此处验证完整打开流程无错
    await wrapper.find('.el-select__wrapper').trigger('click');
    await flushPromises();
    await nextTick();
    expect(renderError).toBeUndefined();
    expect(consoleError).not.toHaveBeenCalled();

    // 原生控件上不应存在 name="nodeName"：<input name="nodeName"> 会劫持
    // form.nodeName 访问器（issue #8214 的根因）
    expect(wrapper.find('input[name="nodeName"]').exists()).toBe(false);

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

  it('keeps model binding when modelPropName resolves to name and its value collides', async () => {
    // coderabbit review 边界：modelPropName: 'name' 时 binds.name 承载模型数据
    // （v-model 语义），即便其值与 <form> 固有属性同名也不得剥离；
    // 原生属性路径仍由 conflictsWithFormProperty 阻断。
    const [Form] = useVbenForm({
      schema: [
        {
          component: ProbeTreeSelect,
          componentProps: { data: [] },
          defaultValue: 'nodeName',
          fieldName: 'nodeName',
          modelPropName: 'name',
        },
      ],
    });

    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();
    await nextTick();

    // 模型绑定存活：name 键存在且承载表单数据（未被子组件 attr 路径劫持）
    expect(capturedTreeSelectKeys).toContain('name');
    expect(capturedTreeSelectNameValue).toBe('nodeName');
  });

  it('preserves componentProps.name when the component declares name as a semantic prop', async () => {
    // coderabbit review 边界：声明了 name 语义 prop 的组件，componentProps.name
    // 是组件 prop 而非原生 fallthrough 属性，值冲突也不得剥离
    const [Form] = useVbenForm({
      schema: [
        {
          component: DeclaredNameComponent,
          componentProps: { name: 'nodeName' },
          fieldName: 'nodeName',
        },
      ],
    });

    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();
    await nextTick();

    // 语义 prop 存活：组件收到的 name 就是用户显式配置的值
    expect(capturedDeclaredName).toBe('nodeName');
  });

  it('resolves string components through componentMap before the declared-prop check', async () => {
    // coderabbit review 边界：字符串组件名经 componentMap 解析出的组件若声明了
    // name 语义 prop，同样不得剥离（守卫须内省解析后的 FieldComponent）
    COMPONENT_MAP.NameDeclared = DeclaredNameComponent;
    const [Form] = useVbenForm({
      schema: [
        {
          component: 'NameDeclared',
          componentProps: { name: 'nodeName' },
          fieldName: 'nodeName',
        },
      ],
    });

    const wrapper = mount(Form);
    wrappers.push(wrapper);
    await flushPromises();
    await nextTick();

    expect(capturedDeclaredName).toBe('nodeName');
  });
});
