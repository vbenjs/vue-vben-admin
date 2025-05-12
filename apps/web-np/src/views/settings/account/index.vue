<script lang="ts" setup>
import { Page, VbenButton } from '@vben/common-ui';
import { useAppConfig } from '@vben/hooks';
import { IconifyIcon } from '@vben/icons';
import { capitalizeFirstLetter } from '@vben/utils';

import { Dropdown, Menu, MenuItem, Modal, Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteAccount, syncAccount } from '#/api';
import { accountType } from '#/constants';
import { useShopStore } from '#/store';
import { redirectToNewTab } from '#/utils';

import { gridOptions } from './table-config';
import { formOptions } from './table-filter';

const shopStore = useShopStore();

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  formOptions,
});

const getAccountIcon = (type: string) => {
  const val = accountType.find((item) => item.value === type)?.icon;
  return val || 'ant-design:question-circle-outlined';
};

const addNewConnection = (type: string) => {
  const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);
  const url = `${apiURL}/auth-social/generate?type=${type}&shopId=${shopStore.shop.id}`;

  redirectToNewTab(url);
};

const statusList = [
  {
    value: 'connected',
    label: 'Connected',
    className: 'success',
  },
  {
    value: 'disconnected',
    label: 'Disconnected',
    className: 'error',
  },
  {
    value: 'active',
    label: 'Active',
    className: 'success',
  },
  {
    value: 'inactive',
    label: 'Inactive',
    className: 'error',
  },
];

const getStatusClass = (status: string) => {
  const item = statusList.find((item) => item.value === status);
  return item ? item.className : 'default';
};

const handleDelete = (row: any) => {
  Modal.confirm({
    title: 'Remove Connection',
    content:
      'Are you sure you want to remove this connection? This action cannot be undone.',
    okType: 'danger',
    okText: 'Yes',
    cancelText: 'No',
    onOk: async () => {
      await deleteAccount(row.id).then(() => {
        gridApi.query();
      });
    },
  });
};

const handleManualSync = (row: any) => {
  Modal.confirm({
    title: 'Sync Account Information',
    content: 'Do you want to sync all Ad Accounts?',
    okText: 'Sync',
    onOk: async () => {
      await syncAccount(row.id).then(() => {
        gridApi.query();
      });
    },
  });
};
</script>

<template>
  <Page auto-content-height>
    <FormContentModal />

    <Grid table-title="Ads Integration">
      <template #toolbar-tools>
        <VbenButton
          class="mr-2"
          size="sm"
          type="primary"
          @click="addNewConnection('facebook')"
        >
          <IconifyIcon
            class="mr-2 size-4"
            icon="ant-design:plus-circle-outlined"
          />
          Add Facebook Connection
        </VbenButton>
      </template>

      <template #type="{ row }: { row: any }">
        <div
          v-if="row.parentId === undefined"
          class="my-1 flex items-center justify-start space-x-2"
        >
          <!-- Avatar and Title - Only show for parent level -->
          <div class="h-[35px] w-[35px] flex-none">
            <IconifyIcon
              class="size-[35px] text-red-500"
              :icon="getAccountIcon(row.type)"
            />
          </div>
          <div class="ml-1 shrink">
            <div class="font-semibold">
              {{ row.name }}
            </div>
            <div class="text-muted-foreground text-xs italic">
              {{ row.email }}
            </div>
          </div>
        </div>
        <div v-else class="pl-10">
          {{ row.name }}
        </div>
      </template>

      <template #status="{ row }: { row: any }">
        <Tag :color="getStatusClass(row.status)" class="w-[100px] text-center">
          {{ capitalizeFirstLetter(row.status) }}
        </Tag>
      </template>

      <template #action="{ row }: { row: any }">
        <Dropdown v-if="row.parentId === undefined">
          <VbenButton size="sm" variant="outline">
            <IconifyIcon class="mr-2 size-4" icon="ant-design:more-outlined" />
            Actions
          </VbenButton>
          <template #overlay>
            <Menu>
              <MenuItem @click="handleDelete(row)">
                <div class="flex items-center justify-start space-x-1">
                  <IconifyIcon icon="ant-design:delete-twotone" />
                  <span>Remove</span>
                </div>
              </MenuItem>
              <MenuItem
                @click="handleManualSync(row)"
                :disabled="row.status !== 'connected'"
              >
                <div class="flex items-center justify-start space-x-1">
                  <IconifyIcon icon="ant-design:sync-outlined" />
                  <span>Manual sync</span>
                </div>
              </MenuItem>
              <MenuItem @click="addNewConnection(row.type)">
                <div class="flex items-center justify-start space-x-1">
                  <IconifyIcon icon="ant-design:link-outlined" />
                  <span>Reconnect</span>
                </div>
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </template>
    </Grid>
  </Page>
</template>
