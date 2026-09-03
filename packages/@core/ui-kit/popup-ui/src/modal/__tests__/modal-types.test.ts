import type { ExtendedModalApi, InferModalData } from '../modal';
import type { createVbenModal, useVbenModal } from '../use-modal';
import type TypedModal from './fixtures/typed-modal.vue';

import { describe, expectTypeOf, it } from 'vitest';

interface TypedModalData {
  id: number;
  mode: 'edit' | 'view';
}

type ModalData = null | TypedModalData;

declare const createModal: typeof createVbenModal;
declare const useModal: typeof useVbenModal;

describe('modal public data types', () => {
  it('infers data from the connected component exposed api', () => {
    function assertInferredData(connectedComponent: typeof TypedModal) {
      const [, modalApi] = useModal({ connectedComponent });

      expectTypeOf(modalApi).toEqualTypeOf<ExtendedModalApi<ModalData>>();
      expectTypeOf(modalApi.getData()).toEqualTypeOf<ModalData | undefined>();
      expectTypeOf(modalApi.setData).parameter(0).toEqualTypeOf<ModalData>();
      expectTypeOf(modalApi.setData(null).open()).toBeVoid();
      // @ts-expect-error invalid payload type
      modalApi.setData({ id: '1', mode: 'edit' });
    }

    expectTypeOf<
      InferModalData<typeof TypedModal>
    >().toEqualTypeOf<ModalData>();
    expectTypeOf(assertInferredData).toBeFunction();
  });

  it('supports explicit and pre-bound data contracts', () => {
    function assertExplicitData() {
      const [, explicitApi] = useModal<ModalData>();
      const useTypedModal = createModal<ModalData>();
      const [, preBoundApi] = useTypedModal();

      expectTypeOf(explicitApi).toEqualTypeOf<ExtendedModalApi<ModalData>>();
      expectTypeOf(preBoundApi).toEqualTypeOf<ExtendedModalApi<ModalData>>();
    }

    expectTypeOf(assertExplicitData).toBeFunction();
  });

  it('falls back to unknown without a data contract', () => {
    function assertUnknownData() {
      const [, modalApi] = useModal();

      expectTypeOf(modalApi).toEqualTypeOf<ExtendedModalApi<unknown>>();
      expectTypeOf(modalApi.getData()).toBeUnknown();
    }

    expectTypeOf(assertUnknownData).toBeFunction();
  });
});
