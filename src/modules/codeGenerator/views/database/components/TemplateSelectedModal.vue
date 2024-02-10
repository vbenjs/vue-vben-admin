<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    @ok="handleCreate"
    :width="600"
    :title="$t('generator.views.database.common.chooseTemplate')"
  >
    <a-transfer
      class="db-template-selected"
      :data-source="transDataSource"
      :target-keys="targetKeysModel"
      show-search
      :render="(item: any) => item.title"
      @change="handleTransChange"
    />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { PropType, ref, unref } from 'vue';

  import BasicModal from '@/components/Modal/src/BasicModal.vue';
  import { listTemplate, getCreateDicUrl } from '../DatabaseListView.api';
  import { useModalInner } from '@/components/Modal';
  import { message } from 'ant-design-vue';
  import { applyTempToken } from '@/utils/auth';
  import { useMessage } from '@/hooks/web/useMessage';
  import { Result } from '/#/axios';
  import { useI18n } from '@/hooks/web/useI18n';

  const props = defineProps({
    templateType: String as PropType<string>,
  });

  const { t } = useI18n();

  const currentRow = ref<any>(null);

  const [registerModal, { closeModal }] = useModalInner((data) => {
    targetKeysModel.value = [];
    currentRow.value = data;
    loadData();
  });

  const transDataSource = ref([]);
  const targetKeysModel = ref<Array<string>>([]);
  const dataLoading = ref(false);

  const loadData = async () => {
    dataLoading.value = true;
    targetKeysModel.value = [];
    try {
      const result = await listTemplate(props.templateType);
      transDataSource.value = result.map((item: any) => {
        return {
          key: item.templateId + '',
          title: item.name,
        };
      });
    } finally {
      dataLoading.value = false;
    }
  };
  const handleCreate = async () => {
    const selectTemplateIdList = unref(targetKeysModel);
    if (selectTemplateIdList.length === 0) {
      message.error(t('generator.views.database.validate.template'));
      return false;
    }
    try {
      const tempToken = await applyTempToken('db:connection:createDic', false);
      selectTemplateIdList.forEach((templateId) => {
        const url = getCreateDicUrl({ row: unref(currentRow), templateId, tempToken });
        window.open(url);
      });
      closeModal();
    } catch (e) {
      const { errorMessage } = useMessage();
      errorMessage(e as Result);
    }
  };

  const handleTransChange = (targetKeys: Array<string>) => {
    targetKeysModel.value = targetKeys;
  };
</script>

<style scoped lang="less">
  .db-template-selected {
    :deep(.ant-transfer-list) {
      flex: none;
      width: 46%;
      height: 450px;
    }
  }
</style>
