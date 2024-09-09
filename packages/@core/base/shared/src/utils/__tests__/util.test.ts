import { describe, expect, it } from 'vitest';

import { bindMethods } from '../util';

class TestClass {
  public value: string;

  constructor(value: string) {
    this.value = value;
    bindMethods(this); // 调用通用方法
  }

  getValue() {
    return this.value;
  }

  setValue(newValue: string) {
    this.value = newValue;
  }
}

describe('bindMethods', () => {
  it('should bind methods to the instance correctly', () => {
    const instance = new TestClass('initial');

    // 解构方法
    const { getValue } = instance;

    // 检查 getValue 是否能正确调用，并且 this 绑定了 instance
    expect(getValue()).toBe('initial');
  });

  it('should bind multiple methods', () => {
    const instance = new TestClass('initial');

    const { getValue, setValue } = instance;

    // 检查 getValue 和 setValue 方法是否正确绑定了 this
    setValue('newValue');
    expect(getValue()).toBe('newValue');
  });

  it('should not bind non-function properties', () => {
    const instance = new TestClass('initial');

    // 检查普通属性是否保持原样
    expect(instance.value).toBe('initial');
  });

  it('should not bind constructor method', () => {
    const instance = new TestClass('test');

    // 检查 constructor 是否没有被绑定
    expect(instance.constructor.name).toBe('TestClass');
  });

  it('should not bind getter/setter properties', () => {
    class TestWithGetterSetter {
      private _value: string = 'test';

      constructor() {
        bindMethods(this);
      }

      get value() {
        return this._value;
      }

      set value(newValue: string) {
        this._value = newValue;
      }
    }

    const instance = new TestWithGetterSetter();
    const { value } = instance;

    // Getter 和 setter 不应被绑定
    expect(value).toBe('test');
  });
});
