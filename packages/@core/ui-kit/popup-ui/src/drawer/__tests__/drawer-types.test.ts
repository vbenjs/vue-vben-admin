import type { ExtendedDrawerApi, InferDrawerData } from '../drawer';
import type { createVbenDrawer, useVbenDrawer } from '../use-drawer';
import type TypedDrawer from './fixtures/typed-drawer.vue';

import { describe, expectTypeOf, it } from 'vitest';

interface TypedDrawerData {
  id: number;
  mode: 'edit' | 'view';
}

type DrawerData = null | TypedDrawerData;

declare const createDrawer: typeof createVbenDrawer;
declare const useDrawer: typeof useVbenDrawer;

describe('drawer public data types', () => {
  it('infers data from the connected component exposed api', () => {
    function assertInferredData(connectedComponent: typeof TypedDrawer) {
      const [, drawerApi] = useDrawer({ connectedComponent });

      expectTypeOf(drawerApi).toEqualTypeOf<ExtendedDrawerApi<DrawerData>>();
      expectTypeOf(drawerApi.getData()).toEqualTypeOf<DrawerData | undefined>();
      expectTypeOf(drawerApi.setData).parameter(0).toEqualTypeOf<DrawerData>();
      expectTypeOf(drawerApi.setData(null).open()).toBeVoid();
      // @ts-expect-error invalid payload type
      drawerApi.setData({ id: '1', mode: 'edit' });
    }

    expectTypeOf<
      InferDrawerData<typeof TypedDrawer>
    >().toEqualTypeOf<DrawerData>();
    expectTypeOf(assertInferredData).toBeFunction();
  });

  it('supports explicit and pre-bound data contracts', () => {
    function assertExplicitData() {
      const [, explicitApi] = useDrawer<DrawerData>();
      const useTypedDrawer = createDrawer<DrawerData>();
      const [, preBoundApi] = useTypedDrawer();

      expectTypeOf(explicitApi).toEqualTypeOf<ExtendedDrawerApi<DrawerData>>();
      expectTypeOf(preBoundApi).toEqualTypeOf<ExtendedDrawerApi<DrawerData>>();
    }

    expectTypeOf(assertExplicitData).toBeFunction();
  });

  it('falls back to unknown without a data contract', () => {
    function assertUnknownData() {
      const [, drawerApi] = useDrawer();

      expectTypeOf(drawerApi).toEqualTypeOf<ExtendedDrawerApi<unknown>>();
      expectTypeOf(drawerApi.getData()).toBeUnknown();
    }

    expectTypeOf(assertUnknownData).toBeFunction();
  });
});
