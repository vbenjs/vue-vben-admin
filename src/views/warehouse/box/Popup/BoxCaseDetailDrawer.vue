<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    :width="578"
    destroyOnClose
  >
    <div class="mb-4 flex items-center">
      <Icon icon="carbon:barcode" size="18" class="mr-2" />
      <BarCode
        :barcode="packageData.barCode"
        :deleted="packageData.deleted"
        productType="PACKAGE"
      />

      <Tag class="ml-3" :color="productStatusColorMap.get(packageData.status)">
        {{ productStatusMap.get(packageData.status) }}
      </Tag>

      <Icon class="cursor-pointer" icon="ic:round-help-outline" size="18" @click="showTimeLine" />
    </div>

    <Card size="small" class="mb-4">
      <template #title>
        <Icon icon="box|svg" size="18" class="mr-1" />
        <span>盒码信息</span>
      </template>
      <Description :column="column" :bordered="false" :data="packageData" :schema="boxCodeSchema" />
    </Card>

    <Card size="small" class="mb-4">
      <template #title>
        <Icon icon="tag|svg" size="18" class="mr-1" />
        <span>产品信息</span>
      </template>
      <Description
        :column="column"
        :bordered="false"
        :data="packageData.product"
        :schema="productInfoSchema"
      />
    </Card>

    <Card size="small" class="mb-4">
      <template #title>
        <Icon icon="efficiency|svg" size="18" class="mr-1" />
        <span>效率</span>
      </template>
      <Description
        :column="column"
        :bordered="false"
        :data="packageData.efficiency"
        :schema="efficiencySchema"
      />
    </Card>

    <Card size="small" class="mb-4">
      <template #title>
        <Icon icon="other|svg" size="18" class="mr-1" />
        <span>其他</span>
      </template>
      <Description :column="column" :bordered="false" :data="packageData" :schema="otherSchema" />
    </Card>

    <TimelineDrawer @register="registerTimelineDrawer" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { modalTitle } from '../data';
  import { useDrawerInner, BasicDrawer, useDrawer } from '@/components/Drawer';
  import {
    productInfoSchema,
    efficiencySchema,
    otherSchema,
    boxCodeSchema,
  } from '../../DescriptionSchema';
  import { Icon } from '@/components/Icon';
  import { Description } from '@/components/Description';
  import { Card, Tag } from 'ant-design-vue';
  import { getProductById } from '@/api/warehouse/product';
  import { HxProduct } from '@/ApiModel/warehouse/product';
  import { ref } from 'vue';
  import { productStatusColorMap, productStatusMap } from '@/enums/productStatus';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import BarCode from '@/views/warehouse/components/BarCode.vue';

  const TimelineDrawer = createAsyncComponent(
    () => import('@/views/warehouse/Popup/TimelineDrawer.vue'),
  );
  const [registerTimelineDrawer, { openDrawer: openTimelineDrawer }] = useDrawer();

  const packageData = ref<HxProduct>({} as HxProduct);

  const [registerDrawer, { setDrawerProps, changeLoading }] = useDrawerInner(async (id) => {
    try {
      changeLoading(true);
      setDrawerProps({ confirmLoading: false });

      const data = await getProductById(id);
      packageData.value = data;
    } finally {
      changeLoading(false);
    }
  });

  const getTitle = '查看' + modalTitle;
  const column = 2;

  const showTimeLine = () => {
    openTimelineDrawer(true, packageData.value.barCode);
  };
</script>
