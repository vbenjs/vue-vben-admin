import type { RouteRecordRaw } from 'vue-router';

import type { Component } from 'vue';

// 定义递归类型以将 RouteRecordRaw 的 component 属性更改为 string
type RouteRecordStringComponent<T = string> = {
  children?: RouteRecordStringComponent<T>[];
  component: T;
} & Omit<RouteRecordRaw, 'children' | 'component'>;

type ComponentRecordType = Record<string, () => Promise<Component>>;

export type { ComponentRecordType, RouteRecordStringComponent };
