<template>
  <LayoutSeparate first-size="200px" :show-line="false" class="full-height">
    <template #first>
      <TemplateGroup class="full-height" @current-change="handleCurrentChange" />
    </template>
    <template #second>
      <SmartTable
        @register="registerTable"
        @checkbox-change="handleCheckboxChange"
        @proxy-query="resetCheckbox"
      />
    </template>
  </LayoutSeparate>
</template>

<script lang="ts" setup>
  import { useI18n } from '@/hooks/web/useI18n';
  import { ApiServiceEnum, defHttp } from '@/utils/http/axios';
  import { merge } from 'lodash-es';

  import { SmartTable, useSmartTable } from '@/components/SmartTable';
  import { LayoutSeparate } from '@/components/LayoutSeparate';
  import { TemplateType as templateTypeConstants } from '@/modules/codeGenerator/constants/DatabaseConstants';
  import TemplateGroup from '@/modules/codeGenerator/components/template/TemplateGroup.vue';
  import { watch } from 'vue';

  const props = defineProps({
    addSelectData: {
      type: Function as PropType<Function>,
      required: true,
    },
    removeSelectData: {
      type: Function as PropType<Function>,
      required: true,
    },
    selectData: Array,
  });
  const { t } = useI18n();

  let currentGroup: Recordable = {};

  const handleCurrentChange = (row) => {
    currentGroup = row || {};
    query();
  };

  const handleCheckboxChange = ({ checked, row }) => {
    if (checked) {
      props.addSelectData([row]);
    } else {
      props.removeSelectData([row]);
    }
  };

  const resetCheckbox = async () => {
    // 数据重新加载后，设置选中的数据
    await getTableInstance().setAllCheckboxRow(false);
    await setCheckboxRow(props.selectData, true);
  };

  watch(
    () => props.selectData,
    () => {
      resetCheckbox();
    },
  );

  const [registerTable, { query, getTableInstance, setCheckboxRow }] = useSmartTable({
    useSearchForm: true,
    height: 'auto',
    pagerConfig: true,
    rowConfig: {
      keyField: 'templateId',
    },
    proxyConfig: {
      ajax: {
        query: (params) => {
          const parameter = merge(params.ajaxParameter, {
            parameter: {
              'groupId@=': currentGroup.groupId,
            },
          });
          return defHttp.post({
            service: ApiServiceEnum.SMART_CODE,
            url: 'db/code/template/list',
            data: parameter,
          });
        },
      },
    },
    searchFormConfig: {
      colon: true,
      layout: 'inline',
      baseColProps: {
        span: 12,
      },
      actionColOptions: {
        span: 12,
      },
      schemas: [
        {
          label: t('generator.views.template.table.name'),
          field: 'name',
          component: 'Input',
        },
      ],
    },
    columns: [
      {
        type: 'checkbox',
        width: 60,
        fixed: 'left',
      },
      {
        field: 'name',
        title: '{generator.views.template.table.name}',
        width: 200,
        fixed: 'left',
        align: 'left',
        headerAlign: 'center',
      },
      {
        field: 'templateType',
        title: '{generator.views.template.table.templateType}',
        width: 140,
        formatter: ({ row }: any) => {
          const templateType = templateTypeConstants[row.templateType];
          if (templateType) {
            return t(templateType.label);
          }
          return '';
        },
      },
      {
        field: 'language',
        title: '{generator.views.template.table.language}',
        width: 200,
      },
      {
        field: 'remark',
        title: '{generator.views.template.table.remark}',
        minWidth: 200,
        align: 'left',
        headerAlign: 'center',
      },
    ],
  });
</script>

<style scoped></style>
