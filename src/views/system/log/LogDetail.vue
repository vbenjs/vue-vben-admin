<script lang="ts" setup>
  import { ref, unref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';

  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';

  import { Divider } from 'ant-design-vue';

  import { PageWrapper } from '/@/components/Page';
  import { Description } from '/@/components/Description';

  import { loadLog } from '/@/apis/logs';

  import { logDetailSchema, requestSchema } from './log.data';

  const route = useRoute();
  const go = useGo();
  const logId = ref<number>(Number(route.params?.id));

  const { setTitle } = useTabs();
  setTitle('详情：日志' + logId.value);

  const log = ref<Object>({});
  onMounted(async () => {
    log.value = await loadLog(unref(logId));
  });

  function goBack() {
    go('/system/log');
  }
</script>
<template>
  <PageWrapper :title="`日志` + logId + `的详情`" contentBackground @back="goBack">
    <description
      size="middle"
      title="基础信息"
      :bordered="false"
      :column="2"
      :data="log"
      :schema="logDetailSchema"
    />
    <divider />
    <description
      size="middle"
      title="请求信息"
      :bordered="false"
      :column="2"
      :data="log"
      :schema="requestSchema"
    />
    <divider />
  </PageWrapper>
</template>
