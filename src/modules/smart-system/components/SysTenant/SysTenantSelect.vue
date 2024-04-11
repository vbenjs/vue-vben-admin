<template>
  <a-select v-bind="$attrs" :options="computedOptions" />
</template>

<script setup lang="ts">
  import { computed, ref, unref, watch } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useUserStore } from '@/store/modules/user';
  import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

  let dataLoaded = false;
  const { getIsPlatformTenant } = storeToRefs(useUserStore());

  const dataListRef = ref<Recordable[]>([]);
  const computedOptions = computed(() => {
    if (!unref(getIsPlatformTenant)) {
      return [];
    }
    return unref(dataListRef).map((item) => {
      return {
        label: item.tenantShortName || item.tenantName,
        value: item.id,
      };
    });
  });

  const loadTenantData = async () => {
    dataListRef.value = await defHttp.post({
      service: ApiServiceEnum.SMART_SYSTEM,
      url: 'sys/tenant/manager/listTenantNoAuth',
    });
    dataLoaded = true;
  };

  watch(
    getIsPlatformTenant,
    (value) => {
      if (value && !dataLoaded) {
        loadTenantData();
      }
    },
    { immediate: true },
  );
</script>

<style scoped lang="less"></style>
