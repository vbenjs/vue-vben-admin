<!--
 * @Description:It is troublesome to implement all checkbox group in the form. So it is extracted independently as a separate component
-->
<template>
  <div>
    <FormItemRest>
      <Checkbox
        v-model:checked="checkAll"
        :indeterminate="indeterminate"
        @change="onCheckAllChange"
      >
        全部
      </Checkbox>
    </FormItemRest>
    <CheckboxGroup v-bind="attrs" v-model:value="checkedList" :options="options" />
  </div>
</template>
<script lang="ts" setup name="AllCheckboxGroup">
  import { computed, watch, reactive, toRefs, ref } from 'vue';
  import { Checkbox, Form } from 'ant-design-vue';
  import { isString } from '@/utils/is';
  import { useRuleFormItem } from '@/hooks/component/useFormItem';
  import { useAttrs } from '@vben/hooks';

  const FormItemRest = Form.ItemRest;
  const CheckboxGroup = Checkbox.Group;

  type OptionsItem = { label: string; value: string | number | boolean; disabled?: boolean };
  type CheckboxItem = string | OptionsItem;

  const emits = defineEmits(['change']);

  const props = defineProps({
    value: {
      type: Array as PropType<CheckboxItem[]>,
      default: () => [],
    },
    options: {
      type: Array as PropType<CheckboxItem[]>,
      default: () => [],
    },
  });

  const attrs = useAttrs();

  const emitData = ref<any[]>([]);
  // Embedded in the form, just use the hook binding to perform form verification
  const [state] = useRuleFormItem(props, 'value', 'change', emitData);

  const data = reactive({
    indeterminate: false,
    checkAll: false,
    checkedList: emitData.value,
  });
  // Processing options value
  const getOptions = computed((): OptionsItem[] => {
    const { options } = props;
    if (!options || options?.length === 0) return [];

    const isStringArr = options.some((item) => isString(item));
    if (!isStringArr) return options as OptionsItem[];

    return options.map((item) => ({ label: item, value: item })) as OptionsItem[];
  });

  const onCheckAllChange = (e: any) => {
    data.checkedList = e.target.checked ? getOptions.value.map((item) => item.value) : [];
    data.indeterminate = e.target.checked ? false : true;
  };

  watch(
    () => data.checkedList,
    (val) => {
      emitData.value = val;
      data.indeterminate = !!val.length && val.length < getOptions.value.length;
      data.checkAll = val.length === getOptions.value.length;
      emits('change', emitData.value);
    },
    {
      deep: true,
    },
  );

  watch(
    () => state.value,
    (val) => {
      data.checkedList = val;
    },
  );

  const { checkAll, indeterminate, checkedList } = toRefs(data);
</script>
