<template>
  <RadioGroup v-bind="$attrs" v-model:value="valueRef" button-style="solid">
    <template v-for="item in getOptions" :key="`${item.value}`">
      <RadioButton :value="item.value"> {{ item.label }} </RadioButton>
    </template>
  </RadioGroup>
</template>
<script lang="ts">
  import { defineComponent, ref, PropType, watch, unref, computed } from 'vue';
  import { Radio } from 'ant-design-vue';
  import {} from 'ant-design-vue/es/radio/Group';
  import { isString } from '/@/utils/is';

  type OptionsItem = { label: string; value: string; disabled?: boolean };
  type RadioItem = string | OptionsItem;
  export default defineComponent({
    name: 'RadioButtonGroup',
    components: {
      RadioGroup: Radio.Group,
      RadioButton: Radio.Button,
    },
    props: {
      value: {
        type: String as PropType<string>,
      },
      options: {
        type: Array as PropType<RadioItem[]>,
        default: () => [],
      },
    },
    setup(props, { emit }) {
      const valueRef = ref('');

      watch(
        () => props.value,
        (v = '') => {
          valueRef.value = v;
        },
        { immediate: true }
      );

      watch(
        () => unref(valueRef),
        () => {
          emit('change', valueRef.value);
        },
        { immediate: true }
      );

      const getOptions = computed((): OptionsItem[] => {
        const { options } = props;
        if (!options || options.length === 0) return [];
        const isStringArr = options.some((item) => isString(item));
        if (!isStringArr) return options as OptionsItem[];
        return options.map((item) => ({ label: item, value: item })) as OptionsItem[];
      });

      return { valueRef, getOptions };
    },
  });
</script>
