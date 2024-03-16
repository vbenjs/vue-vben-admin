<template>
  <Select
    v-if="computedHasProvider"
    v-bind="$attrs"
    :options="computedOptions"
    v-model:value="state"
    @change="handleChange"
  >
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
    <template #suffixIcon v-if="loadingRef">
      <LoadingOutlined spin />
    </template>
    <template #notFoundContent v-if="loadingRef">
      <span>
        <LoadingOutlined spin class="mr-1" />
        {{ t('component.form.apiSelectNotFound') }}
      </span>
    </template>
  </Select>
  <ApiSelect
    v-else
    v-bind="$attrs"
    value-field="dictItemCode"
    label-field="dictItemName"
    :api="api"
  />
</template>

<script lang="ts" setup>
  import { type PropType, ref, Ref, watch } from 'vue';
  import type { SelectValue } from 'ant-design-vue/es/select';

  import { computed, inject } from 'vue';
  import { Select } from 'ant-design-vue';
  import ApiSelect from '../../components/ApiSelect.vue';
  import { propTypes } from '@/utils/propTypes';
  import { ApiServiceEnum, defHttp } from '@/utils/http/axios';
  import { SmartProviderConstants } from '@/components/SmartPageProvider';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { useRuleFormItem } from '@/hooks/component/useFormItem';
  import { useI18n } from '@/hooks/web/useI18n';

  type OptionsItem = { label?: string; value?: string; disabled?: boolean; [name: string]: any };

  const props = defineProps({
    dictCode: propTypes.string.isRequired,
    value: { type: [Array, Object, String, Number] as PropType<SelectValue> },
    numberToString: propTypes.bool,
  });

  const emit = defineEmits(['change', 'update:value']);

  const { t } = useI18n();

  const registerHandler = inject(SmartProviderConstants.dictRegisterKey, null) as Function | null;
  if (registerHandler) {
    registerHandler(props.dictCode);
  }
  /**
   * 加载状态
   */
  const loadingRef = inject(SmartProviderConstants.dictLoadingKey, null) as Ref<boolean> | null;
  /**
   * 是否有注入
   */
  const computedHasProvider = computed(() => {
    return registerHandler !== null;
  });

  /**
   * 注入OPTIONS
   */
  const dictDataRef = inject(SmartProviderConstants.dictData, null) as Map<
    string,
    Recordable[]
  > | null;
  const computedOptions = computed(() => {
    if (!dictDataRef) {
      return [];
    }
    const dictData = dictDataRef.get(props.dictCode);
    if (!dictData) {
      return [];
    }
    return dictData;
  });

  const emitData = ref<OptionsItem[]>([]);
  const [state] = useRuleFormItem(props, 'value', 'change', emitData);

  watch(
    () => state.value,
    (v) => {
      emit('update:value', v);
    },
  );

  function handleChange(_, ...args) {
    emitData.value = args;
  }

  const api = () => {
    return defHttp.post({
      service: ApiServiceEnum.SMART_SYSTEM,
      url: 'sys/dict/listItemByCode',
      data: {
        value: props.dictCode,
      },
    });
  };
</script>
