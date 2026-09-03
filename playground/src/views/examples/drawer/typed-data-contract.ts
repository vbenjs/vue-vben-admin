import { createVbenDrawer } from '@vben/common-ui';

export interface ExplicitDrawerData {
  message: string;
  method: '显式泛型';
}

export interface FactoryDrawerData {
  message: string;
  method: '契约工厂';
}

export const useFactoryDrawer = createVbenDrawer<FactoryDrawerData>();
