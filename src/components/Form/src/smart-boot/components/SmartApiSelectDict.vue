<template>
  <SmartApiDictProviderSelect v-if="computedHasProvider" v-bind="$attrs" :dict-code="dictCode" />
  <ApiSelect
    v-else
    v-bind="$attrs"
    value-field="dictItemCode"
    label-field="dictItemName"
    :api="api"
  />
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import ApiSelect from '../../components/ApiSelect.vue';
  import { propTypes } from '@/utils/propTypes';
  import { ApiServiceEnum, defHttp } from '@/utils/http/axios';
  import { useInjectPageDict } from '@/components/SmartPageProvider';
  import SmartApiDictProviderSelect from './provider/SmartApiDictProviderSelect.vue';

  const props = defineProps({
    dictCode: propTypes.string.isRequired,
  });

  const { pageDictRegisterIdent } = useInjectPageDict();

  /**
   * 是否有注入
   */
  const computedHasProvider = computed(() => {
    return pageDictRegisterIdent;
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
