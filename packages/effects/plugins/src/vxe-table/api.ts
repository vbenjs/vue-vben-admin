import type { VxeGridInstance } from 'vxe-table';

import type { VxeGridProps } from './types';

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
      {
        ...defaultState,
        ...storeState,
      },
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

  mount(instance: null | VxeGridInstance) {
    if (!this.isMounted && instance) {
      this.grid = instance;
      this.stateHandler.setConditionTrue();
      this.isMounted = true;
    }
  }

  async reload(...args: any[]) {
    await this.grid?.commitProxy?.('reload', ...args);
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
