<template>
  <Dropdown trigger="click">
    <Space>
      <div @click.prevent class="text-[#333333] cursor-pointer"> {{ brandStore.getBrandName }}</div>
      <Icon icon="teenyicons:down-solid" size="10" class="text-[#333333]" />
    </Space>
    <template #overlay>
      <Menu>
        <MenuItem
          v-for="item in brandStore.BrandList"
          :key="item.id"
          :disabled="item.enabled !== 'Y'"
          :icon="item.logo"
          @click="handleClickMenu(item)"
        >
          {{ item.name }}
        </MenuItem>
      </Menu>
    </template>
  </Dropdown>
</template>
<script lang="ts" setup>
  import { Dropdown, Menu, Space } from 'ant-design-vue';
  import { Icon } from '@/components/Icon';
  import { useBrandStore } from '@/store/modules/brand';
  import { onMounted } from 'vue';
  import { PmCompany } from '@/ApiModel/company/company';

  const MenuItem = Menu.Item;

  const brandStore = useBrandStore();

  onMounted(() => {
    brandStore.setBrandList(0);
  });

  const handleClickMenu = (item: PmCompany) => {
    brandStore.setBrand(item.id, item.name);
  };
</script>
