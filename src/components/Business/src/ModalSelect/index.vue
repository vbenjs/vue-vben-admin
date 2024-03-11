<template>
  <Select
    @dropdown-visible-change="handleFetch"
    v-bind="$attrs"
    @change="handleChange"
    :options="getOptions"
    :open="selectOpen"
    v-model:value="state"
    :showSearch="false"
    :not-found-content="null"
  >
    <template #dropdownRender="{ menuNode: menu }">
      <v-nodes :vnodes="menu" />
      <Divider style="margin: 4px 0" />
      <Button type="link" @click="loadMore">更多</Button>
    </template>
  </Select>
</template>
<script lang="ts" setup>
  import { computed, defineComponent, ref, unref, watch, watchEffect } from 'vue';
  import { Divider, Select, Button } from 'ant-design-vue';
  import { useRuleFormItem } from '@/hooks/component/useFormItem';
  import { isFunction, get, isArray } from 'lodash-es';
  import { OptionsItem, SelectProps } from './state';
  import { createSelectTableModal } from '.';
  import { BasicColumn } from '@/components/Table';

  defineOptions({
    name: 'ModalSelect',
    inheritAttrs: false,
  });

  const VNodes = defineComponent({
    props: {
      vnodes: {
        type: Object,
        required: true,
      },
    },
    render() {
      return this.vnodes;
    },
  });

  const props = withDefaults(defineProps<SelectProps>(), {
    api: null,
    getMissingItem: null,
    params: () => ({}),
    resultField: '',
    labelField: 'label',
    valueField: 'value',
    immediate: true,
    alwaysLoad: false,
    multiple: false,
    formLabelName: '',
    showOptionNumber: 10,
    numberToString: false,
  });
  const emit = defineEmits(['change', 'options-change']);

  const options = ref<OptionsItem[]>([]);
  const loading = ref(false);
  const isFirstLoad = ref(true);
  const emitData = ref<any[]>([]);
  const selectOpen = ref(false);

  // Embedded in the form, just use the hook binding to perform form verification
  const [state] = useRuleFormItem(props, 'value', 'change', emitData);

  const getOptions = computed(() => {
    const { labelField, valueField, numberToString, formatter } = props;

    return unref(options).reduce((prev, next: any) => {
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
  });

  const getColumns = computed<BasicColumn[]>(() => {
    return props.columns?.length
      ? props.columns
      : [
          {
            title: props.formLabelName ?? props.labelField,
            dataIndex: props.labelField,
            align: 'left',
          },
        ];
  });

  watchEffect(() => {
    props.immediate && !props.alwaysLoad && fetch();
  });

  watch(
    () => props.params,
    () => {
      !unref(isFirstLoad) && fetch();
    },
    { deep: true },
  );

  async function fetch() {
    const { api, showOptionNumber } = props;
    if (!api || !isFunction(api)) return;
    options.value = [];
    try {
      loading.value = true;
      const res = await api(props.params);
      if (Array.isArray(res)) {
        options.value = res.slice(0, showOptionNumber);
        await checkRes(res);
        emitChange();
        return;
      }
      if (props.resultField) {
        options.value = get(res, props.resultField) || [];
      }
      emitChange();
    } catch (error) {
      console.warn(error);
    } finally {
      loading.value = false;
    }

    async function checkRes(res: OptionsItem[]) {
      const { value } = props;
      if (!value) return;
      if (!isArray(value)) {
        await changeOptions(res, value);
        return;
      }
      const promiseList: Promise<void>[] = [];
      value.forEach((item, index) => {
        promiseList.push(changeOptions(res, item, index));
      });
      Promise.all(promiseList);
    }
  }

  async function changeOptions(
    res: OptionsItem[],
    value: string | number | Record<string, any>,
    offset: number = 0,
  ) {
    const { valueField, showOptionNumber, getMissingItem } = props;
    let target = res.find((item) => item[valueField] === value);
    if (!target) {
      target = await getMissingItem?.(value);
    }
    if (target) {
      options.value.splice(showOptionNumber - 1 - offset, 1, target);
    }
  }

  async function handleFetch(open: boolean) {
    if (open) {
      selectOpen.value = true;
      if (props.alwaysLoad) {
        await fetch();
      } else if (!props.immediate && unref(isFirstLoad)) {
        await fetch();
        isFirstLoad.value = false;
      }
    } else {
      selectOpen.value = false;
    }
  }

  const loadMore = () => {
    selectOpen.value = false;
    createSelectTableModal({
      api: props.api,
      multiple: props.multiple,
      rowKey: props.valueField,
      title: props.title,
      columns: unref(getColumns),
      // schema: unref(getSchema),
      formConfig: {
        schemas: props.schemas,
        ...props.formConfig,
      },
      onOK: (rows) => handelSuccess(rows),
    });
  };

  function handelSuccess(selectRows: any[]) {
    selectRows.forEach((row) => {
      if (!options.value.some((item) => item[props.valueField] === row[props.valueField])) {
        options.value.push(row);
      }
      if (props.multiple) {
        if (isArray(state.value)) {
          state.value.push(row[props.valueField]);
        } else {
          state.value = [row[props.valueField]];
        }
      } else {
        state.value = row[props.valueField];
      }
    });
    emitData.value = selectRows;
  }
  function emitChange() {
    emit('options-change', unref(getOptions));
  }

  function handleChange(_, ...args) {
    emitData.value = args;
  }
</script>
