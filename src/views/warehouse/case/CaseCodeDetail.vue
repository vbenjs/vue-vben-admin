<template>
  <PageWrapper contentFullHeight>
    <template #headerContent>
      <div class="flex mt-[-12px]">
        <Icon icon="box|svg" size="40" />
        <div class="ml-3">
          <div class="flex items-center">
            <BarCode :barcode="caseData.barCode" :deleted="caseData.deleted" productType="BOX" />
            <Tag class="ml-3" :color="productStatusColorMap.get(caseData.status)">
              {{ productStatusMap.get(caseData.status) }}
            </Tag>

            <Icon
              class="cursor-pointer"
              icon="ic:round-help-outline"
              size="18"
              @click="showTimeLine"
            />
          </div>
          <Space :size="42" class="text-[#666666] font-[PingFangSC]">
            <div>{{ `包装日期：${formatToDate(caseData.packingDate)}` }}</div>
            <div>{{ `总盒数：${caseData.packageCount}` }}</div>
            <div>{{ `总片数：${caseData.pieceCount}` }}</div>
          </Space>
        </div>
      </div>
    </template>
    <Row :gutter="[20, 20]">
      <Col :xl="10" :lg="24">
        <Card title="产品详情">
          <div class="my-3">
            <div class="mb-2">
              <Icon icon="tag|svg" size="18" class="mr-1" />
              <span>产品信息</span>
            </div>
            <Description
              :column="2"
              :bordered="false"
              :data="caseData.product"
              :schema="productInfoSchema"
            />
          </div>

          <div class="my-3">
            <div class="mb-2">
              <Icon icon="efficiency|svg" size="18" class="mr-1" />
              <span>效率</span>
            </div>
            <Description
              :column="2"
              :bordered="false"
              :data="caseData.efficiency"
              :schema="efficiencySchema"
            />
          </div>

          <div class="my-3">
            <div class="mb-2">
              <Icon icon="other|svg" size="18" class="mr-1" />
              <span>其他</span>
            </div>
            <Description :column="2" :bordered="false" :data="caseData" :schema="otherSchema" />
          </div>
        </Card>
      </Col>
      <Col :xl="14" :lg="24">
        <Card title="盒码列表">
          <BasicTable @register="registerTable" :data-source="caseData.subList" />
        </Card>
      </Col>
    </Row>

    <BoxCaseDetailDrawer @register="registerDrawer" />
    <TimelineDrawer @register="registerTimelineDrawer" />
  </PageWrapper>
</template>
<script lang="tsx" setup>
  import { Description } from '@/components/Description';
  import { PageWrapper } from '@/components/Page';
  import { formatToDate } from '@/utils/dateUtil';
  import { Card, Row, Col, Space, Tag } from 'ant-design-vue';
  import { Icon } from '@/components/Icon';
  import { useTable, TableAction, BasicTable } from '@/components/Table';
  import { useDrawer } from '@/components/Drawer';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { productInfoSchema, efficiencySchema, otherSchema } from '../DescriptionSchema';
  import { getPackageCodeColumns } from '../TableColumns';
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { HxProduct } from '@/ApiModel/warehouse/product';
  import { getProductById } from '@/api/warehouse/product';
  import { productStatusMap, productStatusColorMap } from '@/enums/productStatus';
  import BarCode from '@/views/warehouse/components/BarCode.vue';

  defineOptions({ name: 'CaseCodeDetail' });

  const BoxCaseDetailDrawer = createAsyncComponent(
    () => import('@/views/warehouse/box/Popup/BoxCaseDetailDrawer.vue'),
  );
  const TimelineDrawer = createAsyncComponent(
    () => import('@/views/warehouse/Popup/TimelineDrawer.vue'),
  );
  const caseData = ref<HxProduct>({} as HxProduct);

  const route = useRoute();
  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTimelineDrawer, { openDrawer: openTimelineDrawer }] = useDrawer();

  const [registerTable] = useTable({
    columns: getPackageCodeColumns({ ignoreBoxCode: true }),
    rowKey: 'id',
    showIndexColumn: false,
    showTableSetting: true,
    pagination: false,
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

  const createActions = (record: HxProduct) => {
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

  onMounted(async () => {
    const id = Number(route.query.id);
    const res = await getProductById(id);
    caseData.value = res;
  });

  const showTimeLine = () => {
    openTimelineDrawer(true, caseData.value.barCode);
  };
</script>
