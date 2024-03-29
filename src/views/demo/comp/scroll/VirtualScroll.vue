<template>
  <PageWrapper class="virtual-scroll-demo">
    <Divider>基础滚动示例</Divider>
    <div class="text-center mb-4">
      <a-button @click="vScrollRef?.scrollToTop()">滚动到顶部</a-button>
      <a-button @click="vScrollRef?.scrollToBottom()" class="mx-2">滚动到底部</a-button>
      <a-button @click="vScrollRef?.scrollToItem(scrollToItemIndex)"
        >滚动到第
        <input-number
          v-model:value="scrollToItemIndex"
          class="!w-60px mx-1"
          :min="1"
          :max="data.length"
          :precision="0"
          size="small"
          :controls="false"
          @keydown.enter="vScrollRef?.scrollToItem(scrollToItemIndex)"
        />
        条
      </a-button>
    </div>
    <div class="virtual-scroll-demo-wrap">
      <VScroll :itemHeight="41" :items="data" :height="300" :width="300" ref="vScrollRef">
        <template #default="{ item }">
          <div class="virtual-scroll-demo__item">
            {{ item.title }}
          </div>
        </template>
      </VScroll>
    </div>

    <Divider>即使不可见，也预先加载50条数据，防止空白</Divider>
    <div class="virtual-scroll-demo-wrap">
      <VScroll :itemHeight="41" :items="data" :height="300" :width="300" :bench="50">
        <template #default="{ item }">
          <div class="virtual-scroll-demo__item">
            {{ item.title }}
          </div>
        </template>
      </VScroll>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '@/components/Page';
  import { VScroll } from '@/components/VirtualScroll';
  import { Divider, InputNumber } from 'ant-design-vue';
  import { ref } from 'vue';

  const vScrollRef = ref<typeof VScroll>();
  const scrollToItemIndex = ref(1000);

  const data = (() => {
    const arr: any[] = [];
    for (let index = 1; index < 20000; index++) {
      arr.push({
        title: '列表项' + index,
      });
    }
    return arr;
  })();
</script>
<style lang="less" scoped>
  .virtual-scroll-demo {
    &-wrap {
      display: flex;
      justify-content: center;
      margin: 0 30%;
      background-color: @component-background;
    }

    &__item {
      height: 40px;
      padding: 0 20px;
      border-bottom: 1px solid @border-color-base;
      line-height: 40px;
    }
  }
</style>
