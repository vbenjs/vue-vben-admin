<template>
  <BasicModal @register="registerModal" :title="t('system.views.user.button.setRole')">
    <SmartTable @register="registerTable" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { SmartTable, useSmartTable } from '@/components/SmartTable';
  import { ref } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

  const { t } = useI18n();

  const currentUserId = ref<number | null>(null);

  const [registerModal] = useModalInner(async (userId: number) => {
    currentUserId.value = userId;
    await query();
  });

  // const setSelectRole = () => {
  //   const userId = unref(currentUserId)!;
  // };

  const [registerTable, { query }] = useSmartTable({
    border: true,
    size: 'small',
    checkboxConfig: {
      rowTrigger: 'multiple',
    },
    proxyConfig: {
      autoLoad: false,
      ajax: {
        query: ({ ajaxParameter }) => {
          return defHttp.post({
            service: ApiServiceEnum.SMART_SYSTEM,
            url: 'sys/role/list',
            data: {
              sortName: 'seq',
              ...ajaxParameter,
              parameter: {
                ...ajaxParameter?.parameter,
                'useYn@=': true,
              },
            },
          });
        },
      },
    },
    columns: [
      {
        type: 'checkbox',
        width: 50,
      },
      {
        title: '#',
        type: 'seq',
        width: 50,
      },
      {
        title: '角色编码',
        field: 'roleCode',
        width: 160,
      },
      {
        title: '角色名称',
        field: 'roleName',
        minWidth: 160,
      },
    ],
  });
</script>

<style scoped lang="less"></style>
