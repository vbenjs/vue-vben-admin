import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { StorageCache } from './storage-cache';

describe('storageCache', () => {
  let localStorageCache: StorageCache;
  let sessionStorageCache: StorageCache;

  beforeEach(() => {
    localStorageCache = new StorageCache('prefix_', 'localStorage');
    sessionStorageCache = new StorageCache('prefix_', 'sessionStorage');
    localStorage.clear();
    sessionStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should set and get an item with prefix in localStorage', () => {
    localStorageCache.setItem('testKey', 'testValue');
    const value = localStorageCache.getItem<string>('testKey');
    expect(value).toBe('testValue');
    expect(localStorage.getItem('prefix_testKey')).not.toBeNull();
  });

  it('should set and get an item with prefix in sessionStorage', () => {
    sessionStorageCache.setItem('testKey', 'testValue');
    const value = sessionStorageCache.getItem<string>('testKey');
    expect(value).toBe('testValue');
    expect(sessionStorage.getItem('prefix_testKey')).not.toBeNull();
  });

  it('should return null for expired item in localStorage', () => {
    localStorageCache.setItem('testKey', 'testValue', 1 / 60); // 1 second expiry
    vi.advanceTimersByTime(2000); // Fast-forward 2 seconds
    const value = localStorageCache.getItem<string>('testKey');
    expect(value).toBeNull();
  });

  it('should return null for expired item in sessionStorage', () => {
    sessionStorageCache.setItem('testKey', 'testValue', 1 / 60); // 1 second expiry
    vi.advanceTimersByTime(2000); // Fast-forward 2 seconds
    const value = sessionStorageCache.getItem<string>('testKey');
    expect(value).toBeNull();
  });

  it('should remove an item with prefix in localStorage', () => {
    localStorageCache.setItem('testKey', 'testValue');
    localStorageCache.removeItem('testKey');
    const value = localStorageCache.getItem<string>('testKey');
    expect(value).toBeNull();
    expect(localStorage.getItem('prefix_testKey')).toBeNull();
  });

  it('should remove an item with prefix in sessionStorage', () => {
    sessionStorageCache.setItem('testKey', 'testValue');
    sessionStorageCache.removeItem('testKey');
    const value = sessionStorageCache.getItem<string>('testKey');
    expect(value).toBeNull();
    expect(sessionStorage.getItem('prefix_testKey')).toBeNull();
  });

  it('should clear all items in localStorage', () => {
    localStorageCache.setItem('testKey1', 'testValue1');
    localStorageCache.setItem('testKey2', 'testValue2');
    localStorageCache.clear();
    expect(localStorageCache.length()).toBe(0);
  });

  it('should clear all items in sessionStorage', () => {
    sessionStorageCache.setItem('testKey1', 'testValue1');
    sessionStorageCache.setItem('testKey2', 'testValue2');
    sessionStorageCache.clear();
    expect(sessionStorageCache.length()).toBe(0);
  });

  it('should return correct length in localStorage', () => {
    localStorageCache.setItem('testKey1', 'testValue1');
    localStorageCache.setItem('testKey2', 'testValue2');
    expect(localStorageCache.length()).toBe(2);
  });

  it('should return correct length in sessionStorage', () => {
    sessionStorageCache.setItem('testKey1', 'testValue1');
    sessionStorageCache.setItem('testKey2', 'testValue2');
    expect(sessionStorageCache.length()).toBe(2);
  });

  it('should return correct key by index in localStorage', () => {
    localStorageCache.setItem('testKey1', 'testValue1');
    localStorageCache.setItem('testKey2', 'testValue2');
    expect(localStorageCache.key(0)).toBe('prefix_testKey1');
    expect(localStorageCache.key(1)).toBe('prefix_testKey2');
  });

  it('should return correct key by index in sessionStorage', () => {
    sessionStorageCache.setItem('testKey1', 'testValue1');
    sessionStorageCache.setItem('testKey2', 'testValue2');
    expect(sessionStorageCache.key(0)).toBe('prefix_testKey1');
    expect(sessionStorageCache.key(1)).toBe('prefix_testKey2');
  });
});
