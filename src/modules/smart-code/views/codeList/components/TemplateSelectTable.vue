<template>
  <SmartLayoutSeparate first-size="200px" :show-line="false" class="full-height">
    <template #first>
      <TemplateGroup class="full-height" @change="handleCurrentChange" :editable="false" />
    </template>
    <template #second>
      <SmartTable
        @register="registerTable"
        @checkbox-change="handleCheckboxChange"
        @proxy-query="resetCheckbox"
        @checkbox-all="handleCheckboxAll"
      />
    </template>
  </SmartLayoutSeparate>
</template>

<script lang="ts" setup>
  import { useI18n } from '@/hooks/web/useI18n';
  import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

  import { SmartTable, useSmartTable } from '@/components/SmartTable';
  import { SmartLayoutSeparate } from '@/components/SmartLayoutSeparate';
  import { TemplateType as templateTypeConstants } from '@/modules/smart-code/constants/DatabaseConstants';
  import TemplateGroup from '@/modules/smart-code/components/template/TemplateGroup.vue';
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

  let currentGroupId: number | null = null;

  const handleCurrentChange = (groupId) => {
    currentGroupId = groupId;
    query();
  };

  const handleCheckboxChange = ({ checked, row }) => {
    if (checked) {
      props.addSelectData([row]);
    } else {
      props.removeSelectData([row]);
    }
  };

  const handleCheckboxAll = ({ checked }) => {
    const selectRows = getCheckboxRecords();
    if (checked) {
      props.removeSelectData(props.selectData);
      props.addSelectData(selectRows);
    } else {
      props.removeSelectData(props.selectData);
    }
  };

  const resetCheckbox = async () => {
    // 数据重新加载后，设置选中的数据
    getTableInstance().setAllCheckboxRow(false);
    setCheckboxRow(props.selectData, true);
  };

  watch(
    () => props.selectData,
    () => {
      resetCheckbox();
    },
  );

  const [registerTable, { query, getTableInstance, setCheckboxRow, getCheckboxRecords }] =
    useSmartTable({
      useSearchForm: true,
      height: 'auto',
      pagerConfig: true,
      rowConfig: {
        keyField: 'templateId',
      },
      showOverflow: 'tooltip',
      checkboxConfig: {
        rowTrigger: 'multiple',
        highlight: true,
      },
      proxyConfig: {
        ajax: {
          query: ({ ajaxParameter }) => {
            let parameter = {};
            if (currentGroupId != null) {
              parameter = { 'groupId@=': currentGroupId };
            }
            return defHttp.post({
              service: ApiServiceEnum.SMART_CODE,
              url: 'db/code/template/list',
              data: {
                ...ajaxParameter,
                parameter: {
                  ...ajaxParameter?.parameter,
                  ...parameter,
                },
              },
            });
          },
        },
      },
      searchFormConfig: {
        colon: true,
        layout: 'inline',
        actionColOptions: {
          span: undefined,
        },
        compact: true,
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
