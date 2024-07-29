<template>
  <Select
    @dropdown-visible-change="handleFetch"
    v-bind="$attrs"
    @change="handleChange"
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
  import { Select } from 'ant-design-vue';
  import type { SelectValue } from 'ant-design-vue/es/select';
  import { isFunction } from '@/utils/is';
  import { useRuleFormItem } from '@/hooks/component/useFormItem';
  import { get, omit, isEqual } from 'lodash-es';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { propTypes } from '@/utils/propTypes';

  type OptionsItem = { label?: string; value?: string; disabled?: boolean; [name: string]: any };

  defineOptions({ name: 'ApiSelect', inheritAttrs: false });

  const props = defineProps({
    value: { type: [Array, Object, String, Number] as PropType<SelectValue> },
    numberToString: propTypes.bool,
    api: {
      type: Function as PropType<(arg?: any) => Promise<OptionsItem[] | Recordable<any>>>,
      default: null,
    },
    // api params
    params: propTypes.any.def({}),
    // support xxx.xxx.xx
    resultField: propTypes.string.def(''),
    labelField: propTypes.string.def('label'),
    valueField: propTypes.string.def('value'),
    immediate: propTypes.bool.def(true),
    alwaysLoad: propTypes.bool.def(false),
    options: {
      type: Array<OptionsItem>,
      default: [],
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

  const emit = defineEmits(['options-change', 'change', 'update:value']);

  const optionsRef = ref<OptionsItem[]>([]);

  const loading = ref(false);
  // 首次是否加载过了
  const isFirstLoaded = ref(false);
  const emitData = ref<OptionsItem[]>([]);
  const { t } = useI18n();

  // Embedded in the form, just use the hook binding to perform form verification
  const [state] = useRuleFormItem(props, 'value', 'change', emitData);

  const getOptions = computed(() => {
    const { labelField, valueField, numberToString } = props;

    let data = unref(optionsRef).reduce((prev, next: any) => {
      if (next) {
        const value = get(next, valueField);
        prev.push({
          ...omit(next, [labelField, valueField]),
          label: get(next, labelField),
          value: numberToString ? `${value}` : value,
        });
      }
      return prev;
    }, [] as OptionsItem[]);
    return data.length > 0 ? data : props.options;
  });

  watch(
    () => state.value,
    (v) => {
      emit('update:value', v);
    },
  );

  watch(
    () => props.params,
    (value, oldValue) => {
      if (isEqual(value, oldValue)) return;
      fetch();
    },
    { deep: true, immediate: props.immediate },
  );

  async function fetch() {
    let { api, beforeFetch, afterFetch, params, resultField } = props;
    if (!api || !isFunction(api) || loading.value) return;
    optionsRef.value = [];
    try {
      loading.value = true;
      if (beforeFetch && isFunction(beforeFetch)) {
        params = (await beforeFetch(params)) || params;
      }
      let res = await api(params);
      if (afterFetch && isFunction(afterFetch)) {
        res = (await afterFetch(res)) || res;
      }
      isFirstLoaded.value = true;
      if (Array.isArray(res)) {
        optionsRef.value = res;
        emitChange();
        return;
      }
      if (resultField) {
        optionsRef.value = get(res, resultField) || [];
      }
      emitChange();
    } catch (error) {
      console.warn(error);
      // reset status
      isFirstLoaded.value = false;
    } finally {
      loading.value = false;
    }
  }

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
</script>
