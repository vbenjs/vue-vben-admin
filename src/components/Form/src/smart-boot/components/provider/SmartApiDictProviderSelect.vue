<template>
  <Select v-bind="$attrs" :options="computedOptions" v-model:value="state" @change="handleChange">
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
</template>

<script setup lang="ts">
  import { type Ref, inject, type PropType, computed, watch, ref } from 'vue';

  import { Select } from 'ant-design-vue';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { SmartProviderConstants } from '@/components/SmartPageProvider';
  import { useI18n } from '@/hooks/web/useI18n';
  import { propTypes } from '@/utils/propTypes';
  import type { SelectValue } from 'ant-design-vue/es/select';
  import { useRuleFormItem } from '@/hooks/component/useFormItem';

  type OptionsItem = { label?: string; value?: string; disabled?: boolean; [name: string]: any };

  const props = defineProps({
    dictCode: propTypes.string.isRequired,
    value: { type: [Array, Object, String, Number] as PropType<SelectValue> },
    numberToString: propTypes.bool,
  });

  const emit = defineEmits(['change', 'update:value']);

  const { t } = useI18n();
  /**
   * 加载状态
   */
  const loadingRef = inject(SmartProviderConstants.dictLoadingKey, null) as Ref<boolean> | null;

  const registerHandler = inject(SmartProviderConstants.dictRegisterKey, null) as Function | null;
  if (registerHandler) {
    registerHandler(props.dictCode);
  }

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
</script>

<style scoped lang="less"></style>
