<template>
  <ConfigProvider :locale="zhCN">
    <Modal
      v-model:open="open"
      :destroyOnClose="true"
      :width="width || '1000px'"
      :footer="null"
      :closable="false"
    >
      <div class="pt-1 min-h-475px">
        <Tabs type="card" tabPosition="top">
          <template v-for="item in attrOptions" :key="item.label + item.value">
            <Tabs.TabPane :tab="item.label">
              <Chart
                :attributes="attributes"
                :selectAttr="item.value ?? undefined"
                :date="date"
                :equipmentIds="equipmentIds"
                :attributeType="getAttributesType(item.value as any)"
              />
            </Tabs.TabPane>
          </template>
          <template #rightExtra>
            <div class="flex justify-center items-center">
              <DayPicker v-model:="date" />
              <Icon
                icon="ant-design:close-outlined"
                :size="20"
                :onClick="() => (open = false)"
                class="mx-3 cursor-pointer"
              />
            </div>
          </template>
          <template #leftExtra>
            <div class="px-4">{{ title }}</div>
          </template>
        </Tabs>
      </div>
    </Modal>
  </ConfigProvider>
</template>

<script setup lang="ts">
  import { ref, watchEffect } from 'vue';
  import { Modal, Tabs, ConfigProvider } from 'ant-design-vue';
  import { Icon } from '@/components/Icon';
  import { DayPicker } from '@/components/DatePicker';
  import { getEquipmentAttributes } from '@/api/equipment';
  import { DefaultOptionType } from 'ant-design-vue/lib/select';
  import Chart from './src/Chart.vue';
  import { EquipmentAttributeResult } from '@/api/model/equipmentModel';
  import { useFormat } from '@/utils/format';
  import zhCN from 'ant-design-vue/es/locale/zh_CN';
  import 'dayjs/locale/zh-cn';

  const props = withDefaults(
    defineProps<{
      title: string;
      equipmentIds: number[];
      width?: string;
    }>(),
    {
      title: '设备统计',
      equipmentIds: () => [],
    },
  );

  const open = ref<boolean>(true);
  const date = ref();

  const attrOptions = ref<DefaultOptionType[]>([]);
  const attributes = ref<EquipmentAttributeResult[]>([]);

  const { formatAttribute } = useFormat();
  const groupAttrs: string[] = ['ELECTRIC', 'WORKING_HOURS'];
  const createAttrOptions = async (id: number) => {
    const attrs = await getEquipmentAttributes(id);
    attributes.value = attrs;
    attrOptions.value = attrs.map((item) => {
      return {
        label: formatAttribute(item.attributeType, item.sensor),
        value: item.id,
      };
    });
    if (attrs.findIndex((item) => item.attributeType === 'ELECTRIC') > -1) {
      attrOptions.value.splice(0, 0, {
        label: '总能耗',
        value: 'total',
      });
    }
  };

  const getAttributesType = (select?: number | 'total' | string) => {
    if (typeof select === 'number') return;
    if (select === 'total') return;
    return select;
  };

  watchEffect(() => {
    if (open.value) {
      if (props.equipmentIds.length === 1) createAttrOptions(props.equipmentIds[0]);
      else {
        attrOptions.value = groupAttrs.map((key) => {
          return {
            label: formatAttribute(key),
            value: key,
          };
        });
      }
    }
  });
</script>

<style scoped></style>
