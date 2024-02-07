import type { ComputedRef, Slot, Slots } from 'vue';
import type { SmartSearchFormProps, SmartSearchFormSchema } from '@/components/SmartTable';
import type { FormProps } from '@/components/Form';
import type { FetchParams, SmartTableProps } from '../types/SmartTableType';
import type { SmartSearchFormParameter } from '../types/SmartSearchFormType';
import type { VxeGridPropTypes } from 'vxe-table';

import { computed, ref, unref } from 'vue';
import { useForm } from '@/components/Form';
import { isArray, isBoolean } from '@/utils/is';
import { getFormSize } from '../utils';

export const useTableSearchForm = (
  propsRef: ComputedRef<SmartTableProps>,
  slots: Slots,
  fetch: (opt?: FetchParams | undefined) => Promise<void>,
  getLoading: ComputedRef<boolean | undefined>,
  setPagination: (info: Partial<VxeGridPropTypes.PagerConfig>) => void,
) => {
  /**
   * 搜索form显示状态
   */
  const searchFormVisibleRef = ref(unref(propsRef)?.searchFormConfig?.defaultVisible !== false);
  const setSearchFormVisible = (visible?: boolean) => {
    if (isBoolean(visible)) {
      searchFormVisibleRef.value = visible;
    } else {
      searchFormVisibleRef.value = !unref(searchFormVisibleRef);
    }
  };
  const getSearchFormVisible = computed(() => unref(searchFormVisibleRef));

  const [registerSearchForm, searchFormAction] = useForm();

  /**
   * searchForm props计算属性
   */
  const getSearchFormProps = computed((): Partial<FormProps> => {
    const { searchFormConfig, size } = unref(propsRef);
    const { submitButtonOptions, resetButtonOptions } = searchFormConfig || {};
    const props: FormProps = {
      ...searchFormConfig,
      submitButtonOptions: {
        loading: unref(getLoading),
        ...{ preIcon: 'ant-design:search-outlined' },
        ...submitButtonOptions,
      },
      resetButtonOptions: {
        ...{ preIcon: 'ic:baseline-restart-alt' },
        ...resetButtonOptions,
      },
    };
    if (size) {
      props.size = searchFormConfig?.size || getFormSize(size);
    }
    return props;
  });

  /**
   * 搜索条件触发
   */
  const handleSearchInfoChange = () => {
    setPagination({
      currentPage: 1,
    });
    fetch({
      page: {
        currentPage: 1,
      },
    });
  };

  function replaceFormSlotKey(key: string) {
    if (!key) return '';
    return key?.replace?.(/searchForm-/, '') ?? '';
  }

  /**
   * form slot key计算属性
   */
  const getSearchFormSlot: ComputedRef<Slots> = computed(() => {
    const result: { [name: string]: Slot | undefined } = {};
    Object.keys(slots)
      .map((item) => (item.startsWith('searchForm-') ? item : null))
      .filter((item) => !!item)
      .forEach((item) => {
        const formKey = replaceFormSlotKey(item as string);
        result[formKey] = slots[item as string];
      });
    return result;
  });

  const getSearchFormColumnSlot = computed<Slots>(() => {
    const { searchFormConfig } = unref(propsRef);
    const slotNames =
      (searchFormConfig?.schemas
        ?.map((item: any) => {
          const { slot } = item;
          return slot;
        })
        .filter((item) => !!item) as string[]) || [];
    const result: { [name: string]: Slot | undefined } = {};
    slotNames.forEach((item) => {
      result[item] = slots[item];
    });
    return result;
  });

  /**
   * 获取搜索表单参数
   */
  const getSearchFormParameter = (): SmartSearchFormParameter => {
    if (!unref(propsRef).useSearchForm) {
      return {};
    }
    const searchForm = searchFormAction.getFieldsValue();
    const searchWithSymbol = unref(propsRef).searchFormConfig?.searchWithSymbol;
    const result: SmartSearchFormParameter = {
      searchWithSymbol: isBoolean(searchWithSymbol) && searchWithSymbol,
    };
    if (result.searchWithSymbol) {
      // 处理搜索符号
      const { symbolForm, noSymbolForm } = dealSearchSymbol(searchForm);
      result.searchSymbolForm = symbolForm;
      result.noSymbolForm = noSymbolForm;
    }
    result.searchForm = searchForm;
    return result;
  };

  /**
   * 获取搜索符号
   */
  const getSearchFormSymbolRef = computed<{ [index: string]: SmartSearchFormSchema } | boolean>(
    () => {
      const { searchFormConfig, useSearchForm } = unref(propsRef);
      const searchWithSymbol = searchFormConfig?.searchWithSymbol;
      if (!useSearchForm || !searchWithSymbol) {
        return false;
      }
      const { schemas } = searchFormConfig as Partial<SmartSearchFormProps>;
      const result: { [index: string]: SmartSearchFormSchema } = {};
      schemas?.forEach((item) => {
        result[item.field] = item;
      });
      return result;
    },
  );

  const dealSearchSymbol = (info: Recordable) => {
    const symbolForm: Recordable = {};
    const noSymbolForm: Recordable = {};
    const getSearchFormSymbol = unref(getSearchFormSymbolRef);
    if (isBoolean(getSearchFormSymbol)) {
      return info;
    }
    Object.keys(info).forEach((key) => {
      const value = info[key];
      const schema = getSearchFormSymbol[key];
      const { searchSymbol: symbol, customSymbol } = schema;
      if (customSymbol) {
        // 自定义符号
        const customSymbolResult = customSymbol({
          schema,
          value,
          model: info,
        });
        if (customSymbolResult) {
          Object.assign(symbolForm, customSymbolResult);
        }
      } else if (schema.searchSymbol) {
        if (symbol === 'between') {
          // between特殊处理
          if (value && isArray(value) && value.length === 2) {
            symbolForm[`${key}@>=`] = value[0];
            symbolForm[`${key}@<=`] = value[1];
          }
        } else {
          symbolForm[`${key}@${symbol}`] = value;
        }
      } else {
        noSymbolForm[key] = value;
      }
    });
    return {
      symbolForm,
      noSymbolForm,
    };
  };

  return {
    getSearchFormProps,
    handleSearchInfoChange,
    getSearchFormSlot,
    getSearchFormColumnSlot,
    registerSearchForm,
    getSearchFormVisible,
    searchFormAction: {
      ...searchFormAction,
      getSearchFormParameter,
      getSearchFormVisible,
      setSearchFormVisible,
    },
  };
};
