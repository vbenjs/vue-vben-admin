import { InjectionKey, provide, inject, reactive, readonly } from 'vue';

export const createContext = <T>(
  context: any,
  contextInjectKey: InjectionKey<T> = Symbol(),
  _readonly = true
) => {
  const state = reactive({
    ...context,
  });
  const provideData = _readonly ? readonly(state) : state;
  provide(contextInjectKey, provideData);
};

export const useContext = <T>(
  contextInjectKey: InjectionKey<T> = Symbol(),
  defaultValue?: any,
  _readonly = true
): T => {
  const state = inject(contextInjectKey, defaultValue || {});
  return _readonly ? readonly(state) : state;
};
