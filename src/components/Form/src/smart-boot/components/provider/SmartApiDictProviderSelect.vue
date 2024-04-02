<template>
  <Select v-bind="$attrs" :options="computedOptions" v-model:value="state" @change="handleChange">
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
    <template #suffixIcon v-if="pageDictLoadingRef">
      <LoadingOutlined spin />
    </template>
    <template #notFoundContent v-if="pageDictLoadingRef">
      <span>
        <LoadingOutlined spin class="mr-1" />
        {{ t('component.form.apiSelectNotFound') }}
      </span>
    </template>
  </Select>
</template>

<script setup lang="ts">
  import { type PropType, computed, watch, ref } from 'vue';

  import { Select } from 'ant-design-vue';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { useInjectPageDict } from '@/components/SmartPageProvider';
  import { useI18n } from '@/hooks/web/useI18n';
  import { propTypes } from '@/utils/propTypes';
  import type { SelectValue } from 'ant-design-vue/es/select';
  import { useRuleFormItem } from '@/hooks/component/useFormItem';

  type OptionsItem = { label?: string; value?: string; disabled?: boolean; [name: string]: any };

  const props = defineProps({
    dictCode: propTypes.string.isRequired,
    value: { type: [Array, Object, String, Number] as PropType<SelectValue> },
    numberToString: propTypes.bool,
    labelWithCode: propTypes.bool,
  });

  const emit = defineEmits(['change', 'update:value']);

  const { t } = useI18n();

  const { pageDictRegister, pageDictLoadingRef, pageDictData } = useInjectPageDict();

  if (pageDictRegister) {
    pageDictRegister(props.dictCode);
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
  const computedOptions = computed(() => {
    if (!pageDictData) {
      return [];
    }
    const dictData = pageDictData.get(props.dictCode);
    if (!dictData) {
      return [];
    }
    return dictData.map((item) => {
      if (props.labelWithCode) {
        return {
          ...item,
          label: `${item.value}-${item.label}`,
        };
      }
      return item;
    });
  });
</script>

<style scoped lang="less"></style>
