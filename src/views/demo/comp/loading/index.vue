<template>
  <PageWrapper v-loading="loadingRef" loading-tip="加载中..." title="Loading组件示例">
    <div ref="wrapEl">
      <Alert message="组件方式" />
      <a-button class="my-4 mr-4" type="primary" @click="openCompFullLoading">
        全屏 Loading
      </a-button>
      <a-button class="my-4" type="primary" @click="openCompAbsolute"> 容器内 Loading </a-button>
      <Loading
        :loading="compState.loading"
        :absolute="compState.absolute"
        :theme="compState.theme"
        :background="compState.background"
        :tip="compState.tip"
      />

      <Alert message="函数方式" />

      <a-button class="my-4 mr-4" type="primary" @click="openFnFullLoading">
        全屏 Loading
      </a-button>
      <a-button class="my-4" type="primary" @click="openFnWrapLoading"> 容器内 Loading </a-button>

      <Alert message="指令方式" />
      <a-button class="my-4 mr-4" type="primary" @click="openDirectiveLoading">
        打开指令Loading
      </a-button>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { Loading, useLoading } from '@/components/Loading';
  import { PageWrapper } from '@/components/Page';
  import { Alert } from 'ant-design-vue';

  const wrapEl = ref<ElRef>(null);

  const loadingRef = ref(false);
  const compState = reactive<{
    absolute?: boolean;
    loading?: boolean;
    theme?: 'dark' | 'light';
    background?: string;
    tip?: string;
  }>({
    absolute: false,
    loading: false,
    theme: 'dark',
    background: 'rgba(111,111,111,.7)',
    tip: '加载中...',
  });
  const [openFullLoading, closeFullLoading] = useLoading({
    tip: '加载中...',
  });

  const [openWrapLoading, closeWrapLoading] = useLoading({
    target: wrapEl,
    props: {
      tip: '加载中...',
      absolute: true,
    },
  });

  function openLoading(absolute: boolean) {
    compState.absolute = absolute;
    compState.loading = true;
    setTimeout(() => {
      compState.loading = false;
    }, 2000);
  }

  function openCompFullLoading() {
    openLoading(false);
  }

  function openCompAbsolute() {
    openLoading(true);
  }

  function openFnFullLoading() {
    openFullLoading();

    setTimeout(() => {
      closeFullLoading();
    }, 2000);
  }

  function openFnWrapLoading() {
    openWrapLoading();

    setTimeout(() => {
      closeWrapLoading();
    }, 2000);
  }

  function openDirectiveLoading() {
    loadingRef.value = true;
    setTimeout(() => {
      loadingRef.value = false;
    }, 2000);
  }
</script>
