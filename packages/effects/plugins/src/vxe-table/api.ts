import type { VxeGridInstance } from 'vxe-table';

import type { VxeGridProps, VxePaginationInfo } from './types';

import { Store } from '@vben-core/shared/store';
import {
  bindMethods,
  isFunction,
  mergeWithArrayOverride,
  StateHandler,
} from '@vben-core/shared/utils';

function getDefaultState(): VxeGridProps {
  return {
    class: '',
    gridClass: '',
    gridOptions: {},
    paginationClass: '',
    paginationOptions: {},
    paginationInfo: {
      currentPage: 1,
      pageSize: 20,
      total: 0,
    },
    gridEvent: {},
  };
}

export class VxeGridApi {
  // private prevState: null | VxeGridProps = null;
  public grid = {} as VxeGridInstance;

  isMounted = false;
  public state: null | VxeGridProps = null;

  stateHandler: StateHandler;

  public store: Store<VxeGridProps>;

  constructor(options: VxeGridProps = {}) {
    const { ...storeState } = options;

    const defaultState = getDefaultState();
    this.store = new Store<VxeGridProps>(
      mergeWithArrayOverride(storeState, defaultState),
      {
        onUpdate: () => {
          // this.prevState = this.state;
          this.state = this.store.state;
        },
      },
    );

    this.state = this.store.state;
    this.stateHandler = new StateHandler();
    bindMethods(this);
  }

  getPaginationInfo() {
    return this.state?.paginationInfo;
  }

  mount(instance: null | VxeGridInstance) {
    if (!this.isMounted && instance) {
      this.grid = instance;
      this.stateHandler.setConditionTrue();
      this.isMounted = true;
    }
  }

  async reload(page?: number) {
    if (page) {
      this.setPaginationInfo({
        currentPage: page,
      });
    }

    await this.grid?.commitProxy?.('reload');
  }

  setGridOptions(options: Partial<VxeGridProps['gridOptions']>) {
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

  setPaginationInfo(info: Partial<VxePaginationInfo>) {
    this.setState({
      paginationInfo: info,
    });
  }

  setState(
    stateOrFn:
      | ((prev: VxeGridProps) => Partial<VxeGridProps>)
      | Partial<VxeGridProps>,
  ) {
    if (isFunction(stateOrFn)) {
      this.store.setState((prev) => {
        return mergeWithArrayOverride(stateOrFn(prev), prev);
      });
    } else {
      this.store.setState((prev) => mergeWithArrayOverride(stateOrFn, prev));
    }
  }

  unmounted() {
    this.isMounted = false;
    this.stateHandler.reset();
  }
}
