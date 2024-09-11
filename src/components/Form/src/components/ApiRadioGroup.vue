<!--
 * @Description:It is troublesome to implement radio button group in the form. So it is extracted independently as a separate component
-->
<template>
  <Radio.Group v-bind="attrs" v-model:value="state" button-style="solid">
    <template v-for="item in getOptions" :key="`${item.value}`">
      <Radio.Button
        v-if="props.isBtn"
        :value="item.value"
        :disabled="item.disabled"
        @click="handleClick(item)"
      >
        {{ item.label }}
      </Radio.Button>
      <Radio v-else :value="item.value" :disabled="item.disabled" @click="handleClick(item)">
        {{ item.label }}
      </Radio>
    </template>
  </Radio.Group>
</template>
<script lang="ts" setup>
  import { type PropType, ref, computed, unref, watch } from 'vue';
  import { Radio } from 'ant-design-vue';
  import { isFunction } from '@/utils/is';
  import { useRuleFormItem } from '@/hooks/component/useFormItem';
  import { useAttrs } from '@vben/hooks';
  import { propTypes } from '@/utils/propTypes';
  import { get, omit, isEqual } from 'lodash-es';

  type OptionsItem = {
    label?: string;
    value?: string | number | boolean;
    disabled?: boolean;
    [key: string]: any;
  };

  defineOptions({ name: 'ApiRadioGroup' });

  const props = defineProps({
    api: {
      type: Function as PropType<(arg?: any) => Promise<OptionsItem[] | Recordable<any>>>,
      default: null,
    },
    params: {
      type: [Object, String] as PropType<any | string>,
      default: () => ({}),
    },
    value: {
      type: [String, Number, Boolean] as PropType<string | number | boolean>,
    },
    isBtn: {
      type: [Boolean] as PropType<boolean>,
      default: false,
    },
    numberToString: propTypes.bool,
    resultField: propTypes.string.def(''),
    labelField: propTypes.string.def('label'),
    valueField: propTypes.string.def('value'),
    immediate: propTypes.bool.def(true),
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

  const options = ref<OptionsItem[]>([]);
  const loading = ref(false);
  const emitData = ref<any[]>([]);
  const attrs = useAttrs();
  // Embedded in the form, just use the hook binding to perform form verification
  const [state] = useRuleFormItem(props, 'value', 'change', emitData);

  // Processing options value
  const getOptions = computed(() => {
    const { labelField, valueField, numberToString } = props;

    return unref(options).reduce((prev, next: any) => {
      if (next) {
        const value = next[valueField];
        prev.push({
          label: next[labelField],
          value: numberToString ? `${value}` : value,
          ...omit(next, [labelField, valueField]),
        });
      }
      return prev;
    }, [] as OptionsItem[]);
  });

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
    if (!api || !isFunction(api)) return;
    options.value = [];
    try {
      loading.value = true;
      if (beforeFetch && isFunction(beforeFetch)) {
        params = (await beforeFetch(params)) || params;
      }
      let res = await api(params);
      if (afterFetch && isFunction(afterFetch)) {
        res = (await afterFetch(res)) || res;
      }
      if (Array.isArray(res)) {
        options.value = res;
        emitChange();
        return;
      }
      if (resultField) {
        options.value = get(res, resultField) || [];
      }
      emitChange();
    } catch (error) {
      console.warn(error);
    } finally {
      loading.value = false;
    }
  }

  function emitChange() {
    emit('options-change', unref(getOptions));
  }

  function handleClick(...args) {
    emitData.value = args;
  }
</script>
