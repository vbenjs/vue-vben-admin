<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SystemDictApi } from '#/api';

import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';
import { Plus } from '@vben/icons';
import { useDictStore } from '@vben/stores';

import { Button, message, Tag } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteDictData, getDictDataList } from '#/api';
import { $t } from '#/locales';

import { useDataColumns, useDataGridFormSchema } from './data';
import Form from './modules/data-form.vue';

const route = useRoute();
const { closeCurrentTab, setTabTitle } = useTabs();
const dictStore = useDictStore();

const dictCode = computed(() => String(route.params.code ?? ''));

// 标签页在布局里才登记，setup 阶段调用 setTabTitle 找不到标签。
// 挂载后再写入，并用 computed 跟随编码和语言变化。
onMounted(() => {
  setTabTitle(
    computed(() => `${$t('system.dict.dataTitle')} - ${dictCode.value}`),
  );
});

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useDataGridFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useDataColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getDictDataList({
            dictCode: dictCode.value,
            page: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: true,
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<SystemDictApi.SystemDictData>,
});

watch(dictCode, () => {
  refreshGrid();
});

function onActionClick({
  code,
  row,
}: OnActionClickParams<SystemDictApi.SystemDictData>) {
  switch (code) {
    case 'delete': {
      onDelete(row);
      break;
    }
    case 'edit': {
      onEdit(row);
      break;
    }
  }
}

function onCreate() {
  formModalApi.setData({ dictCode: dictCode.value }).open();
}

function onEdit(row: SystemDictApi.SystemDictData) {
  formModalApi.setData(row).open();
}

function onDelete(row: SystemDictApi.SystemDictData) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.label]),
    duration: 0,
    key: 'action_process_msg',
  });
  deleteDictData(row.id)
    .then(() => {
      dictStore.refreshDict(dictCode.value);
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.label]),
        key: 'action_process_msg',
      });
      refreshGrid();
    })
    .catch(() => {
      hideLoading();
    });
}

function onClose() {
  closeCurrentTab();
}

function refreshGrid() {
  gridApi.query();
}
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="refreshGrid" />
    <Grid :table-title="$t('system.dict.dataList')">
      <template #toolbar-tools>
        <Button class="mr-2" @click="onClose">
          {{ $t('preferences.tabbar.contextMenu.close') }}
        </Button>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('system.dict.label')]) }}
        </Button>
      </template>
      <template #label="{ row }">
        <Tag v-if="row.color" :color="row.color">{{ row.label }}</Tag>
        <span v-else>{{ row.label }}</span>
      </template>
    </Grid>
  </Page>
</template>
