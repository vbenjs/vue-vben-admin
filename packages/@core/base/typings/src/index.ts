import type { VbenRouteMeta } from './vue-router';

// 模块增强随本 barrel 的导入生效：使用方经 @vben/types 的 re-export 或
// 直接依赖本包即获得 RouteMeta 增强；未导入本包的独立程序不激活。
declare module 'vue-router' {
  // oxlint-disable-next-line typescript/no-empty-object-type
  interface RouteMeta extends VbenRouteMeta {}
}

export type * from './app';
export type * from './basic';
export type * from './helper';
export type * from './languages';
export type * from './menu-record';
export type * from './tabs';
export type * from './vue-router';
