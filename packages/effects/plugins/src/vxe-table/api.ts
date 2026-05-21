import type { VxeGridInstance } from 'vxe-table';

import type {
  BaseFormComponentType,
  ExtendedFormApi,
} from '@vben-core/form-ui';

import type { VxeGridProps } from './types';
import type { ViewedRowHelper } from './use-viewed-row';

import { toRaw } from 'vue';

import { Store } from '@vben-core/shared/store';
import {
  bindMethods,
  isBoolean,
  isFunction,
  mergeWithArrayOverride,
  StateHandler,
} from '@vben-core/shared/utils';

function getDefaultState(): VxeGridProps {
  return {
    class: '',
    gridClass: '',
    gridOptions: {},
    gridEvents: {},
    formOptions: undefined,
    showSearchForm: true,
  };
}

export class VxeGridApi<
  T extends Record<string, any> = any,
  D extends BaseFormComponentType = BaseFormComponentType,
  P extends Record<string, any> = Record<never, never>,
> {
  public formApi = {} as ExtendedFormApi;

  // private prevState: null | VxeGridProps = null;
  public grid = {} as VxeGridInstance<T>;
  public state: null | VxeGridProps<T, D, P> = null;

  public store: Store<VxeGridProps<T, D, P>>;

  /**
   * 已读行 helper（在 mount 中初始化，业务能力全部封装在 useViewedRow 中）
   */
  public viewedRowHelper: null | ViewedRowHelper<T> = null;

  private isMounted = false;

  private stateHandler: StateHandler;

  constructor(options: VxeGridProps<T, D, P> = {} as VxeGridProps<T, D, P>) {
    const storeState = { ...options };

    const defaultState = getDefaultState();
    this.store = new Store<VxeGridProps<T, D, P>>(
      mergeWithArrayOverride(storeState, defaultState) as VxeGridProps<T, D, P>,
    );

    this.store.subscribe((state) => {
      // this.prevState = this.state;
      this.state = state;
    });

    this.state = this.store.state;
    this.stateHandler = new StateHandler();
    bindMethods(this);
  }

  /**
   * 清除所有已读状态
   */
  clearViewedRows() {
    this.viewedRowHelper?.clearViewed();
  }

  /**
   * 获取所有已读的 key 集合（返回副本，避免外部修改内部状态）
   */
  getViewedKeys(): Set<number | string> {
    const raw = this.viewedRowHelper?.viewedSet.value;
    return raw ? new Set(raw) : new Set();
  }

  /**
   * 判断某行是否已读
   */
  isRowViewed(record: T): boolean {
    return this.viewedRowHelper?.isViewed(record) ?? false;
  }

  /**
   * 批量标记行为已读
   */
  markKeysAsViewed(keys: Array<number | string>) {
    this.viewedRowHelper?.markKeysAsViewed(keys);
  }

  /**
   * 标记某行为已读
   */
  markRowAsViewed(record: T) {
    this.viewedRowHelper?.markAsViewed(record);
  }

  mount(instance: null | VxeGridInstance, formApi: ExtendedFormApi) {
    if (!this.isMounted && instance) {
      this.grid = instance;
      this.formApi = formApi;
      this.stateHandler.setConditionTrue();
      this.isMounted = true;
    }
  }

  async query(params: Record<string, any> = {}) {
    try {
      await this.grid.commitProxy('query', toRaw(params));
    } catch (error) {
      console.error('Error occurred while querying:', error);
    }
  }

  async reload(params: Record<string, any> = {}) {
    try {
      await this.grid.commitProxy('reload', toRaw(params));
    } catch (error) {
      console.error('Error occurred while reloading:', error);
    }
  }

  /**
   * 移除指定 key 的已读状态
   */
  removeViewedKeys(keys: Array<number | string>) {
    this.viewedRowHelper?.removeKeys(keys);
  }

  setGridOptions(options: Partial<VxeGridProps<T, D, P>['gridOptions']>) {
    this.setState({
      gridOptions: options,
    });
  }

  setLoading(isLoading: boolean) {
    this.setState({
      gridOptions: {
        loading: isLoading,
      },
    });
  }

  setState(
    stateOrFn:
      | ((prev: VxeGridProps<T, D, P>) => Partial<VxeGridProps<T, D, P>>)
      | Partial<VxeGridProps<T, D, P>>,
  ) {
    if (isFunction(stateOrFn)) {
      this.store.setState((prev) => {
        return mergeWithArrayOverride(stateOrFn(prev), prev);
      });
    } else {
      this.store.setState((prev) => mergeWithArrayOverride(stateOrFn, prev));
    }
  }

  toggleSearchForm(show?: boolean) {
    this.setState({
      showSearchForm: isBoolean(show) ? show : !this.state?.showSearchForm,
    });
    // nextTick(() => {
    //   this.grid.recalculate();
    // });
    return this.state?.showSearchForm;
  }

  unmount() {
    this.isMounted = false;
    this.stateHandler.reset();
    this.viewedRowHelper = null;
  }
}
