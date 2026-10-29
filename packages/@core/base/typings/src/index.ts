import type { RouteMeta as VRRouteMeta } from './vue-router';

// 导入本包即激活 vue-router 的 RouteMeta 模块增强（与包根 vue-router.d.ts
// 及 @vben/types/global.d.ts 的增强语义一致），使跨包使用方无需各自挂载。
declare module 'vue-router' {
  // oxlint-disable-next-line typescript/no-empty-object-type
  interface RouteMeta extends VRRouteMeta {}
}

export type * from './app';
export type * from './basic';
export type * from './helper';
export type * from './languages';
export type * from './menu-record';
export type * from './tabs';
export type * from './vue-router';
