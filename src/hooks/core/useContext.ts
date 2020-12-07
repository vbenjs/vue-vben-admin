import {
  InjectionKey,
  provide,
  inject,
  reactive,
  readonly as defineReadonly,
  defineComponent,
  UnwrapRef,
} from 'vue';

export interface CreateContextOptions {
  readonly?: boolean;
  createProvider?: boolean;
}

type ShallowUnwrap<T> = {
  [P in keyof T]: UnwrapRef<T[P]>;
};

export function createContext<T>(
  context: any,
  key: InjectionKey<T> = Symbol(),
  options: CreateContextOptions = {}
) {
  const { readonly = true, createProvider = false } = options;

  const state = reactive(context);

  const provideData = readonly ? defineReadonly(state) : state;
  !createProvider && provide(key, provideData);

  const Provider = createProvider
    ? defineComponent({
        name: 'Provider',
        inheritAttrs: false,
        setup(_, { slots }) {
          provide(key, provideData);
          return () => slots.default?.();
        },
      })
    : null;

  return { Provider, state };
}

export const useContext = <T>(
  key: InjectionKey<T> = Symbol(),
  defaultValue?: any,
  readonly = false
): ShallowUnwrap<T> => {
  const state = inject(key, defaultValue || {});

  return readonly ? defineReadonly(state) : state;
};
