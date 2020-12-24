import { isObject } from '@vue/shared';
import { reactive, Ref, ref, readonly } from 'vue';
import { isFunction } from '/@/utils/is';

type State<T> = ((s: T) => T) | T;
type Dispatch<T> = (t: T) => void;

type DispatchState<T> = Dispatch<State<T>>;

type ResultState<T> = Readonly<Ref<T>>;

export function useState<T extends undefined>(
  initialState: (() => T) | T
): [ResultState<T>, DispatchState<T>];

export function useState<T extends null>(
  initialState: (() => T) | T
): [ResultState<T>, DispatchState<T>];

export function useState<T extends boolean>(
  initialState: (() => T) | T
): [ResultState<boolean>, DispatchState<boolean>];

export function useState<T extends string>(
  initialState: (() => T) | T
): [ResultState<string>, DispatchState<string>];

export function useState<T extends number>(
  initialState: (() => T) | T
): [ResultState<number>, DispatchState<number>];

export function useState<T extends object>(
  initialState: (() => T) | T
): [Readonly<T>, DispatchState<T>];

export function useState<T extends any>(
  initialState: (() => T) | T
): [Readonly<T>, DispatchState<T>];

export function useState<T>(initialState: (() => T) | T): [ResultState<T> | T, DispatchState<T>] {
  if (isFunction(initialState)) {
    initialState = (initialState as Fn)();
  }

  if (isObject(initialState)) {
    const state = reactive({ data: initialState }) as any;
    const setState = (newState: T) => {
      state.data = newState;
    };
    return [readonly(state), setState];
  } else {
    const state = ref(initialState) as any;
    const setState = (newState: T) => {
      state.value = newState;
    };
    return [readonly(state), setState];
  }
}
