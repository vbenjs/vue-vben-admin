import { tryOnUnmounted } from '@vueuse/core';
import type { Component } from 'vue';

import { add, del } from '../componentMap';
import type { ComponentType } from '../types/index';

export function useComponentRegister(compName: ComponentType, comp: Component) {
  add(compName, comp);
  tryOnUnmounted(() => {
    del(compName);
  });
}
