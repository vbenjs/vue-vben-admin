<template>
  <Cascader
    v-model:value="state"
    :options="options"
    :load-data="loadData"
    change-on-select
    @change="handleChange"
    :displayRender="handleRenderDisplay"
  >
    <template #suffixIcon v-if="loading">
      <LoadingOutlined spin />
    </template>
    <template #notFoundContent v-if="loading">
      <span>
        <LoadingOutlined spin class="mr-1" />
        {{ t('component.form.apiSelectNotFound') }}
      </span>
    </template>
  </Cascader>
</template>
<script lang="ts" setup>
  import { type Recordable } from '@vben/types';
  import { PropType, ref, unref, watch } from 'vue';
  import { Cascader } from 'ant-design-vue';
  import type { CascaderProps } from 'ant-design-vue';
  import { propTypes } from '@/utils/propTypes';
  import { isFunction } from '@/utils/is';
  import { get, omit } from 'lodash-es';
  import { useRuleFormItem } from '@/hooks/component/useFormItem';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '@/hooks/web/useI18n';

  interface Option {
    value?: string;
    label?: string;
    loading?: boolean;
    isLeaf?: boolean;
    children?: Option[];
    [key: string]: any;
  }

  defineOptions({ name: 'ApiCascader' });

  const props = defineProps({
    value: {
      type: Array,
    },
    api: {
      type: Function as PropType<(arg?: any) => Promise<Option[] | Recordable<any>>>,
      default: null,
    },
    numberToString: propTypes.bool,
    resultField: propTypes.string.def(''),
    labelField: propTypes.string.def('label'),
    valueField: propTypes.string.def('value'),
    childrenField: propTypes.string.def('children'),
    apiParamKey: propTypes.string.def('parentCode'),
    immediate: propTypes.bool.def(true),
    // init fetch params
    initFetchParams: {
      type: Object as PropType<Recordable<any>>,
      default: () => ({}),
    },
    // 是否有下级，默认是
    isLeaf: {
      type: Function as PropType<(arg: Recordable<any>) => boolean>,
      default: null,
    },
    displayRenderArray: {
      type: Array,
    },
    beforeFetch: {
      type: Function as PropType<Fn>,
      default: null,
    },
    afterFetch: {
      type: Function as PropType<Fn>,
      default: null,
    },
  });

  const emit = defineEmits(['change', 'defaultChange']);

  const apiData = ref<any[]>([]);
  const options = ref<Option[]>([]);
  const loading = ref<boolean>(false);
  const emitData = ref<any[]>([]);
  const isFirstLoad = ref(true);
  const { t } = useI18n();
  // Embedded in the form, just use the hook binding to perform form verification
  const [state]: any = useRuleFormItem(props, 'value', 'change', emitData);

  watch(
    apiData,
    (data) => {
      const opts = generatorOptions(data);
      options.value = opts;
    },
    { deep: true },
  );

  function generatorOptions(options: any[]): Option[] {
    const { labelField, valueField, numberToString, childrenField, isLeaf } = props;
    return options.reduce((prev, next: Recordable<any>) => {
      if (next) {
        const value = next[valueField];
        const item = {
          ...omit(next, [labelField, valueField]),
          label: next[labelField],
          value: numberToString ? `${value}` : value,
          isLeaf: isLeaf && typeof isLeaf === 'function' ? isLeaf(next) : false,
        };
        const children = Reflect.get(next, childrenField);
        if (children) {
          Reflect.set(item, childrenField, generatorOptions(children));
        }
        prev.push(item);
      }
      return prev;
    }, [] as Option[]);
  }

  async function fetch() {
    let { api, beforeFetch, initFetchParams, afterFetch, resultField } = props;
    if (!api || !isFunction(api)) return;
    apiData.value = [];
    loading.value = true;
    try {
      if (beforeFetch && isFunction(beforeFetch)) {
        initFetchParams = (await beforeFetch(initFetchParams)) || initFetchParams;
      }
      let res = await api(initFetchParams);
      if (afterFetch && isFunction(afterFetch)) {
        res = (await afterFetch(res)) || res;
      }
      if (Array.isArray(res)) {
        apiData.value = res;
        return;
      }
      if (resultField) {
        apiData.value = get(res, resultField) || [];
      }
    } catch (error) {
      console.warn(error);
    } finally {
      loading.value = false;
    }
  }

  const loadData: CascaderProps['loadData'] = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    let { api, beforeFetch, afterFetch, resultField, apiParamKey } = props;
    if (!api || !isFunction(api)) return;
    try {
      let param = {
        [apiParamKey]: Reflect.get(targetOption, 'value'),
      };
      if (beforeFetch && isFunction(beforeFetch)) {
        param = (await beforeFetch(param)) || param;
      }
      let res = await api(param);
      if (afterFetch && isFunction(afterFetch)) {
        res = (await afterFetch(res)) || res;
      }
      if (Array.isArray(res)) {
        const children = generatorOptions(res);
        targetOption.children = children;
        return;
      }
      if (resultField) {
        const children = generatorOptions(get(res, resultField) || []);
        targetOption.children = children;
      }
    } catch (e) {
      console.error(e);
    } finally {
      targetOption.loading = false;
    }
  };

  watch(
    () => props.immediate,
    () => {
      props.immediate && fetch();
    },
    {
      immediate: true,
    },
  );

  watch(
    () => props.initFetchParams,
    () => {
      !unref(isFirstLoad) && fetch();
    },
    { deep: true },
  );

  function handleChange(keys, args) {
    emitData.value = args;
    emit('defaultChange', keys, args);
  }

  const handleRenderDisplay: CascaderProps['displayRender'] = ({ labels, selectedOptions }) => {
    if (unref(emitData).length === selectedOptions?.length) {
      return labels.join(' / ');
    }
    if (props.displayRenderArray) {
      return props.displayRenderArray.join(' / ');
    }
    return '';
  };
</script>
