import type { ComponentType } from '../types';
import { tryOnUnmounted } from '@vueuse/core';
import { add, del } from '../componentMap';
import type { Component } from 'vue';
import { isPascalCase } from '@/utils/is';

export function useComponentRegister<T extends string, R extends Component>(
  compName: ComponentType | T,
  comp: R,
) {
  if (!isPascalCase(compName)) {
    throw new Error('compName must be in PascalCase');
  }

  add(compName, comp);
  tryOnUnmounted(() => {
    del(compName);
  });
}
