<!--人员选择弹窗-->
<template>
  <SmartTableSelectModal
    v-bind="$attrs"
    :table-props="tableProps"
    :select-table-props="commonTableProps"
    @register="registerModal"
    label-field="fullName"
    :list-api="listUserByIdApi"
    @select-data="handleSelectData"
    value-field="userId"
  />
</template>

<script lang="ts" setup>
  import type { SmartTableProps } from '@/components/SmartTable';

  import { reactive } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';

  import { listUserApi, listUserByIdApi } from '@/api/sys/SystemApi';
  import { useModal } from '@/components/Modal';

  import SmartTableSelectModal from './base/SmartTableSelectModal';

  const { t } = useI18n();

  const emit = defineEmits(['update:selectValues', 'selected']);

  const [registerModal] = useModal();

  const handleSelectData = (options: LabelValueOptions) => {
    const userIdList = options.map((item) => item.value);
    emit('update:selectValues', userIdList);
    emit('selected', userIdList);
  };

  const commonTableProps: SmartTableProps = {
    pagerConfig: true,
    columns: [
      {
        type: 'checkbox',
        width: 60,
        align: 'center',
        fixed: 'left',
      },
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

  const tableProps = reactive<SmartTableProps>({
    useSearchForm: true,
    checkboxConfig: {
      rowTrigger: 'multiple',
    },
    searchFormConfig: {
      compact: true,
      colon: true,
      searchWithSymbol: true,
      actionColOptions: {
        span: 12,
      },
      baseColProps: {
        span: 12,
      },
      schemas: [
        {
          label: t('system.views.user.table.fullName'),
          field: 'fullName',
          component: 'Input',
          searchSymbol: 'like',
        },
      ],
    },
    proxyConfig: {
      ajax: {
        query: (params) => listUserApi(params.ajaxParameter),
      },
    },
    ...commonTableProps,
  });
</script>

<style scoped></style>
