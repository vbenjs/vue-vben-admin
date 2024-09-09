import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';

import { useLockStore } from './lock';

describe('useLockStore', () => {
  beforeEach(() => {
    // 每个测试前重置 Pinia
    setActivePinia(createPinia());
  });

  it('should initialize with correct default state', () => {
    const store = useLockStore();
    expect(store.isLockScreen).toBe(false);
    expect(store.lockScreenPassword).toBeUndefined();
  });

  it('should lock screen with a password', () => {
    const store = useLockStore();
    store.lockScreen('1234');
    expect(store.isLockScreen).toBe(true);
    expect(store.lockScreenPassword).toBe('1234');
  });

  it('should unlock screen and clear password', () => {
    const store = useLockStore();
    store.lockScreen('1234');
    store.unlockScreen();
    expect(store.isLockScreen).toBe(false);
    expect(store.lockScreenPassword).toBeUndefined();
  });
});
