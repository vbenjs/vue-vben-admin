<script setup lang="ts">
import { reactive } from 'vue';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Page,
  VbenButton,
} from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Switch } from 'ant-design-vue';

const mailTemplates = reactive([
  {
    type: 'weekly',
    title: 'Weekly Report',
    checked: true,
    loading: false,
  },
  // {
  //   type: 'monthly',
  //   title: 'Monthly Report',
  //   checked: false,
  //   loading: false,
  // },
]);

const viewSample = (type: string) => {
  // eslint-disable-next-line no-console
  console.log(type);
};

const sendSample = (type: string) => {
  // eslint-disable-next-line no-console
  console.log(type);
};

const toggleSetting = (item: any, checked: boolean) => {
  item.loading = true;

  setTimeout(() => {
    item.loading = false;
    item.checked = checked;
  }, 2000);
};
</script>

<template>
  <Page>
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <template v-for="item in mailTemplates" :key="item.title">
        <Card class="w-full" :title="item.title">
          <CardHeader>
            <CardTitle class="flex items-center justify-between text-xl">
              <div class="txt-lg">
                {{ item.title }}
              </div>
              <Switch
                @change="(checked: any) => toggleSetting(item, checked)"
                :loading="item.loading"
                :checked="item.checked"
              />
            </CardTitle>
          </CardHeader>

          <CardContent class="flex items-center gap-2">
            <VbenButton
              variant="secondary"
              class="w-full"
              @click="viewSample(item.type)"
            >
              <IconifyIcon class="mr-2 size-5" icon="ant-design:eye-twotone" />
              View Sample Email
            </VbenButton>

            <VbenButton
              variant="secondary"
              class="w-full"
              @click="sendSample(item.type)"
            >
              <IconifyIcon
                class="mr-2 size-5"
                icon="ant-design:play-circle-twotone"
              />
              Test Email
            </VbenButton>
          </CardContent>
        </Card>
      </template>
    </div>
  </Page>
</template>
