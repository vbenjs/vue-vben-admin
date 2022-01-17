<!--
 * @Description:It is troublesome to implement radio button group in the form. So it is extracted independently as a separate component
-->
<template>
  <RadioGroup v-bind="attrs" button-style="solid" @change="handleChange">
    <template v-for="item in getOptions" :key="`${item.value}`">
      <RadioButton :value="item.value" :disabled="item.disabled">
        {{ item.label }}
      </RadioButton>
    </template>
  </RadioGroup>
</template>
<script lang="ts">
  import { defineComponent, PropType, computed } from 'vue';
  import { Radio } from 'ant-design-vue';
  import { isString } from '/@/utils/is';
  import { useAttrs } from '/@/hooks/core/useAttrs';

  type OptionsItem = { label: string; value: string | number | boolean; disabled?: boolean };
  type RadioItem = string | OptionsItem;

  export default defineComponent({
    name: 'RadioButtonGroup',
    components: {
      RadioGroup: Radio.Group,
      RadioButton: Radio.Button,
    },
    props: {
      options: {
        type: Array as PropType<RadioItem[]>,
        default: () => [],
      },
    },
    emits: ['change'],
    setup(props, { emit }) {
      const attrs = useAttrs();
      // Processing options value
      const getOptions = computed((): OptionsItem[] => {
        const { options } = props;
        if (!options || options?.length === 0) return [];

        const isStringArr = options.some((item) => isString(item));
        if (!isStringArr) return options as OptionsItem[];

        return options.map((item) => ({ label: item, value: item })) as OptionsItem[];
      });

      function handleChange(e) {
        emit('change', e?.target?.value);
      }

      return { getOptions, attrs, handleChange };
    },
  });
</script>
