<template>
  <ApiSelect v-bind="$attrs" value-field="dictItemCode" label-field="dictItemName" :api="api" />
</template>

<script lang="ts" setup>
  import ApiSelect from '../../components/ApiSelect.vue';
  import { propTypes } from '@/utils/propTypes';
  import { ApiServiceEnum, defHttp } from '@/utils/http/axios';
  import { type PropType } from 'vue';
  import type { SelectValue } from 'ant-design-vue/es/select';

  const props = defineProps({
    dictCode: propTypes.string.isRequired,
    value: { type: [Array, Object, String, Number] as PropType<SelectValue> },
  });

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
