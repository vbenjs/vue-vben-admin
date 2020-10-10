<template>
  <div class="p-4">
    <Alert message="抽取el-scrollbar，并对其进行扩展,滚动条美化,适用于各个浏览器" type="info" />

    <div class="my-4">
      <a-button @click="scrollTo(100)" class="mr-2">滚动到100px位置</a-button>
      <a-button @click="scrollTo(800)" class="mr-2">滚动到800px位置</a-button>
      <a-button @click="scrollTo(0)" class="mr-2">滚动到顶部</a-button>
      <a-button @click="scrollBottom()" class="mr-2">滚动到底部</a-button>
    </div>
    <div class="scroll-wrap">
      <ScrollContainer class="mt-4" ref="scrollRef">
        <ul class="p-3">
          <template v-for="index in 100" :key="index">
            <li class="p-2" :style="{ border: '1px solid #eee' }">{{ index }}</li>
          </template>
        </ul>
      </ScrollContainer>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { CollapseContainer } from '/@/components/Container/index';
  import { ScrollContainer, ScrollActionType } from '/@/components/Container/index';
  import { Alert } from 'ant-design-vue';
  export default defineComponent({
    components: { CollapseContainer, ScrollContainer, Alert },
    setup() {
      const scrollRef = ref<Nullable<ScrollActionType>>(null);
      const getScroll = () => {
        const scroll = unref(scrollRef);
        if (!scroll) {
          throw new Error('scroll is Null');
        }
        return scroll;
      };

      function scrollTo(top: number) {
        getScroll().scrollTo(top);
      }
      function scrollBottom() {
        getScroll().scrollBottom();
      }
      return {
        scrollTo,
        scrollRef,
        scrollBottom,
      };
    },
  });
</script>
<style lang="less" scoped>
  .scroll-wrap {
    width: 50%;
    height: 300px;
    background: #fff;
  }
</style>
