<template>
  <Select v-bind="attrs" :options="options" v-model:value="state">
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data" />
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
<script lang="ts">
  import { defineComponent, PropType, ref, watchEffect } from 'vue';
  import { Select } from 'ant-design-vue';
  import { isFunction } from '/@/utils/is';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { get } from 'lodash-es';

  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  type OptionsItem = { label: string; value: string; disabled?: boolean };

  export default defineComponent({
    name: 'RadioButtonGroup',
    components: {
      Select,
      LoadingOutlined,
    },
    props: {
      value: {
        type: String as PropType<string>,
      },
      api: {
        type: Function as PropType<(arg?: Recordable) => Promise<OptionsItem[]>>,
        default: null,
      },
      params: {
        type: Object as PropType<Recordable>,
        default: () => {},
      },
      resultField: {
        type: String as PropType<string>,
        default: '',
      },
    },
    setup(props) {
      const options = ref<OptionsItem[]>([]);
      const loading = ref(false);
      const attrs = useAttrs();
      const { t } = useI18n();

      // Embedded in the form, just use the hook binding to perform form verification
      const [state] = useRuleFormItem(props);

      watchEffect(() => {
        fetch();
      });

      async function fetch() {
        const api = props.api;
        if (!api || !isFunction(api)) return;

        try {
          loading.value = true;
          const res = await api(props.params);
          if (Array.isArray(res)) {
            options.value = res;
            return;
          }
          if (props.resultField) {
            options.value = get(res, props.resultField) || [];
          }
        } catch (error) {
          console.warn(error);
        } finally {
          loading.value = false;
        }
      }
      return { state, attrs, options, loading, t };
    },
  });
</script>
