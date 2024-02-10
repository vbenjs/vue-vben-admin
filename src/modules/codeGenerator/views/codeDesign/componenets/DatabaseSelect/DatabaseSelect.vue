<template>
  <a-select :size="formSizeConfig" v-bind="$attrs">
    <a-select-option v-for="item in data" :key="item.key" :value="item.key">
      {{ item.value }}
    </a-select-option>
  </a-select>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import type { PropType } from 'vue';

  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { ApiServiceEnum, defHttp } from '@/utils/http/axios';
  /**
   * 数据库连接下拉列
   */
  export default defineComponent({
    name: 'DatabaseSelect',
    props: {
      parameter: {
        type: Function as PropType<Function>,
      },
    },
    setup(props) {
      const data = ref<Array<any>>([]);
      const loadData = async () => {
        const result = await defHttp.post({
          service: ApiServiceEnum.SMART_CODE,
          url: '/db/connection/list',
          data: Object.assign(
            {
              sortName: 'seq',
            },
            props.parameter && props.parameter(),
          ),
        });
        data.value = result.map((item: any) => {
          return {
            key: item.id + '',
            value: item.connectionName,
          };
        });
      };
      onMounted(loadData);
      return {
        data,
        ...useSizeSetting(),
      };
    },
  });
</script>

<style scoped></style>
