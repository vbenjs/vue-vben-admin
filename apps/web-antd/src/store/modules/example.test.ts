import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';

import { useCounterStore } from './example';

describe('useCounterStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('count test', () => {
    setActivePinia(createPinia());
    const counterStore = useCounterStore();

    expect(counterStore.count).toBe(0);
  });
});
