<template>
  <BasicModal @register="registerModal" :title="$t('common.title.details')" width="1000px">
    <template #footer>
      <a-button type="primary" @click="closeModal">
        {{ $t('common.title.close') }}
      </a-button>
    </template>
    <Descriptions bordered>
      <DescriptionsItem
        :labelStyle="firstLabelStyle"
        :label="$t('system.views.log.title.operationType')"
      >
        {{ detailsData.operationType }}
      </DescriptionsItem>
      <DescriptionsItem :label="$t('system.views.log.title.requestPath')">
        {{ detailsData.requestPath }}
      </DescriptionsItem>
      <DescriptionsItem :label="$t('system.views.log.title.statusCode')">
        <a-tag
          :color="
            detailsData.statusCode >= 200 && detailsData.statusCode < 300 ? '#2db7f5' : '#f50'
          "
        >
          {{ detailsData.statusCode }}
        </a-tag>
      </DescriptionsItem>

      <DescriptionsItem :label="$t('system.views.log.title.operation')" :span="2">
        {{ detailsData.operation }}
      </DescriptionsItem>
      <DescriptionsItem :label="$t('system.views.log.title.logSource')">
        {{ detailsData.logSource }}
      </DescriptionsItem>

      <DescriptionsItem :label="$t('system.views.log.title.createTime')" :span="2">
        {{ detailsData.createTime }}
      </DescriptionsItem>
      <DescriptionsItem :label="$t('system.views.log.title.ip')">
        {{ detailsData.ip }}
      </DescriptionsItem>

      <DescriptionsItem :label="$t('system.views.log.title.method')" :span="2">
        {{ detailsData.method }}
      </DescriptionsItem>
      <DescriptionsItem :label="$t('system.views.log.title.useTime')">
        {{ detailsData.useTime }}
      </DescriptionsItem>

      <DescriptionsItem :label="$t('system.views.log.title.params')" :span="3">
        {{ detailsData.params }}
      </DescriptionsItem>

      <DescriptionsItem :label="$t('system.views.log.title.result')" :span="3">
        {{ detailsData.result }}
      </DescriptionsItem>
      <DescriptionsItem :label="$t('system.views.log.title.errorMessage')" :span="3">
        {{ detailsData.errorMessage }}
      </DescriptionsItem>
    </Descriptions>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useModalInner, BasicModal } from '@/components/Modal';
  import { Descriptions, DescriptionsItem } from 'ant-design-vue';

  import { getByIdApi } from '../SystemLogComponent.api';

  const firstLabelStyle = {
    width: '120px',
  };

  const detailsData = ref<Recordable>({});
  const [registerModal, { changeLoading, closeModal }] = useModalInner(async (id) => {
    detailsData.value = {};
    try {
      changeLoading(true);
      detailsData.value = await getByIdApi(id);
    } finally {
      changeLoading(false);
    }
  });
</script>

<style scoped></style>
