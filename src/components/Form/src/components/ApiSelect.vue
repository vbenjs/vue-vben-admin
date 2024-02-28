<template>
  <Select
    @dropdown-visible-change="handleFetch"
    :filterOption="!searchField ? filterOption : false"
    v-bind="$attrs"
    @change="handleChange"
    @search="handleSearch"
    :options="getOptions"
    v-model:value="state"
  >
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
    <template #suffixIcon v-if="loading">
      <LoadingOutlined spin />
    </template>
    <template #notFoundContent v-if="loading">
      <span>
        <LoadingOutlined spin class="mr-1" />
        {{ t('component.form.apiSelectNotFound') }}
      </span>
    </template>
  </Select>
</template>
<script lang="ts" setup>
  import { PropType, ref, computed, unref, watch } from 'vue';
  import type { SelectValue } from 'ant-design-vue/es/select';
  import { Select } from 'ant-design-vue';
  import { isArray, isFunction, isObject } from '@/utils/is';
  import { useRuleFormItem } from '@/hooks/component/useFormItem';
  // import { useAttrs } from '@vben/hooks';
  import { cloneDeep, debounce, get } from 'lodash-es';

  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { propTypes } from '@/utils/propTypes';
  import { isEqual } from 'xe-utils';

  type OptionsItem = { label?: string; value?: string; disabled?: boolean; [name: string]: any };

  defineOptions({ name: 'ApiTransfer', inheritAttrs: false });

  const props = defineProps({
    value: { type: [Array, Object, String, Number] as PropType<SelectValue> },
    numberToString: propTypes.bool,
    api: {
      type: Function as PropType<(...arg: any) => Promise<OptionsItem[]>>,
      default: null,
    },
    itemApi: {
      type: Function as PropType<(id: number | string) => Promise<OptionsItem>>,
      default: null,
    },
    // api params
    params: propTypes.any.def({}),
    // support xxx.xxx.xx
    resultField: propTypes.string.def(''),
    labelField: propTypes.string.def('label'),
    valueField: propTypes.string.def('value'),
    searchField: propTypes.string,
    immediate: propTypes.bool.def(true),
    alwaysLoad: propTypes.bool.def(false),
    options: {
      type: Array as PropType<OptionsItem[]>,
      default: () => [],
    },
    checkedOptions: {
      type: [Array, Object] as PropType<OptionsItem[] | OptionsItem>,
    },
    formatter: {
      type: Function as PropType<<T extends OptionsItem>(item: T) => string>,
      default: null,
    },
    allowOtherValue: propTypes.bool.def(false),
  });

  const emit = defineEmits(['options-change', 'change', 'search', 'update:value']);
  const optionsRef = ref<OptionsItem[]>([]);
  const loading = ref(false);
  const isFirstLoaded = ref(false);
  const emitData = ref<any[]>([]);
  // const attrs = useAttrs();
  const { t } = useI18n();

  const searchValue = ref('');

  // Embedded in the form, just use the hook binding to perform form verification
  const [state] = useRuleFormItem(props, 'value', 'change', emitData);
  const filterOption = (input, option) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  const getOptions = computed(() => {
    const { labelField, valueField, numberToString, formatter, checkedOptions } = props;
    const cheched = isArray(checkedOptions)
      ? checkedOptions
      : isObject(checkedOptions)
        ? [checkedOptions]
        : [];
    if (cheched.length > 0) {
      cheched.forEach((item) => {
        if (optionsRef.value.find((option) => option[valueField] == item[valueField])) return;
        optionsRef.value.push(item);
      });
    }

    let data = unref(optionsRef).reduce((prev, next: any) => {
      if (next) {
        const label = formatter ? formatter(next) : get(next, labelField);
        const value = valueField === 'label' ? label : get(next, valueField);
        prev.push({
          ...next,
          label,
          value: numberToString ? `${value}` : value,
        });
      }
      return prev;
    }, [] as OptionsItem[]);
    return data.length > 0 ? data : props.options;
  });

  const getStateItems = async (res: OptionsItem[]) => {
    if (state.value === undefined) return [];
    const { itemApi, valueField } = props;
    if (!itemApi || !isFunction(itemApi)) return [];
    const options: OptionsItem[] = [];
    if (isArray(state.value)) {
      for (const item of state.value) {
        if (res.findIndex((option) => option[valueField] == item) > -1) continue;
        const data = await itemApi(Number(item));
        options.push(data);
      }
    } else {
      if (res.findIndex((option) => option[valueField] == state.value) > -1) return [];
      const data = await itemApi(Number(state.value));
      options.push(data);
    }
    return options;
  };

  const fetch = async () => {
    const { api, resultField, searchField } = props;
    if (!api || !isFunction(api)) return;
    optionsRef.value = [];
    const params = cloneDeep(props.params);
    if (searchField) params[searchField] = searchValue.value;
    try {
      loading.value = true;
      const res = await api(params);
      loading.value = false;
      isFirstLoaded.value = true;
      if (Array.isArray(res)) {
        const checked = await getStateItems(res);
        res.push(...checked);
        optionsRef.value = res;
      } else if (resultField) {
        optionsRef.value = get(res, resultField) || [];
      }
      emitChange();
    } catch (error) {
      console.warn(error);
    } finally {
      loading.value = false;
      isFirstLoaded.value = false;
    }
  };

  async function handleFetch(visible: boolean) {
    if (visible) {
      if (props.alwaysLoad) {
        await fetch();
      } else if (!props.immediate && !unref(isFirstLoaded)) {
        await fetch();
      }
    }
  }

  function emitChange() {
    emit('options-change', unref(getOptions));
  }

  function handleChange(_, ...args) {
    emitData.value = args;
  }

  function handleSearch(value: string) {
    emit('search', value);
    if (props.searchField) {
      debounceSearch(value);
    }
  }
  const debounceSearch = debounce((value: string) => {
    searchValue.value = value;
  }, 300);

  // const deleteOtherValue = (v: SelectValue) => {
  //   if (getOptions.value.length === 0) return;
  //   if (isArray(v)) {
  //     //
  //   } else {
  //     const target = getOptions.value.find((item) => item.value == v);
  //     if (props.allowOtherValue || target) return;
  //     //ToDo
  //   }
  // };

  watch(
    () => state.value,
    (v) => {
      emit('update:value', v);
    },
  );

  watch(
    () => props.params,
    (val, old) => {
      if (isEqual(val, old)) return;
      !unref(isFirstLoaded) && fetch();
    },
    { deep: true, immediate: props.immediate },
  );

  watch(
    () => searchValue.value,
    () => {
      if (!props.searchField) return;
      fetch();
    },
    { deep: true },
  );
  // watch(
  //   () => props.checkedOptions,
  //   (val) => {
  //     val && fetch();
  //   },
  //   { deep: true },
  // );
</script>
