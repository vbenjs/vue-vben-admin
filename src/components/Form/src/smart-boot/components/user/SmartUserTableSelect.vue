<template>
  <SmartTableSelect v-bind="computedProps" />
</template>

<script lang="ts" setup>
  import type { SmartTableProps } from '@/components/SmartTable';

  import { computed, useAttrs } from 'vue';

  import SmartTableSelect from '../base/SmartTableSelect';
  import { ApiServiceEnum, defHttp } from '@/utils/http/axios';
  import { useI18n } from '@/hooks/web/useI18n';
  import { listUserApi } from '@/api/sys/SystemApi';

  const props = defineProps({
    parameterHandler: Function as PropType<(parameter?: Recordable) => Recordable>,
  });

  const { t } = useI18n();

  const listUserById = (ids) => {
    return defHttp.post({
      service: ApiServiceEnum.SMART_SYSTEM,
      url: 'sys/user/listById',
      data: ids,
    });
  };

  const tableProps: SmartTableProps = {
    pagerConfig: true,
    useSearchForm: true,
    proxyConfig: {
      ajax: {
        query: ({ ajaxParameter }) => {
          let parameter = ajaxParameter;
          if (props.parameterHandler) {
            parameter = props.parameterHandler(ajaxParameter);
          }
          return listUserApi(parameter);
        },
      },
    },
    // checkboxConfig: {
    //   rowTrigger: 'multiple',
    //   highlight: true,
    // },
    rowConfig: {
      isHover: true,
    },
    searchFormConfig: {
      compact: true,
      colon: true,
      layout: 'inline',
      searchWithSymbol: true,
      actionColOptions: { span: undefined },
      schemas: [
        {
          label: t('system.views.user.table.fullName'),
          field: 'fullName',
          component: 'Input',
          searchSymbol: 'like',
        },
      ],
    },
    columns: [
      // {
      //   type: 'checkbox',
      //   width: 60,
      //   align: 'center',
      //   fixed: 'left',
      // },
      {
        title: '{system.views.user.table.username}',
        field: 'username',
        width: 120,
        fixed: 'left',
      },
      {
        title: '{system.views.user.table.fullName}',
        field: 'fullName',
        minWidth: 120,
        fixed: 'left',
      },
      {
        title: '{system.views.user.table.userType}',
        field: 'userType',
        width: 120,
      },
    ],
  };

  const defaultProps = {
    title: '选择人员',
    labelField: 'fullName',
    valueField: 'userId',
    multiple: true,
    listApi: listUserById,
    tableProps,
    defaultFullscreen: true,
  };

  const computedProps = computed(() => {
    return {
      ...defaultProps,
      ...useAttrs(),
    };
  });
</script>

<style scoped></style>
