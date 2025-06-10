<script lang="ts" setup>
import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getAdsIcon } from '#/shared/utils';

import { gridOptions } from './table-config';
import { formOptions } from './table-filter';

const [Grid] = useVbenVxeGrid({
  gridOptions,
  formOptions,
});
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
    </Grid>
  </Page>
</template>
