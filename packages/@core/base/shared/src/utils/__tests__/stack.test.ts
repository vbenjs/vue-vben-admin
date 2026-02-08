import { beforeEach, describe, expect, it } from 'vitest';

import { createStack, Stack } from '../stack';

describe('stack', () => {
  let stack: Stack<number>;

  beforeEach(() => {
    stack = new Stack<number>();
  });

  it('push & size should work', () => {
    stack.push(1, 2);

    expect(stack.size).toBe(2);
  });

  it('peek should return top element without removing it', () => {
    stack.push(1, 2);

    expect(stack.peek()).toBe(2);
    expect(stack.size).toBe(2);
  });

  it('pop should remove and return top element', () => {
    stack.push(1, 2);

    expect(stack.pop()).toBe(2);
    expect(stack.size).toBe(1);
    expect(stack.peek()).toBe(1);
  });

  it('pop on empty stack should return undefined', () => {
    expect(stack.pop()).toBeUndefined();
    expect(stack.peek()).toBeUndefined();
  });

  it('clear should remove all elements', () => {
    stack.push(1, 2);

    stack.clear();

    expect(stack.size).toBe(0);
    expect(stack.peek()).toBeUndefined();
  });

  it('toArray should return a shallow copy', () => {
    stack.push(1, 2);

    const arr = stack.toArray();
    arr.push(3);

    expect(stack.size).toBe(2);
    expect(stack.toArray()).toEqual([1, 2]);
  });

  it('dedup should remove existing item before push', () => {
    stack.push(1, 2, 1);

    expect(stack.toArray()).toEqual([2, 1]);
    expect(stack.size).toBe(2);
  });

  it('dedup = false should allow duplicate items', () => {
    const s = new Stack<number>(false);

    s.push(1, 1, 1);

    expect(s.toArray()).toEqual([1, 1, 1]);
    expect(s.size).toBe(3);
  });

  it('remove should delete all matching items', () => {
    stack.push(1, 2, 1);

    stack.remove(1);

    expect(stack.toArray()).toEqual([2]);
    expect(stack.size).toBe(1);
  });

  it('maxSize should limit stack capacity', () => {
    const s = new Stack<number>(true, 3);

    s.push(1, 2, 3, 4);

    expect(s.toArray()).toEqual([2, 3, 4]);
    expect(s.size).toBe(3);
  });

  it('dedup + maxSize should work together', () => {
    const s = new Stack<number>(true, 3);

    s.push(1, 2, 3, 2); // 去重并重新入栈

    expect(s.toArray()).toEqual([1, 3, 2]);
    expect(s.size).toBe(3);
  });

  it('createStack should create a stack instance', () => {
    const s = createStack<number>(true, 2);

    s.push(1, 2, 3);

    expect(s.toArray()).toEqual([2, 3]);
  });
});
