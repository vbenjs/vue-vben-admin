import { beforeEach, describe, expect, it, vi } from 'vitest';

import { emitEvent, offEvent, onEvent } from '../event-bus';

describe('event Bus', () => {
  beforeEach(() => {
    // 清除所有模拟函数调用记录
    vi.clearAllMocks();
  });

  it('should trigger event handler when event is emitted', () => {
    const testHandler = vi.fn();
    const testData = { message: 'test' };

    onEvent('test-event', testHandler);
    emitEvent('test-event', testData);

    expect(testHandler).toHaveBeenCalledTimes(1);
    expect(testHandler).toHaveBeenCalledWith(testData);
  });

  it('should not trigger handler after it is removed', () => {
    const testHandler = vi.fn();

    onEvent('test-event', testHandler);
    offEvent('test-event', testHandler);
    emitEvent('test-event');

    expect(testHandler).not.toHaveBeenCalled();
  });

  it('should support multiple handlers for the same event', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    const testData = 'multiple handlers';

    onEvent('multi-event', handler1);
    onEvent('multi-event', handler2);
    emitEvent('multi-event', testData);

    expect(handler1).toHaveBeenCalledWith(testData);
    expect(handler2).toHaveBeenCalledWith(testData);
  });

  it('should only remove specific handler when multiple exist', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    onEvent('remove-specific', handler1);
    onEvent('remove-specific', handler2);
    offEvent('remove-specific', handler1);
    emitEvent('remove-specific');

    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).toHaveBeenCalledTimes(1);
  });

  it('should handle events with different data types', () => {
    const dataHandler = vi.fn();

    onEvent('data-types', dataHandler);

    emitEvent('data-types', 'string');
    emitEvent('data-types', 123);
    emitEvent('data-types', true);
    emitEvent('data-types', { key: 'value' });
    emitEvent('data-types', [1, 2, 3]);

    expect(dataHandler).toHaveBeenCalledTimes(5);
    expect(dataHandler).toHaveBeenNthCalledWith(1, 'string');
    expect(dataHandler).toHaveBeenNthCalledWith(2, 123);
    expect(dataHandler).toHaveBeenNthCalledWith(3, true);
    expect(dataHandler).toHaveBeenNthCalledWith(4, { key: 'value' });
    expect(dataHandler).toHaveBeenNthCalledWith(5, [1, 2, 3]);
  });
});
