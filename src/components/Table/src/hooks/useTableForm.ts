import type { ComputedRef, Slots } from 'vue';
import type { BasicTableProps, FetchParams } from '../types/table';
import { unref, computed } from 'vue';
import type { FormProps } from '/@/components/Form';
import { isFunction } from '/@/utils/is';
export function useTableForm(
  propsRef: ComputedRef<BasicTableProps>,
  slots: Slots,
  fetch: (opt?: FetchParams | undefined) => Promise<void>,
  getLoading: ComputedRef<boolean | undefined>
) {
  const getFormProps = computed(
    (): Partial<FormProps> => {
      const { formConfig } = unref(propsRef);
      const { submitButtonOptions } = formConfig || {};
      return {
        showAdvancedButton: true,
        ...formConfig,
        submitButtonOptions: { loading: unref(getLoading), ...submitButtonOptions },
        compact: true,
      };
    }
  );

  const getFormSlotKeys = computed(() => {
    const keys = Object.keys(slots);
    return keys.map((item) => (item.startsWith('form-') ? item : null)).filter(Boolean);
  });

  function replaceFormSlotKey(key: string) {
    if (!key) return '';
    return key?.replace?.(/form\-/, '') ?? '';
  }

  function handleSearchInfoChange(info: Recordable) {
    const { handleSearchInfoFn } = unref(propsRef);
    if (handleSearchInfoFn && isFunction(handleSearchInfoFn)) {
      info = handleSearchInfoFn(info) || info;
    }
    fetch({ searchInfo: info, page: 1 });
  }

  return {
    getFormProps,
    replaceFormSlotKey,
    getFormSlotKeys,
    handleSearchInfoChange,
  };
}
