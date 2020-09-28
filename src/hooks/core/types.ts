import type { VNode, Ref } from 'vue';
import type { ModalOptions } from 'ant-design-vue/types/modal';

export type Fn<T> = () => T;
export type AnyFn<T> = (...arg: any) => T;
export type PromiseFn<T> = (...arg: any) => Promise<T>;
export type CancelFn = () => void;
export interface DebounceAndThrottleOptions {
  // 立即执行
  immediate?: boolean;

  // 是否为debounce
  debounce?: boolean;
  // 只执行一次
  once?: boolean;
}

export type DebounceAndThrottleProcedure<T extends unknown[]> = (...args: T) => unknown;

export type DebounceAndThrottleProcedureResult<T extends unknown[]> = [
  DebounceAndThrottleProcedure<T>,
  CancelFn
];

export type TimeoutResult = [Ref<boolean>, Fn<void>, Fn<void>];

export type TimeoutFnResult = [Fn<void>, Fn<void>, Ref<boolean>];

export interface PromiseState {
  loading: boolean;
  error: Error | null;
  result: any;
  done: boolean;
}
export type MessageType = 'success' | 'warning' | 'info' | 'error';

export interface CloseEventHandler {
  /**
   * Triggers when a message is being closed
   *
   * @param instance The message component that is being closed
   */
  (instance: MessageComponent): void;
}

/** Message Component */
export declare class MessageComponent {
  /** Close the Loading instance */
  close(): void;
}

export type MessageMethods = {
  [key in MessageType]?: (options: MessageOptions | string) => MessageComponent; // Note that "key in".
};

/** Options used in Message */
export interface MessageOptions {
  title: string;
  /** Message text */
  message: string | VNode;

  /** Message type */
  type?: MessageType;

  /** Custom icon's class, overrides type */
  iconClass?: string;

  /** Custom class name for Message */
  customClass?: string;

  /** Display duration, millisecond. If set to 0, it will not turn off automatically */
  duration?: number;

  /** Whether to show a close button */
  showClose?: boolean;

  /** Whether to center the text */
  center?: boolean;

  /** Whether message is treated as HTML string */
  dangerouslyUseHTMLString?: boolean;

  /** Callback function when closed with the message instance as the parameter */
  onClose?: CloseEventHandler;

  /** Set the distance to the top of viewport. Default is 20 px. */
  offset?: number;
}
export interface ModalOptionsEx extends Omit<ModalOptions, 'iconType'> {
  iconType: 'warning' | 'success' | 'error';
}
export type ModalOptionsPartial = Partial<ModalOptionsEx> & Pick<ModalOptionsEx, 'content'>;
