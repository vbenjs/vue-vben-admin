<!--
  查询表信息
-->
<template>
  <ApiSelect
    v-bind="$attrs"
    :params="getParams"
    value-field="value"
    label-field="label"
    :api="api"
  />
</template>

<script lang="ts" setup>
  import { propTypes } from '@/utils/propTypes';
  import { ApiServiceEnum, defHttp } from '@/utils/http/axios';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import { computed } from 'vue';

  const props = defineProps({
    // 实体类类名
    modelClassName: propTypes.string.isRequired,
    valueFieldName: propTypes.string.isRequired,
    labelFieldName: propTypes.string.isRequired,
    params: propTypes.object.def({}),
  });

  const getParams = computed(() => {
    const { modelClassName, valueFieldName, labelFieldName, params } = props;
    return {
      modelClassName,
      valueFieldName,
      labelFieldName,
      queryParameter: params,
    };
  });

  const api = (params) => {
    return defHttp.post({
      service: ApiServiceEnum.SMART_SYSTEM,
      url: 'api/component/smart-form/listTableSelect',
      data: params,
    });
  };
</script>

<style scoped></style>
