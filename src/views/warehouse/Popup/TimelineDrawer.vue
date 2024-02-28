<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    :width="350"
    destroyOnClose
  >
    <div class="mb-4 flex items-center">
      <Icon icon="carbon:barcode" size="18" class="mr-2" />
      <span>{{ barcode }}</span>
    </div>

    <Timeline>
      <Timeline.Item v-for="item in timeLine">
        <div class="text-[#333333]">
          <span>{{ item.title }}</span>
          <span class="mx-3">{{ item.operator }}</span>
          <span>{{ item.source }}</span>
        </div>
        <div v-if="item.billCode" class="text-[#333333]">单据编号：{{ item.billCode }}</div>
        <div class="text-[#999999]">{{ item.time }}</div>
      </Timeline.Item>
    </Timeline>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { useDrawerInner, BasicDrawer } from '@/components/Drawer';

  import { Icon } from '@/components/Icon';
  import { Timeline } from 'ant-design-vue';
  import { getProductTimeLine } from '@/api/warehouse/product';
  import { TimeLine } from '@/ApiModel/warehouse/product';
  import { ref } from 'vue';

  const timeLine = ref<TimeLine[]>([]);
  const barcode = ref<string>('');

  const [registerDrawer, { setDrawerProps, changeLoading }] = useDrawerInner(async (code) => {
    try {
      changeLoading(true);
      setDrawerProps({ confirmLoading: false });
      barcode.value = code;
      const data = await getProductTimeLine(code);
      timeLine.value = data;
    } finally {
      changeLoading(false);
    }
  });

  const getTitle = '查看' + '时间轴';
</script>
