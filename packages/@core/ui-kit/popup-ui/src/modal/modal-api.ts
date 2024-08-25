import type { ModalApiOptions, ModalState } from './modal';

import { isFunction, Store } from '@vben-core/shared';

export class ModalApi {
  private api: Pick<
    ModalApiOptions,
    'onBeforeClose' | 'onCancel' | 'onConfirm' | 'onOpenChange'
  >;
  // private prevState!: ModalState;
  private state!: ModalState;

  // 共享数据
  public sharedData: Record<'payload', any> = {
    payload: {},
  };

  public store: Store<ModalState>;

  constructor(options: ModalApiOptions = {}) {
    const {
      connectedComponent: _,
      onBeforeClose,
      onCancel,
      onConfirm,
      onOpenChange,
      ...storeState
    } = options;

    const defaultState: ModalState = {
      cancelText: '取消',
      centered: false,
      closeOnClickModal: true,
      closeOnPressEscape: true,
      confirmLoading: false,
      confirmText: '确定',
      draggable: false,
      footer: true,
      fullscreen: false,
      fullscreenButton: true,
      isOpen: false,
      loading: false,
      modal: true,
      sharedData: {},
      title: '',
    };

    this.store = new Store<ModalState>(
      {
        ...defaultState,
        ...storeState,
      },
      {
        onUpdate: () => {
          const state = this.store.state;

          // 每次更新状态时，都会调用 onOpenChange 回调函数
          if (state?.isOpen === this.state?.isOpen) {
            this.state = state;
          } else {
            this.state = state;
            this.api.onOpenChange?.(!!state?.isOpen);
          }
        },
      },
    );

    this.api = {
      onBeforeClose,
      onCancel,
      onConfirm,
      onOpenChange,
    };
  }

  // 如果需要多次更新状态，可以使用 batch 方法
  batchStore(cb: () => void) {
    this.store.batch(cb);
  }

  /**
   * 关闭弹窗
   */
  close() {
    // 通过 onBeforeClose 钩子函数来判断是否允许关闭弹窗
    // 如果 onBeforeClose 返回 false，则不关闭弹窗
    const allowClose = this.api.onBeforeClose?.() ?? true;
    if (allowClose) {
      this.store.setState((prev) => ({ ...prev, isOpen: false }));
    }
  }

  getData<T extends object = Record<string, any>>() {
    return (this.sharedData?.payload ?? {}) as T;
  }

  /**
   * 取消操作
   */
  onCancel() {
    if (this.api.onCancel) {
      this.api.onCancel?.();
    } else {
      this.close();
    }
  }

  /**
   * 确认操作
   */
  onConfirm() {
    this.api.onConfirm?.();
  }

  open() {
    this.store.setState((prev) => ({ ...prev, isOpen: true }));
  }

  setData<T>(payload: T) {
    this.sharedData.payload = payload;
  }

  setState(
    stateOrFn:
      | ((prev: ModalState) => Partial<ModalState>)
      | Partial<ModalState>,
  ) {
    if (isFunction(stateOrFn)) {
      this.store.setState(stateOrFn);
    } else {
      this.store.setState((prev) => ({ ...prev, ...stateOrFn }));
    }
  }
}
