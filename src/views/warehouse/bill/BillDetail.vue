<template>
  <PageWrapper contentFullHeight>
    <template #headerContent>
      <div class="flex mt-[-12px]">
        <Icon icon="bill_detail|svg" size="40" />
        <div class="ml-3">
          <div>
            <Space :size="18">
              <span class="text-base text-[#393939] font-[PingFangSC] font-medium">
                {{ billData.billCode }}
              </span>
              <Tag :color="billStatusColorMap.get(billData.status)">
                {{ billStatusMap.get(billData?.status) }}
              </Tag>
            </Space>
          </div>
          <Space :size="42">
            <div>{{ `制单人：${billData.createdName ?? billData.createdBy}` }}</div>
            <div>{{ `日期：${formatToDate(billData.billDate)}` }}</div>
          </Space>
        </div>
      </div>
    </template>

    <Tabs type="card" class="bg-white p-4" v-if="billData?.billCode">
      <template v-for="item in tabs" :key="item.key">
        <Tabs.TabPane :tab="item.tab">
          <BasicTable
            :api="item.api"
            :columns="item.columns"
            row-key="id"
            :showIndexColumn="false"
            :resize-height-offset="26"
            :actionColumn="{
              width: 60,
              title: '操作',
              dataIndex: 'action',
              customRender: ({ record }) => {
                return createActions(record as any);
              },
            }"
          />
        </Tabs.TabPane>
      </template>
    </Tabs>

    <BoxCaseDetailDrawer @register="registerDrawer" />
  </PageWrapper>
</template>
<script lang="tsx" setup>
  import { PageWrapper } from '@/components/Page';
  import { formatToDate } from '@/utils/dateUtil';
  import { Space, Tabs, Tag } from 'ant-design-vue';
  import { TableAction, BasicTable, BasicColumn } from '@/components/Table';
  import {
    getBillItemColumns,
    getPackageCodeColumns,
    getBoxCodeColumns,
    getPalletCodeColumns,
  } from '../TableColumns';
  import { useGo } from '@/hooks/web/usePage';
  import { HashingFactory } from '@/utils/cipher';
  import { useDrawer } from '@/components/Drawer';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { onMounted, ref } from 'vue';
  import { getBillById } from '@/api/warehouse/bill';
  import { useRoute } from 'vue-router';
  import { ProductType } from '@/enums/productType';
  // import { HxBillItem } from '@/ApiModel/warehouse/bilItem';
  import { HxProduct } from '@/ApiModel/warehouse/product';

  import { HxBill } from '@/ApiModel/warehouse/bill';
  import { Icon } from '@/components/Icon';
  import { billStatusColorMap, billStatusMap } from '@/enums/billStatus';
  import { useTabs } from '@/hooks/web/useTabs';
  import { useOptionStore } from '@/store/modules/options';
  import { getBillItem } from '@/api/warehouse/bilItem';
  import { YN } from '@/enums/YN';
  import { Result } from '/#/axios';
  import { HxBillItem } from '@/ApiModel/warehouse/bilItem';

  defineOptions({ name: 'BillDetail' });

  const go = useGo();
  const route = useRoute();
  const { setTitle } = useTabs();
  const optionStore = useOptionStore();
  const billData = ref<HxBill>({} as HxBill);

  type TabItemKey = ProductType | 'scanCreate';

  interface TabItem {
    key: TabItemKey;
    tab: string;
    columns: BasicColumn[];
    api: (...arg: any[]) => Promise<any>;
  }

  const fetch = async (where: any) => {
    const data = (await getBillItem({
      ...where,
      billCode: billData.value.billCode,
    })) as any as Result<HxBillItem[]>;
    const list = data.data.map((item) => {
      return {
        ...item.product,
        barCode: item.productCode,
      };
    });
    return { ...data, data: list };
  };

  const tabs = ref<TabItem[]>([
    {
      key: 'PALLET',
      tab: '托码明细',
      columns: getPalletCodeColumns(),
      api: (where) => fetch({ ...where, productType: 'PALLET' }),
    },
    {
      key: 'BOX',
      tab: '箱码明细',
      columns: getBoxCodeColumns(),
      api: (where) => fetch({ ...where, productType: 'BOX' }),
    },
    {
      key: 'PACKAGE',
      tab: '盒码明细',
      columns: getPackageCodeColumns(),
      api: (where) => fetch({ ...where, productType: 'PACKAGE' }),
    },
    {
      key: 'scanCreate',
      tab: `明细`,
      columns: getBillItemColumns(),
      api: (where) => fetch({ ...where, scanCreate: YN.Y }),
    },
  ]);

  const BoxCaseDetailDrawer = createAsyncComponent(
    () => import('@/views/warehouse/box/Popup/BoxCaseDetailDrawer.vue'),
  );

  const [registerDrawer, { openDrawer }] = useDrawer();

  const createActions = (record: HxProduct) => {
    return (
      <TableAction
        stopButtonPropagation
        actions={[
          {
            icon: 'ant-design:info-circle-outlined',
            tooltip: '详情',
            auth: `${record?.productType.toLowerCase()}Manager_detail`,
            onClick: () => {
              const type = record.productType;
              const md5 = HashingFactory.createMD5Hashing().hash(String(record.id));
              if (type === 'PACKAGE') {
                openDrawer(true, record.id);
              } else if (type === 'BOX') {
                go({ path: '/warehouse/case_code/detail/' + md5, query: { id: record.id } });
              } else if (type === 'PALLET') {
                go({ path: '/warehouse/pallet_code/detail/' + md5, query: { id: record.id } });
              }
            },
          },
        ]}
      />
    );
  };

  onMounted(async () => {
    const { id } = route.query;
    const data = await getBillById(Number(id));
    billData.value = data;
    const type = optionStore.getOptionName(data.type, 'billType');
    setTitle(`${type}单详情-${data.billCode}`);

    // tabs.value.forEach((item) => {
    //   if (item.key === 'scanCreate') {
    //     item.data = data.itemList
    //       ?.filter((i) => i.scanCreate === 'Y' && !!i.product)
    //       ?.map((i) => i.product);
    //     item.tab = `${type}明细`;
    //   } else {
    //     item.data = data.itemList
    //       ?.filter((i) => i.productType === item.key && !!i.product)
    //       ?.map((i) => i.product);
    //   }
    // });

    const tab = tabs.value.find((item) => item.key === 'scanCreate');
    tab!.tab = `${type}明细`;
  });
</script>
