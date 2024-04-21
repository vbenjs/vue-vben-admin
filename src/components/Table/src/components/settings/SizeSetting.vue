<template>
  <Tooltip placement="top">
    <template #title>
      <span>{{ t('component.table.settingDens') }}</span>
    </template>

    <Dropdown placement="bottom" :trigger="['click']" :getPopupContainer="getPopupContainer">
      <ColumnHeightOutlined />
      <template #overlay>
        <Menu @click="handleTitleClick" selectable v-model:selectedKeys="selectedKeysRef">
          <Menu.Item key="default">
            <span>{{ t('component.table.settingDensDefault') }}</span>
          </Menu.Item>
          <Menu.Item key="middle">
            <span>{{ t('component.table.settingDensMiddle') }}</span>
          </Menu.Item>
          <Menu.Item key="small">
            <span>{{ t('component.table.settingDensSmall') }}</span>
          </Menu.Item>
        </Menu>
      </template>
    </Dropdown>
  </Tooltip>
</template>
<script lang="ts" setup>
  import type { SizeType } from '../../types/table';
  import { ref, onMounted } from 'vue';
  import { Tooltip, Dropdown, Menu, type MenuProps } from 'ant-design-vue';
  import { ColumnHeightOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useTableContext } from '../../hooks/useTableContext';
  import { getPopupContainer } from '@/utils';

  import { useTableSettingStore } from '@/store/modules/tableSetting';

  const tableSettingStore = useTableSettingStore();

  defineOptions({ name: 'SizeSetting' });

  const table = useTableContext();
  const { t } = useI18n();

  const selectedKeysRef = ref<SizeType[]>([table.getSize()]);

  const handleTitleClick: MenuProps['onClick'] = ({ key }) => {
    selectedKeysRef.value = [key as SizeType];

    tableSettingStore.setTableSize(key as SizeType);

    table.setProps({
      size: key as SizeType,
    });
  };

  onMounted(() => {
    selectedKeysRef.value = [tableSettingStore.getTableSize];
    table.setProps({
      size: selectedKeysRef.value[0],
    });
  });
</script>
