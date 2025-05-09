<script lang="ts" setup>
import { Page, VbenButton } from '@vben/common-ui';
import { useAppConfig } from '@vben/hooks';
import { IconifyIcon } from '@vben/icons';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { accountType } from '#/constants';
import { useShopStore } from '#/store';
import { redirectToNewTab } from '#/utils';

import { gridOptions } from './table-config';
import { formOptions } from './table-filter';

const shopStore = useShopStore();

const [Grid] = useVbenVxeGrid({
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
          New Facebook Connection
        </VbenButton>
      </template>

      <template #type="{ row }: { row: any }">
        <!-- Avatar and Title - Only show for parent level -->
        <div class="my-1 flex items-center justify-start space-x-2">
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
      </template>

      <template #action="">
        <VbenButton variant="outline" size="icon" class="mr-2 size-7">
          <IconifyIcon
            class="size-4 text-red-500"
            icon="ant-design:delete-twotone"
          />
        </VbenButton>
        <VbenButton variant="outline" size="icon" class="size-7">
          <IconifyIcon
            class="text-primary-500 size-4"
            icon="ant-design:edit-twotone"
          />
        </VbenButton>
      </template>
    </Grid>
  </Page>
</template>
