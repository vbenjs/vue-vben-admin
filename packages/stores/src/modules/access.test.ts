import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';

import { useCoreAccessStore } from './access';

describe('useCoreAccessStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('updates accessMenus state', () => {
    const store = useCoreAccessStore();
    expect(store.accessMenus).toEqual([]);
    store.setAccessMenus([{ name: 'Dashboard', path: '/dashboard' }]);
    expect(store.accessMenus).toEqual([
      { name: 'Dashboard', path: '/dashboard' },
    ]);
  });

  it('updates userInfo and userRoles state', () => {
    const store = useCoreAccessStore();
    expect(store.userInfo).toBeNull();
    expect(store.userRoles).toEqual([]);

    const userInfo: any = { name: 'John Doe', roles: ['admin'] };
    store.setUserInfo(userInfo);

    expect(store.userInfo).toEqual(userInfo);
    expect(store.userRoles).toEqual(['admin']);
  });

  it('returns correct userInfo', () => {
    const store = useCoreAccessStore();
    const userInfo: any = { name: 'Jane Doe', roles: [{ value: 'user' }] };
    store.setUserInfo(userInfo);
    expect(store.userInfo).toEqual(userInfo);
  });

  it('updates accessToken state correctly', () => {
    const store = useCoreAccessStore();
    expect(store.accessToken).toBeNull(); // 初始状态
    store.setAccessToken('abc123');
    expect(store.accessToken).toBe('abc123');
  });

  // 测试重置用户信息时的行为
  it('clears userInfo and userRoles when setting null userInfo', () => {
    const store = useCoreAccessStore();
    store.setUserInfo({
      roles: [{ roleName: 'User', value: 'user' }],
    } as any);
    expect(store.userInfo).not.toBeNull();
    expect(store.userRoles.length).toBeGreaterThan(0);

    store.setUserInfo(null as any); // 重置用户信息
    expect(store.userInfo).toBeNull();
    expect(store.userRoles).toEqual([]);
  });

  it('returns the correct accessToken', () => {
    const store = useCoreAccessStore();
    store.setAccessToken('xyz789');
    expect(store.accessToken).toBe('xyz789');
  });

  // 测试在没有用户角色时返回空数组
  it('returns an empty array for userRoles if not set', () => {
    const store = useCoreAccessStore();
    expect(store.userRoles).toEqual([]);
  });

  // 测试设置空的访问菜单列表
  it('handles empty accessMenus correctly', () => {
    const store = useCoreAccessStore();
    store.setAccessMenus([]);
    expect(store.accessMenus).toEqual([]);
  });

  // 测试设置空的访问路由列表
  it('handles empty accessRoutes correctly', () => {
    const store = useCoreAccessStore();
    store.setAccessRoutes([]);
    expect(store.accessRoutes).toEqual([]);
  });
});
