<script lang="ts" setup>
import type { IProduct } from './table-config';

import { reactive } from 'vue';

import { useVbenModal, VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import {
  DatePicker,
  Image,
  InputNumber,
  message,
  TypographyTitle,
} from 'ant-design-vue';

import { productUpdateCogsByDateRange } from '#/api';
import dayjs, { dayjsInGMT } from '#/shared/dayjs';
import { formatReportDate } from '#/shared/utils';
import { useShopStore } from '#/store';

const state = reactive({
  formValue: null as IProduct | null,
  cogsArr: [] as { date: any; price: any }[],
});

const shopStore = useShopStore();

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    modalApi.lock();

    productUpdateCogsByDateRange({
      regionId: state.formValue?.regionId,
      productId: state.formValue?.productId,
      variantId: state.formValue?.variantId,
      cogs: state.cogsArr,
    })
      .then(() => {
        message.success('Cost of Goods Sold updated successfully');
      })
      .finally(() => {
        modalApi.setData({ reload: true, row: state.formValue });
        modalApi.close();
      });
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      state.formValue = modalApi.getData<IProduct>();

      // Parse state.cogsInfo from state.formValue
      const zoneUUID = state.formValue?.regionId;

      // Convert object to array
      state.cogsArr = state.formValue?.fees[zoneUUID]?.cogs ?? [];
      state.cogsArr = state.cogsArr.map((item: any) => {
        return {
          date: dayjs.unix(item.date),
          price: item.price,
        };
      });
    }
  },
});

const showRemoveBtn = (counter: any) => {
  if (counter === state.cogsArr.length - 1) {
    return false;
  }

  return true;
};

const getNextDate = (counter: any) => {
  if (!counter) {
    return 'Ongoing';
  }

  const previousDate = state.cogsArr[counter - 1]?.date.subtract(1, 'day');
  return formatReportDate(previousDate, 'YYYY-MM-DD');
};

const addNewRow = () => {
  const newDate = dayjsInGMT();
  state.cogsArr = [
    {
      date: newDate,
      price: 0,
    },
    ...state.cogsArr,
  ];
};
</script>
<template>
  <Modal class="w-[700px]" title="Cost of Goods Sold" confirm-text="Submit">
    <div class="mb-5 w-full text-center">
      <Image
        v-if="state.formValue?.image"
        :src="state.formValue?.image"
        class="!h-[100px] !w-[100px] rounded-lg border"
      />
    </div>

    <div class="text-center">
      <TypographyTitle :level="4">
        {{ state.formValue?.productTitle }}
      </TypographyTitle>

      <TypographyTitle
        class="!mt-0 !italic"
        :level="5"
        v-if="state.formValue?.variantTitle"
      >
        Variant - {{ state.formValue?.variantTitle }}
      </TypographyTitle>
    </div>

    <div class="relative !mt-8 overflow-x-auto">
      <table
        class="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400"
      >
        <thead
          class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3 text-center">From</th>
            <th scope="col" class="px-6 py-3 text-center">To</th>
            <th scope="col" class="px-6 py-3">Price</th>
            <th scope="col" class="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(_item, _key) in state.cogsArr"
            :key="_key"
            class="bg-white dark:bg-gray-800"
          >
            <td class="px-4 py-2 text-center">
              <DatePicker
                v-if="showRemoveBtn(_key)"
                v-model:value="_item.date"
                class="w-full"
                format="YYYY-MM-DD"
                placeholder="Select date"
              />
              <div v-else>{{ _item.date.format('YYYY-MM-DD') }}</div>
            </td>
            <td class="px-4 py-2 text-center">
              {{ getNextDate(_key) }}
            </td>
            <td class="px-4 py-2">
              <InputNumber
                :min="0"
                :prefix="shopStore.shop.currencySymbol"
                v-model:value="_item.price"
                class="w-full"
              />
            </td>
            <td class="flex w-full items-center justify-center py-2">
              <div class="size-7">
                <VbenButton
                  variant="outline"
                  class="size-7"
                  size="icon"
                  v-if="showRemoveBtn(_key)"
                  @click="state.cogsArr.splice(_key, 1)"
                >
                  <IconifyIcon
                    class="size-6 text-red-500"
                    icon="ic:baseline-minus"
                  />
                </VbenButton>
              </div>
              <div class="ml-2 size-7">
                <VbenButton
                  variant="outline"
                  class="size-7"
                  size="icon"
                  v-if="!_key"
                  @click="addNewRow()"
                >
                  <IconifyIcon
                    class="text-foreground size-6"
                    icon="ic:baseline-plus"
                  />
                </VbenButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Modal>
</template>
