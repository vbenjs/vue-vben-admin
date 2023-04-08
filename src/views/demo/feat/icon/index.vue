<template>
  <PageWrapper title="Icon组件示例">
    <CollapseContainer title="Antv Icon使用 (直接按需引入相应组件即可)">
      <div class="flex justify-around">
        <GithubFilled :style="{ fontSize: '30px' }" />
        <QqCircleFilled :style="{ fontSize: '30px' }" />
        <WechatFilled :style="{ fontSize: '30px' }" />
        <AlipayCircleFilled :style="{ fontSize: '30px' }" />
        <IeCircleFilled :style="{ fontSize: '30px' }" />
        <TaobaoCircleFilled :style="{ fontSize: '30px' }" />
        <CodepenCircleFilled :style="{ fontSize: '30px' }" />
      </div>
    </CollapseContainer>

    <CollapseContainer title="IconIfy 组件使用" class="my-5">
      <div class="flex justify-around flex-wrap">
        <VbenIcon icon="ion:layers-outline" :size="30" />
        <VbenIcon icon="ion:bar-chart-outline" :size="30" />
        <VbenIcon icon="ion:tv-outline" :size="30" />
        <VbenIcon icon="ion:settings-outline" :size="30" />
      </div>
    </CollapseContainer>

    <CollapseContainer title="svg 雪碧图" class="my-5">
      <div class="flex justify-around flex-wrap">
        <VbenSvgIcon icon="test" :size="32" />
        <template v-for="item in 6" :key="item">
          <VbenSvgIcon :icon="`dynamic-avatar-${item}`" :size="32" />
        </template>
      </div>
    </CollapseContainer>

    <CollapseContainer title="图标选择器(Iconify)" class="my-5">
      <div class="flex justify-around flex-wrap">
        <IconPicker />
      </div>
    </CollapseContainer>

    <CollapseContainer title="图标选择器(Svg)" class="my-5">
      <div class="flex justify-around flex-wrap">
        <IconPicker mode="svg" />
      </div>
    </CollapseContainer>

    <Alert
      show-icon
      message="推荐使用Iconify组件"
      description="Icon组件基本包含所有的图标,在下面网址内你可以查询到你想要的任何图标。并且打包只会打包所用到的图标。"
    />
    <a-button type="link" @click="toIconify"> Iconify 图标大全 </a-button>
  </PageWrapper>
</template>
<script lang="ts">
  import {
    AlipayCircleFilled,
    CodepenCircleFilled,
    GithubFilled,
    IeCircleFilled,
    QqCircleFilled,
    TaobaoCircleFilled,
    VbenIcon,
    VbenSvgIcon,
    WechatFilled,
  } from '@vben/icons';
  import { Alert } from 'ant-design-vue';
  import { defineComponent } from 'vue';

  import { CollapseContainer } from '@/components/Container/index';
  import { IconPicker } from '@/components/Icon/index';
  import { PageWrapper } from '@/components/Page';
  import { openWindow } from '@/utils';

  export default defineComponent({
    components: {
      PageWrapper,
      CollapseContainer,
      GithubFilled,
      QqCircleFilled,
      WechatFilled,
      AlipayCircleFilled,
      IeCircleFilled,
      TaobaoCircleFilled,
      CodepenCircleFilled,
      VbenIcon,
      Alert,
      IconPicker,
      VbenSvgIcon,
    },
    setup() {
      return {
        toIconify: () => {
          openWindow('https://iconify.design/');
        },
      };
    },
  });
</script>
