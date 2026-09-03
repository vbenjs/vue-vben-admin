import { createVbenModal } from '@vben/common-ui';

export interface ExplicitModalData {
  message: string;
  method: '显式泛型';
}

export interface FactoryModalData {
  message: string;
  method: '契约工厂';
}

export const useFactoryModal = createVbenModal<FactoryModalData>();
