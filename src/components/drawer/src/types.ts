import { Drawer } from 'ant-design-vue/types/drawer';
import { Button } from 'ant-design-vue/types/button/button';

import { Ref } from 'compatible-vue';
import { ScrollContainerOptions } from '@/components/container/index';

/**
 * @description: 弹窗对外暴露的方法
 */
export interface DrawerInstance {
  setDrawerProps: (props: Partial<DrawerProps> | boolean) => void;
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

export interface DrawerFooterProps {
  showOkBtn: boolean;
  showCancelBtn: boolean;
  /**
   * Text of the Cancel button
   * @default 'cancel'
   * @type string
   */
  cancelText: string;
  /**
   * Text of the OK button
   * @default 'OK'
   * @type string
   */
  okText: string;

  /**
   * Button type of the OK button
   * @default 'primary'
   * @type string
   */
  okType: 'primary' | 'danger' | 'dashed' | 'ghost' | 'default';
  /**
   * The ok button props, follow jsx rules
   * @type object
   */
  okButtonProps: { props: Button; on: {} };

  /**
   * The cancel button props, follow jsx rules
   * @type object
   */
  cancelButtonProps: { props: Button; on: {} };
  /**
   * Whether to apply loading visual effect for OK button or not
   * @default false
   * @type boolean
   */
  confirmLoading: boolean;

  showFooter: boolean;
  footerHeight: string | number;
}
export interface DrawerProps extends Drawer, DrawerFooterProps {
  drawerType: DrawerType;
  loading?: boolean;
  showDetailBack: boolean;
  // showOkBtn?: boolean;
  // showCancelBtn?: boolean;
  /**
   * 内置的ScrollContainer组件配置
   * @type ScrollContainerOptions
   */
  scrollOptions?: ScrollContainerOptions;
  closeFunc?: () => Promise<void>;
  triggerWindowResize?: boolean;
}
export interface DrawerActionType {
  scrollBottom: () => void;
  scrollTo: (to: number) => void;
  getScrollWrap: () => Element | null;
}
