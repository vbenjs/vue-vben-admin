<script lang="ts" setup>
import { Page, VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { shopGenerateToken } from '#/api';

import { orderTableOptions } from './table-config';
import { formOptions } from './table-filter';

const [Grid] = useVbenVxeGrid({
  gridOptions: orderTableOptions,
  formOptions,
});

const handleLogin = async (row: any) => {
  row.loading = true;

  const { accessToken } = await shopGenerateToken(row.id);
  const url = `${import.meta.env.VITE_APP_FE_URL}/auth/token?token=${accessToken}`;

  row.loading = false;
  window.open(url, '_blank');
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #id="{ row }">
        <div class="flex flex-col gap-0">
          <div class="font-semibold">
            {{ row.name }}
          </div>
          <div class="!text-xs italic">
            {{ row.id }}
          </div>
        </div>
      </template>

      <template #name="{ row }">
        <div class="flex flex-col gap-0">
          <div class="font-semibold">
            {{ row.ownerName }}
          </div>
          <div class="!text-xs italic">
            {{ row.email }}
          </div>
        </div>
      </template>

      <template #domain="{ row }">
        <div class="flex flex-col items-start justify-center gap-0">
          <a
            :href="`https://${row.myshopifyDomain}`"
            target="_blank"
            class="cursor-pointer font-semibold text-blue-500"
          >
            {{ row.domain }}
          </a>
          <div class="!text-xs italic">
            {{ row.myshopifyDomain }}
          </div>
        </div>
      </template>

      <template #country="{ row }">
        <div class="flex flex-col">
          <div class="font-semibold">
            {{ row.country }}
          </div>
          <div class="italic">
            {{ row.currency }} - {{ row.appCurrency }} (App)
          </div>
        </div>
      </template>

      <template #plan="{ row }">
        <div class="flex flex-col">
          <div class="font-semibold">
            {{ row.plan }}
          </div>
          <div class="italic">{{ row.subscriptionName }} (App)</div>
        </div>
      </template>

      <template #status="{ row }">
        <Tag
          :color="row.status === 'Active' ? 'success' : 'error'"
          class="w-20 text-center"
        >
          {{ row.status }}
        </Tag>
      </template>

      <template #action="{ row }: { row: any }">
        <VbenButton
          @click="handleLogin(row)"
          :loading="row.loading"
          size="sm"
          variant="outline"
        >
          <div class="flex items-center justify-start space-x-1">
            <IconifyIcon
              v-if="!row.loading"
              icon="ant-design:safety-outlined"
              class="mr-2"
            />
            Login
          </div>
        </VbenButton>

        <!-- <Dropdown>
          <VbenButton size="sm" variant="outline">
            <IconifyIcon class="mr-2 size-4" icon="ant-design:more-outlined" />
            Actions
          </VbenButton>
          <template #overlay>
            <Menu>
              <MenuItem @click="handleLogin(row)">
                <div class="flex items-center justify-start space-x-1">
                  <IconifyIcon icon="ant-design:safety-outlined" />
                  <span>Login</span>
                </div>
              </MenuItem>
              <MenuItem
                @click="sendWeeklyReportModalApi.setData({ shop: row }).open()"
              >
                <div class="flex items-center justify-start space-x-1">
                  <IconifyIcon icon="ant-design:mail-twotone" />
                  <span>Send weekly report</span>
                </div>
              </MenuItem>
            </Menu>
          </template>
        </Dropdown> -->
      </template>
    </Grid>
  </Page>
</template>
