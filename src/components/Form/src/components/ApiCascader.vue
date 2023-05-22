<template>
  <a-cascader
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
  </a-cascader>
</template>
<script lang="ts">
  import { type Recordable } from '@vben/types';
  import { defineComponent, PropType, ref, unref, watch, watchEffect } from 'vue';
  import { Cascader } from 'ant-design-vue';
  import { propTypes } from '/@/utils/propTypes';
  import { isFunction } from '/@/utils/is';
  import { get, omit } from 'lodash-es';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  interface Option {
    value: string;
    label: string;
    loading?: boolean;
    isLeaf?: boolean;
    children?: Option[];
  }
  export default defineComponent({
    name: 'ApiCascader',
    components: {
      LoadingOutlined,
      [Cascader.name]: Cascader,
    },
    props: {
      value: {
        type: Array,
      },
      api: {
        type: Function as PropType<(arg?: Recordable<any>) => Promise<Option[]>>,
        default: null,
      },
      numberToString: propTypes.bool,
      resultField: propTypes.string.def(''),
      labelField: propTypes.string.def('label'),
      valueField: propTypes.string.def('value'),
      childrenField: propTypes.string.def('children'),
      asyncFetchParamKey: propTypes.string.def('parentCode'),
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
    },
    emits: ['change', 'defaultChange'],
    setup(props, { emit }) {
      const apiData = ref<any[]>([]);
      const options = ref<Option[]>([]);
      const loading = ref<boolean>(false);
      const emitData = ref<any[]>([]);
      const isFirstLoad = ref(true);
      const { t } = useI18n();
      // Embedded in the form, just use the hook binding to perform form verification
      const [state] = useRuleFormItem(props, 'value', 'change', emitData);

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

      async function initialFetch() {
        const api = props.api;
        if (!api || !isFunction(api)) return;
        apiData.value = [];
        loading.value = true;
        try {
          const res = await api(props.initFetchParams);
          if (Array.isArray(res)) {
            apiData.value = res;
            return;
          }
          if (props.resultField) {
            apiData.value = get(res, props.resultField) || [];
          }
        } catch (error) {
          console.warn(error);
        } finally {
          loading.value = false;
        }
      }

      async function loadData(selectedOptions: Option[]) {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        const api = props.api;
        if (!api || !isFunction(api)) return;
        try {
          const res = await api({
            [props.asyncFetchParamKey]: Reflect.get(targetOption, 'value'),
          });
          if (Array.isArray(res)) {
            const children = generatorOptions(res);
            targetOption.children = children;
            return;
          }
          if (props.resultField) {
            const children = generatorOptions(get(res, props.resultField) || []);
            targetOption.children = children;
          }
        } catch (e) {
          console.error(e);
        } finally {
          targetOption.loading = false;
        }
      }

      watchEffect(() => {
        props.immediate && initialFetch();
      });

      watch(
        () => props.initFetchParams,
        () => {
          !unref(isFirstLoad) && initialFetch();
        },
        { deep: true },
      );

      function handleChange(keys, args) {
        emitData.value = args;
        emit('defaultChange', keys, args);
      }

      function handleRenderDisplay({ labels, selectedOptions }) {
        if (unref(emitData).length === selectedOptions.length) {
          return labels.join(' / ');
        }
        if (props.displayRenderArray) {
          return props.displayRenderArray.join(' / ');
        }
        return '';
      }

      return {
        state,
        options,
        loading,
        t,
        handleChange,
        loadData,
        handleRenderDisplay,
      };
    },
  });
</script>
