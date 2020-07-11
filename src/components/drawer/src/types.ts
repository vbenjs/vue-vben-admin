import { Drawer } from 'ant-design-vue/types/drawer';
import { Ref } from '@/setup/vue';
import { ScrollContainerOptions } from '@/components/container/index';

/**
 * @description: 弹窗对外暴露的方法
 */
export interface DrawerInstance {
  setDrawerProps: (props: Partial<DrawerProps>) => void;
  // injectModal: <T>(...T) => void;
}
export interface ReturnMethods extends DrawerInstance {
  openDrawer: (props: Partial<DrawerProps>) => void;
  isFirstLoadRef: Ref<boolean>;
}
export type GetDrawerFn = (drawerInstance: DrawerInstance) => void;

export type UseDrawerReturnType = [GetDrawerFn, ReturnMethods];
export enum DrawerType {
  DETAIL,
  DEFAULT,
}
export interface DrawerProps extends Drawer {
  drawerType: DrawerType;
  loading?: boolean;
  showOkBtn?: boolean;
  showCancelBtn?: boolean;
  /**
   * 内置的ScrollContainer组件配置
   * @type ScrollContainerOptions
   */
  scrollOptions?: ScrollContainerOptions;
  closeFunc?: () => Promise<void>;
  triggerWindowResize?: boolean;
}
