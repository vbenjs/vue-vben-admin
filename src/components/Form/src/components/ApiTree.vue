<template>
  <a-tree v-bind="getAttrs" @change="handleChange">
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
    <template #suffixIcon v-if="loading">
      <LoadingOutlined spin />
    </template>
  </a-tree>
</template>

<script lang="ts">
  import { computed, defineComponent, watch, ref, onMounted, unref } from 'vue';
  import { Tree } from 'ant-design-vue';
  import { isArray, isFunction } from '/@/utils/is';
  import { get } from 'lodash-es';
  import { propTypes } from '/@/utils/propTypes';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  export default defineComponent({
    name: 'ApiTree',
    components: { ATree: Tree, LoadingOutlined },
    props: {
      api: { type: Function as PropType<(arg?: Recordable) => Promise<Recordable>> },
      params: { type: Object },
      immediate: { type: Boolean, default: true },
      resultField: propTypes.string.def(''),
      afterFetch: { type: Function as PropType<Fn> },
    },
    emits: ['options-change', 'change'],
    setup(props, { attrs, emit }) {
      const treeData = ref<Recordable[]>([]);
      const isFirstLoaded = ref<Boolean>(false);
      const loading = ref(false);
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
        treeData.value = (result as Recordable[]) || [];
        isFirstLoaded.value = true;
        emit('options-change', treeData.value);
      }
      return { getAttrs, loading, handleChange };
    },
  });
</script>
