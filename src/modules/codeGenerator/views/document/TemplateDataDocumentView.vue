<template>
  <div class="full-height page-container">
    <vxe-grid
      v-bind="tableProps"
      :tree-config="treeConfig"
      :columns="columns"
      :size="tableSizeConfig"
      highlight-hover-row
      height="auto"
      stripe
      border
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted } from 'vue';

  import { useVxeTable } from '@/hooks/web/useCrud';
  import { tableBooleanColumn } from '@/components/SmartTable';
  import { ApiServiceEnum, defHttp } from '@/utils/http/axios';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';

  const { tableSizeConfig } = useSizeSetting();

  const doLoadData = () => {
    return defHttp.post({
      service: ApiServiceEnum.SMART_CODE,
      url: 'db/code/main/getTemplateDataDocument',
    });
  };

  export default defineComponent({
    name: 'TemplateDataDocumentView',
    setup() {
      const { tableProps, loadData } = useVxeTable(doLoadData, {
        paging: false,
      });

      onMounted(loadData);

      return {
        tableProps,
      };
    },
    data() {
      return {
        treeConfig: {
          childrenField: 'fieldList',
        },
        tableSizeConfig,
        columns: [
          {
            title: '属性',
            field: 'name',
            width: 240,
            fixed: 'left',
            treeNode: true,
          },
          {
            title: '说明',
            field: 'remark',
            minWidth: 240,
          },
          {
            title: '参数|返回值',
            field: 'type',
            width: 120,
          },
          {
            title: '可选值',
            field: 'optional',
            width: 180,
          },
          {
            title: '默认值',
            field: 'defaultValue',
            width: 200,
          },
          {
            ...tableBooleanColumn(this.$t, '是否可null', 'nullable').createColumn(),
            width: 120,
          },
        ],
      };
    },
  });
</script>

<style scoped></style>
