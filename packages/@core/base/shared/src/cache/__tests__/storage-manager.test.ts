import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MemoryStorageDriver } from '../memory-storage-driver';
import { StorageManager } from '../storage-manager';

describe('storageManager', () => {
  let storageManager: StorageManager;

  beforeEach(() => {
    vi.useFakeTimers();
    storageManager = new StorageManager({
      driver: new MemoryStorageDriver(),
      prefix: 'test_',
    });
  });

  it('should set and get an item', async () => {
    await storageManager.setItem('user', { age: 30, name: 'John Doe' });
    const user = await storageManager.getItem('user');
    expect(user).toEqual({ age: 30, name: 'John Doe' });
  });

  it('should return default value if item does not exist', async () => {
    const user = await storageManager.getItem('nonexistent', {
      age: 0,
      name: 'Default User',
    });
    expect(user).toEqual({ age: 0, name: 'Default User' });
  });

  it('should remove an item', async () => {
    await storageManager.setItem('user', { age: 30, name: 'John Doe' });
    await storageManager.removeItem('user');
    const user = await storageManager.getItem('user');
    expect(user).toBeNull();
  });

  it('should clear all items with the prefix', async () => {
    await storageManager.setItem('user1', { age: 30, name: 'John Doe' });
    await storageManager.setItem('user2', { age: 25, name: 'Jane Doe' });
    await storageManager.clear();
    expect(await storageManager.getItem('user1')).toBeNull();
    expect(await storageManager.getItem('user2')).toBeNull();
  });

  it('should clear expired items', async () => {
    await storageManager.setItem('user', { age: 30, name: 'John Doe' }, 1000); // 1秒过期
    vi.advanceTimersByTime(1001); // 快进时间
    await storageManager.clearExpiredItems();
    const user = await storageManager.getItem('user');
    expect(user).toBeNull();
  });

  it('should not clear non-expired items', async () => {
    await storageManager.setItem('user', { age: 30, name: 'John Doe' }, 10_000); // 10秒过期
    vi.advanceTimersByTime(5000); // 快进时间
    await storageManager.clearExpiredItems();
    const user = await storageManager.getItem('user');
    expect(user).toEqual({ age: 30, name: 'John Doe' });
  });

  it('should return null for non-existent items without default value', async () => {
    const user = await storageManager.getItem('nonexistent');
    expect(user).toBeNull();
  });

  it('should overwrite existing items', async () => {
    await storageManager.setItem('user', { age: 30, name: 'John Doe' });
    await storageManager.setItem('user', { age: 25, name: 'Jane Doe' });
    const user = await storageManager.getItem('user');
    expect(user).toEqual({ age: 25, name: 'Jane Doe' });
  });

  it('should handle items without expiry correctly', async () => {
    await storageManager.setItem('user', { age: 30, name: 'John Doe' });
    vi.advanceTimersByTime(5000);
    const user = await storageManager.getItem('user');
    expect(user).toEqual({ age: 30, name: 'John Doe' });
  });

  it('should remove expired items when accessed', async () => {
    await storageManager.setItem('user', { age: 30, name: 'John Doe' }, 1000); // 1秒过期
    vi.advanceTimersByTime(1001); // 快进时间
    const user = await storageManager.getItem('user');
    expect(user).toBeNull();
  });

  it('should not remove non-expired items when accessed', async () => {
    await storageManager.setItem('user', { age: 30, name: 'John Doe' }, 10_000); // 10秒过期
    vi.advanceTimersByTime(5000); // 快进时间
    const user = await storageManager.getItem('user');
    expect(user).toEqual({ age: 30, name: 'John Doe' });
  });

  it('should handle multiple items with different expiry times', async () => {
    await storageManager.setItem('user1', { age: 30, name: 'John Doe' }, 1000); // 1秒过期
    await storageManager.setItem('user2', { age: 25, name: 'Jane Doe' }, 2000); // 2秒过期
    vi.advanceTimersByTime(1500); // 快进时间
    await storageManager.clearExpiredItems();
    const user1 = await storageManager.getItem('user1');
    const user2 = await storageManager.getItem('user2');
    expect(user1).toBeNull();
    expect(user2).toEqual({ age: 25, name: 'Jane Doe' });
  });

  it('should handle items with no expiry', async () => {
    await storageManager.setItem('user', { age: 30, name: 'John Doe' });
    vi.advanceTimersByTime(10_000); // 快进时间
    await storageManager.clearExpiredItems();
    const user = await storageManager.getItem('user');
    expect(user).toEqual({ age: 30, name: 'John Doe' });
  });

  it('should clear all items correctly', async () => {
    await storageManager.setItem('user1', { age: 30, name: 'John Doe' });
    await storageManager.setItem('user2', { age: 25, name: 'Jane Doe' });
    await storageManager.clear();
    const user1 = await storageManager.getItem('user1');
    const user2 = await storageManager.getItem('user2');
    expect(user1).toBeNull();
    expect(user2).toBeNull();
  });
});
