<script lang="ts" setup>
import { Page, VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Dropdown, Menu, MenuItem, Modal, Switch } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { adAttachToCosts, syncAdInfo } from '#/api';
import { getAdsIcon } from '#/shared/utils';
import { useShopStore } from '#/store';

import { gridOptions } from './table-config';
import { formOptions } from './table-filter';

const shopStore = useShopStore();
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  formOptions,
});

const handleSyncAdInfo = (row: any) => {
  Modal.confirm({
    title: 'Sync Ad Information',
    content: 'Would you like to synchronize the Ad information?',
    okText: 'Sync',
    onOk: async () => {
      await syncAdInfo(row.accountType, row.accountId, row.id).then(() => {
        gridApi.query();
      });
    },
  });
};

const handleSwitchCosts = (row: any, checked: any) => {
  row.loading = true;
  adAttachToCosts(
    'ad_id',
    row.accountType,
    row.accountId,
    row.adId,
    checked,
  ).finally(() => {
    gridApi.query();
  });
};

const handleAttachAdGroupToCosts = (row: any) => {
  Modal.confirm({
    title: 'Attach the same Ad Group to costs',
    content:
      'Would you like to attach all ads in this Ad Group to costs? This will enable cost tracking for all ads in the same group.',
    onOk: async () => {
      await adAttachToCosts(
        'ad_group_id',
        row.accountType,
        row.accountId,
        row.adGroupId,
        true,
      ).then(() => {
        gridApi.query();
      });
    },
  });
};

const handleDetachAdGroupFromCosts = (row: any) => {
  Modal.confirm({
    title: 'Detach the same Ad Group from costs',
    content: 'Would you like to detach all ads in this Ad Group from costs?',
    onOk: async () => {
      await adAttachToCosts(
        'ad_group_id',
        row.accountType,
        row.accountId,
        row.adGroupId,
        false,
      ).then(() => {
        gridApi.query();
      });
    },
  });
};

const handleAttachAdCampaignToCosts = (row: any) => {
  Modal.confirm({
    title: 'Attach the same Ad Campaign to costs',
    content: 'Would you like to attach all ads in this Ad Campaign to costs?',
    onOk: async () => {
      await adAttachToCosts(
        'ad_campaign_id',
        row.accountType,
        row.accountId,
        row.adCampaignId,
        true,
      ).then(() => {
        gridApi.query();
      });
    },
  });
};

const handleDetachAdCampaignFromCosts = (row: any) => {
  Modal.confirm({
    title: 'Detach the same Ad Campaign from costs',
    content: 'Would you like to detach all ads in this Ad Campaign from costs?',
    onOk: async () => {
      await adAttachToCosts(
        'ad_campaign_id',
        row.accountType,
        row.accountId,
        row.adCampaignId,
        false,
      ).then(() => {
        gridApi.query();
      });
    },
  });
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #accountType="{ row }: { row: any }">
        <div class="flex w-full items-center justify-center">
          <IconifyIcon
            class="size-[35px]"
            :icon="getAdsIcon(row.accountType)"
          />
        </div>
      </template>

      <template #addToCosts="{ row }: { row: any }">
        <Switch
          @change="
            (checked) => {
              handleSwitchCosts(row, checked);
            }
          "
          :loading="row.loading"
          :checked="row.shopIds.includes(shopStore.shop.id)"
        />
      </template>

      <template #action="{ row }: { row: any }">
        <Dropdown v-if="row.parentId === undefined">
          <VbenButton size="sm" variant="outline">
            <IconifyIcon class="mr-2 size-4" icon="ant-design:more-outlined" />
            Actions
          </VbenButton>
          <template #overlay>
            <Menu>
              <MenuItem @click="handleSyncAdInfo(row)">
                <div class="flex items-center justify-start space-x-2">
                  <IconifyIcon icon="ant-design:sync-outlined" />
                  <span>Sync Ad information</span>
                </div>
              </MenuItem>
              <MenuItem @click="handleAttachAdGroupToCosts(row)">
                <div class="flex items-center justify-start space-x-2">
                  <IconifyIcon icon="ant-design:plus-outlined" />
                  <span>Attach the same Ad Group to costs</span>
                </div>
              </MenuItem>
              <MenuItem @click="handleDetachAdGroupFromCosts(row)">
                <div class="flex items-center justify-start space-x-2">
                  <IconifyIcon icon="ant-design:minus-outlined" />
                  <span>Detach the same Ad Group from costs</span>
                </div>
              </MenuItem>
              <MenuItem @click="handleAttachAdCampaignToCosts(row)">
                <div class="flex items-center justify-start space-x-2">
                  <IconifyIcon icon="ant-design:plus-outlined" />
                  <span>Attach the same Ad Campaign to costs</span>
                </div>
              </MenuItem>
              <MenuItem @click="handleDetachAdCampaignFromCosts(row)">
                <div class="flex items-center justify-start space-x-2">
                  <IconifyIcon icon="ant-design:minus-outlined" />
                  <span>Detach the same Ad Campaign from costs</span>
                </div>
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </template>
    </Grid>
  </Page>
</template>
