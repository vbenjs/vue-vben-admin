<script setup lang="ts">
import { reactive } from 'vue';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Page,
  useVbenModal,
  VbenButton,
} from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Image, message, Switch } from 'ant-design-vue';

import { useShopSettingStore } from '#/store';

import FormModalSendMonthlyReport from './form-modal-send-monthly-report.vue';
import FormModalSendWeeklyReport from './form-modal-send-weekly-report.vue';

const shopSettingStore = useShopSettingStore();
const mailTemplates = reactive([
  {
    type: 'weekly',
    title: 'Weekly Report',
    description: 'Every monday',
    checked: shopSettingStore.mailWeeklyReport,
    loading: false,
    showSample: false,
    sampleImage: '/static/images-sample-mail/weekly-report.png',
  },
  {
    type: 'monthly',
    title: 'Monthly Report',
    description: 'Every first day of the month',
    checked: shopSettingStore.mailMonthlyReport,
    loading: false,
    showSample: false,
    sampleImage: '/static/images-sample-mail/monthly-report.png',
  },
]);

const [SendWeeklyReportModal, sendWeeklyReportModalApi] = useVbenModal({
  connectedComponent: FormModalSendWeeklyReport,
});

const [SendMonthlyReportModal, sendMonthlyReportModalApi] = useVbenModal({
  connectedComponent: FormModalSendMonthlyReport,
});

const sendTestMail = (type: string) => {
  switch (type) {
    case 'monthly': {
      sendMonthlyReportModalApi.open();
      break;
    }
    case 'weekly': {
      sendWeeklyReportModalApi.open();
      break;
    }
    default: {
      console.error('Unknown email type:', type);
    }
  }
};

const toggleSetting = (item: any, checked: boolean) => {
  item.loading = true;

  shopSettingStore
    .toggleMailReport(checked, item.type)
    .then(() => {
      item.checked = checked;
      message.success('The setting has been updated successfully.');
    })
    .finally(() => {
      item.loading = false;
    });
};
</script>

<template>
  <Page>
    <SendWeeklyReportModal />
    <SendMonthlyReportModal />
    <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <template v-for="item in mailTemplates" :key="item.title">
        <Card class="w-full" :title="item.title">
          <CardHeader>
            <CardTitle class="flex items-center justify-between">
              <div>
                <span class="text-xl">{{ item.title }}</span>

                <span class="ml-2 text-sm font-normal italic text-gray-500">
                  ( {{ item.description }} )
                </span>
              </div>
              <Switch
                @change="(checked: any) => toggleSetting(item, checked)"
                :loading="item.loading"
                :checked="item.checked"
              />
            </CardTitle>
          </CardHeader>

          <CardContent class="">
            <div class="flex items-center gap-2">
              <Image
                :style="{ display: 'none' }"
                :preview="{
                  visible: item.showSample,
                  onVisibleChange: (visible: boolean) =>
                    (item.showSample = visible),
                }"
                :src="item.sampleImage"
              />
              <VbenButton
                variant="secondary"
                class="w-full"
                @click="item.showSample = true"
              >
                <IconifyIcon
                  class="mr-2 size-5"
                  icon="ant-design:eye-twotone"
                />
                View Sample Email
              </VbenButton>

              <VbenButton
                variant="secondary"
                class="w-full"
                @click="sendTestMail(item.type)"
              >
                <IconifyIcon
                  class="mr-2 size-5"
                  icon="ant-design:play-circle-twotone"
                />
                Test Email
              </VbenButton>
            </div>
          </CardContent>
        </Card>
      </template>
    </div>
  </Page>
</template>
