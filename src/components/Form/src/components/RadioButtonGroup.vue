<!--
 * @Description:It is troublesome to implement radio button group in the form. So it is extracted independently as a separate component
-->
<template>
  <Radio.Group v-bind="attrs" v-model:value="state" button-style="solid">
    <template v-for="item in getOptions" :key="`${item.value}`">
      <Radio.Button :value="item.value" :disabled="item.disabled" @click="handleClick(item)">
        {{ item.label }}
      </Radio.Button>
    </template>
  </Radio.Group>
</template>
<script lang="ts" setup>
  import { PropType, computed, ref } from 'vue';
  import { Radio } from 'ant-design-vue';
  import { isString } from '@/utils/is';
  import { useRuleFormItem } from '@/hooks/component/useFormItem';
  import { useAttrs } from '@vben/hooks';

  type OptionsItem = { label: string; value: string | number | boolean; disabled?: boolean };
  type RadioItem = string | OptionsItem;

  defineOptions({ name: 'RadioButtonGroup' });

  const props = defineProps({
    value: {
      type: [String, Number, Boolean] as PropType<string | number | boolean>,
    },
    options: {
      type: Array as PropType<RadioItem[]>,
      default: () => [],
    },
  });

  // const emit = defineEmits(['change']);

  const attrs = useAttrs();
  const emitData = ref<any[]>([]);
  // Embedded in the form, just use the hook binding to perform form verification
  const [state] = useRuleFormItem(props, 'value', 'change', emitData);

  // Processing options value
  const getOptions = computed((): OptionsItem[] => {
    const { options } = props;
    if (!options || options?.length === 0) return [];

    const isStringArr = options.some((item) => isString(item));
    if (!isStringArr) return options as OptionsItem[];

    return options.map((item) => ({ label: item, value: item })) as OptionsItem[];
  });

  function handleClick(...args) {
    emitData.value = args;
  }
</script>
