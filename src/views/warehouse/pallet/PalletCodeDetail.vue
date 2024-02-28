<template>
  <PageWrapper contentFullHeight>
    <template #headerContent>
      <div class="flex mt-[-12px]">
        <Icon icon="pallet|svg" size="40" />
        <div class="ml-3">
          <div class="flex items-center">
            <BarCode
              :barcode="palletData.barCode"
              :deleted="palletData.deleted"
              productType="PALLET"
            />
            <Tag class="ml-3" :color="productStatusColorMap.get(palletData.status)">
              {{ productStatusMap.get(palletData.status) }}
            </Tag>

            <Icon
              class="cursor-pointer"
              icon="ic:round-help-outline"
              size="18"
              @click="showTimeLine"
            />
          </div>
          <Space :size="42" class="text-[#666666] font-[PingFangSC]">
            <div>{{ `包装日期：${formatToDate(palletData.packingDate)}` }}</div>
            <div>{{ `总箱数：${palletData.boxCount}` }}</div>
            <div>{{ `总盒数：${palletData.packageCount}` }}</div>
            <div>{{ `总片数：${palletData.pieceCount}` }}</div>
          </Space>
        </div>
      </div>
    </template>

    <Card title="箱码列表" size="small">
      <Collapse collapsible="header" destroyInactivePanel>
        <template v-for="item in palletData.subList ?? []" :key="item.name">
          <Collapse.Panel>
            <template #header>
              <Space :size="36" class="w-full">
                <div class="flex items-center">
                  <Icon icon="carbon:barcode" size="18" class="mr-1" />
                  <span>{{ item.barCode }}</span>
                </div>
                <div class="case-title">{{ `包装日期：${formatToDate(item.packingDate)}` }}</div>
                <div class="case-title">{{ `总盒数：${item.packageCount}` }}</div>
                <div class="case-title">{{ `总片数：${item.pieceCount}` }}</div>
              </Space>
            </template>

            <template #extra>
              <div title="箱码详情" v-auth="'boxManager_detail'">
                <Icon
                  icon="ant-design:info-circle-outlined"
                  size="18"
                  @click="handleToCaseDetail(item.id)"
                />
              </div>
            </template>
            <BasicTable @register="registerTable" :data-source="item.subList" />
          </Collapse.Panel>
        </template>
      </Collapse>
    </Card>

    <BoxCaseDetailDrawer @register="registerDrawer" />
    <TimelineDrawer @register="registerTimelineDrawer" />
  </PageWrapper>
</template>
<script lang="tsx" setup>
  import { PageWrapper } from '@/components/Page';
  import { formatToDate } from '@/utils/dateUtil';
  import { Space, Card, Collapse, Tag } from 'ant-design-vue';
  import { Icon } from '@/components/Icon';
  import { useTable, TableAction, BasicTable } from '@/components/Table';
  import { useGo } from '@/hooks/web/usePage';
  import { HashingFactory } from '@/utils/cipher';
  import { getPackageCodeColumns } from '../TableColumns';
  import { useDrawer } from '@/components/Drawer';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { getProductById } from '@/api/warehouse/product';
  import { HxProduct } from '@/ApiModel/warehouse/product';
  import { productStatusColorMap, productStatusMap } from '@/enums/productStatus';
  import BarCode from '@/views/warehouse/components/BarCode.vue';

  defineOptions({ name: 'PalletCodeDetail' });

  const palletData = ref<HxProduct>({} as HxProduct);

  const BoxCaseDetailDrawer = createAsyncComponent(
    () => import('@/views/warehouse/box/Popup/BoxCaseDetailDrawer.vue'),
  );
  const TimelineDrawer = createAsyncComponent(
    () => import('@/views/warehouse/Popup/TimelineDrawer.vue'),
  );

  const go = useGo();
  const route = useRoute();
  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTimelineDrawer, { openDrawer: openTimelineDrawer }] = useDrawer();
  const [registerTable] = useTable({
    columns: getPackageCodeColumns({ ignoreBoxCode: true, ignorePalletCode: true }),
    rowKey: 'id',
    showIndexColumn: false,
    showTableSetting: true,
    pagination: false,
    striped: false,
    emptyDataIsShowTable: false,
    canResize: false,
    actionColumn: {
      width: 60,
      title: '操作',
      dataIndex: 'action',
      auth: ['packageManager_detail'],
      customRender: ({ record }) => {
        return createActions(record);
      },
    },
  });

  const createActions = (record: any) => {
    return (
      <TableAction
        stopButtonPropagation
        actions={[
          {
            icon: 'ant-design:info-circle-outlined',
            tooltip: '详情',
            onClick: () => {
              openDrawer(true, record.id);
            },
          },
        ]}
      />
    );
  };

  const handleToCaseDetail = (id: number) => {
    const md5 = HashingFactory.createMD5Hashing().hash(String(id));
    go({ path: '/warehouse/case_code/detail/' + md5, query: { id } });
  };

  onMounted(async () => {
    const id = Number(route.query.id);
    const res = await getProductById(id);
    palletData.value = res;
  });

  const showTimeLine = () => {
    openTimelineDrawer(true, palletData.value.barCode);
  };
</script>
<style lang="less" scoped>
  .case-title {
    color: #9d9d9d;
    font-family: PingFangSC, 'PingFang SC';
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  }

  :deep(.ant-collapse-content-box) {
    padding: 0;
  }
</style>
