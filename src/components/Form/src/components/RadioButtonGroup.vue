<!--
 * @Description:It is troublesome to implement radio button group in the form. So it is extracted independently as a separate component
-->
<template>
  <RadioGroup v-bind="attrs" v-model:value="state" button-style="solid">
    <template v-for="item in getOptions" :key="`${item.value}`">
      <RadioButton :value="item.value" :disabled="item.disabled" @click="handleClick(item)">
        {{ item.label }}
      </RadioButton>
    </template>
  </RadioGroup>
</template>
<script lang="ts">
  import { defineComponent, PropType, computed, ref } from 'vue';
  import { Radio } from 'ant-design-vue';
  import { isString } from '/@/utils/is';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { useAttrs } from '@vben/hooks';

  type OptionsItem = { label: string; value: string | number | boolean; disabled?: boolean };
  type RadioItem = string | OptionsItem;

  export default defineComponent({
    name: 'RadioButtonGroup',
    components: {
      RadioGroup: Radio.Group,
      RadioButton: Radio.Button,
    },
    props: {
      value: {
        type: [String, Number, Boolean] as PropType<string | number | boolean>,
      },
      options: {
        type: Array as PropType<RadioItem[]>,
        default: () => [],
      },
    },
    emits: ['change'],
    setup(props) {
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

      return { state, getOptions, attrs, handleClick };
    },
  });
</script>
