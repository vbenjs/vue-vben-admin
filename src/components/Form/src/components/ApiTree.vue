<template>
  <a-tree v-bind="getAttrs" @select="handleChange" v-model:selectedKeys="state">
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </a-tree>
</template>

<script lang="ts">
  import { type Recordable, type AnyFunction } from '@vben/types';
  import { type PropType, computed, defineComponent, watch, ref, onMounted, unref } from 'vue';
  import { Tree } from 'ant-design-vue';
  import { isArray, isFunction } from '/@/utils/is';
  import { get } from 'lodash-es';
  import { propTypes } from '/@/utils/propTypes';
  import { DataNode } from 'ant-design-vue/es/tree';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';

  export default defineComponent({
    name: 'ApiTree',
    components: { ATree: Tree },
    props: {
      api: { type: Function as PropType<(arg?: Recordable<any>) => Promise<Recordable<any>>> },
      params: { type: Object },
      immediate: { type: Boolean, default: true },
      resultField: propTypes.string.def(''),
      afterFetch: { type: Function as PropType<AnyFunction> },
      value: [Array, Object, String, Number],
    },
    emits: ['options-change', 'change', 'update:value'],
    setup(props, { attrs, emit }) {
      const treeData = ref<DataNode[]>([]);
      const isFirstLoaded = ref<Boolean>(false);
      const loading = ref(false);
      const emitData = ref<any[]>([]);

      const [state] = useRuleFormItem(props, 'value', 'change', emitData);
      const getAttrs = computed(() => {
        return {
          ...(props.api ? { treeData: unref(treeData) } : {}),
          ...attrs,
        };
      });
      function handleChange(...args) {
        emit('change', ...args);
      }

      watch(
        () => state.value,
        (v) => {
          emit('update:value', v);
        },
      );

      watch(
        () => props.params,
        () => {
          !unref(isFirstLoaded) && fetch();
        },
        { deep: true },
      );

      watch(
        () => props.immediate,
        (v) => {
          v && !isFirstLoaded.value && fetch();
        },
      );

      onMounted(() => {
        props.immediate && fetch();
      });

      async function fetch() {
        const { api, afterFetch } = props;
        if (!api || !isFunction(api)) return;
        loading.value = true;
        treeData.value = [];
        let result;
        try {
          result = await api(props.params);
        } catch (e) {
          console.error(e);
        }
        if (afterFetch && isFunction(afterFetch)) {
          result = afterFetch(result);
        }
        loading.value = false;
        if (!result) return;
        if (!isArray(result)) {
          result = get(result, props.resultField);
        }
        treeData.value = (result as (Recordable & { key: string | number })[]) || [];
        isFirstLoaded.value = true;
        emit('options-change', treeData.value);
      }
      return { getAttrs, loading, handleChange, state };
    },
  });
</script>
