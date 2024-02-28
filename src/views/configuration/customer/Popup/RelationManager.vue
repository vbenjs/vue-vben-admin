<template>
  <PageWrapper contentFullHeight>
    <!-- <div class="flex">
      <Card class="fixed top-24 left-4">
        <Anchor :items="tabItems" @click="handleClick" />
      </Card>
      <Card class="ml-45">
        <BasicForm @register="registerForm" />
        <div class="h-80"></div>
      </Card>
    </div> -->
    <Card size="small" v-if="customerId">
      <Tabs tab-position="left" animated destroyInactiveTabPane>
        <Tabs.TabPane v-for="item in tabItems" :key="item.key" :tab="item.title">
          <TableApiTransfer
            :customerId="customerId"
            :api="item.api"
            :columns="item.columns"
            :create-api="item.createApi"
            :delete-api="item.deleteApi"
            :init-api="item.initApi"
          />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { Card, Tabs } from 'ant-design-vue';
  import { getBaseProduct } from '@/api/configuration/product';
  import { getBaseEfficiency } from '@/api/configuration/efficiency';
  import { otherDataTypeOptions } from '@/enums/baseDataType';
  import { getBaseData } from '@/api/configuration/base';

  import {
    createCustomerBase,
    createCustomerEfficiency,
    createCustomerProduct,
    deleteCustomerBase,
    deleteCustomerEfficiency,
    deleteCustomerProduct,
    getCustomerBase,
    getCustomerEfficiency,
    getCustomerProduct,
  } from '@/api/configuration/customer';
  import { PageWrapper } from '@/components/Page';
  import { useRoute } from 'vue-router';
  import TableApiTransfer from '../components/TableApiTransfer.vue';
  import { getColumns } from '@/views/configuration/base/Popup/data';

  defineOptions({ name: 'RelationManager' });

  const route = useRoute();

  const customerId = ref<number>(0);

  const tabItems = [
    {
      key: 'product',
      title: '关联产品',
      api: (where) => getBaseProduct(where, null, true),
      columns: getColumns('PRODUCT', { sorter: 'self', showEnable: false }),
      createApi: createCustomerProduct,
      deleteApi: deleteCustomerProduct,
      initApi: async () => getCustomerProduct(customerId.value),
    },
    {
      key: 'efficiency',
      title: '关联效率',
      api: (where) => getBaseEfficiency(where, null, true),
      columns: getColumns('EFFICIENCY', { sorter: 'self', showEnable: false }),
      createApi: createCustomerEfficiency,
      deleteApi: deleteCustomerEfficiency,
      initApi: () => getCustomerEfficiency(customerId.value),
    },
    ...otherDataTypeOptions.map((item) => ({
      key: item.value,
      title: `关联${item.label}`,
      api: (where) => getBaseData({ ...where, dataType: item.value }, null, true),
      columns: getColumns(item.value, { sorter: 'self', showEnable: false }),
      createApi: createCustomerBase,
      deleteApi: deleteCustomerBase,
      initApi: async () => {
        const data = await getCustomerBase(customerId.value);
        return data?.filter((i) => i.dataType === item.value);
      },
    })),
  ];

  onMounted(async () => {
    const id = Number(route.params.id);
    customerId.value = id;
  });
</script>
