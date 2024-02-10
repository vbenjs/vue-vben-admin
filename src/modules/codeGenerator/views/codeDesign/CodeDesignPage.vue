<template>
  <div class="full-height page-container">
    <div class="spin">
      <div class="form-container">
        <a-spin :spinning="pageLoading">
          <BasicForm @register="registerForm" :size="getFormSize">
            <template #addEditForm-connectionId="{ model }">
              <DatabaseSelect
                v-model:value="model.connectionId"
                :parameter="getDatabaseListParameter"
              />
            </template>
            <template #addEditForm-RelateTable="{ model }">
              <a-tag
                v-for="(table, index) in model.addendumTableList"
                :key="index"
                style="display: inline-block"
                @close="() => handleRemoveRelateTable(model.addendumTableList, index)"
                closable
              >
                {{ table.configName }}
              </a-tag>
              <Icon
                icon="ant-design:plus-outlined"
                :style="{ cursor: 'pointer' }"
                @click="() => openPageAddendumTableChoseModal(true, {})"
              />
              <PageAddendumTableChoseModal
                :select-table-list="model.relatedTableList"
                @ok="handleSetAddendumTable"
                @register="registerPageAddendumTableChoseModal"
              />
            </template>
            <template #addEditForm-syncTable>
              <a-button type="primary" :size="getButtonSize" @click="handleSyncTableData">
                {{ $t('generator.views.code.button.syncTableData') }}
              </a-button>
            </template>
          </BasicForm>
          <a-divider />
          <a-tabs style="min-height: 400px" animated>
            <a-tab-pane key="1" :tab="$t('generator.views.code.title.dbMessage')">
              <TableFieldTable
                class="full-height"
                :data="computedTableData"
                :loading="dbDataLoading"
              />
            </a-tab-pane>
            <a-tab-pane key="2" :tab="$t('generator.views.code.title.tableSetting')">
              <PageTableSetting
                ref="pageTableSettingRef"
                :edit-data="editConfigData.codePageConfigList"
                :table-data="computedTableData"
                :loading="dbDataLoading"
              />
            </a-tab-pane>
            <a-tab-pane key="3" :tab="$t('generator.views.code.title.formSetting')">
              <PageFormSetting
                ref="pageFormSettingRef"
                :edit-data="editConfigData.codeFormConfigList"
                :table-data="computedTableData"
                :loading="dbDataLoading"
              />
            </a-tab-pane>
            <a-tab-pane key="4" :tab="$t('generator.views.code.title.searchSetting')">
              <PageSearchSetting
                ref="pageSearchSettingRef"
                :edit-data="editConfigData.codeSearchConfigList"
                :table-data="computedTableData"
                :loading="dbDataLoading"
              />
            </a-tab-pane>
          </a-tabs>
        </a-spin>
      </div>
      <a-divider />
      <div style="text-align: right">
        <a-button @click="loadConfigData">
          {{ $t('common.button.reload') }}
        </a-button>
        <a-button
          style="margin-left: 5px"
          :loading="saveLoading"
          v-permission="'db:codeConfig:save'"
          @click="handleSave"
          type="primary"
        >
          {{ $t('common.button.save') }}
        </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, onMounted } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useRouter, useRoute } from 'vue-router';

  import { BasicForm, useForm } from '@/components/Form';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { formSchemas } from './CodeDesignPage.config';
  import { getConfigByIdApi } from './CodeDesignPage.api';
  import { isString } from '@/utils/is';
  import { toNumber } from 'lodash-es';
  import { propTypes } from '@/utils/propTypes';
  import { useModal } from '@/components/Modal';

  import { useLoadDbData, useSaveConfig } from './CodeDesignPageHook';

  import DatabaseSelect from './componenets/DatabaseSelect/DatabaseSelect.vue';
  import TableFieldTable from './componenets/TableFieldTable/TableFieldTable.vue';
  import PageTableSetting from './componenets/PageTableSetting/PageTableSetting.vue';
  import PageFormSetting from './componenets/PageFromSetting/PageFormSetting.vue';
  import PageSearchSetting from './componenets/PageSearchSetting/PageSearchSetting.vue';
  import Icon from '@/components/Icon/src/Icon.vue';
  import PageAddendumTableChoseModal from './componenets/PageAddendumTableChoseModal.vue';

  const props = defineProps({
    configId: propTypes.oneOfType([propTypes.string, propTypes.number]),
    // 系统ID
    systemId: propTypes.oneOfType([propTypes.string, propTypes.number]),
  });
  const { t } = useI18n();
  const router = useRouter();
  const route = useRoute();
  const { getFormSize, getButtonSize } = useSizeSetting();

  const pageLoading = ref(false);

  const getDatabaseListParameter = () => {
    return {
      parameter: {
        'systemId@=': props.systemId,
      },
    };
  };

  /**
   * 代码配置页面
   */
  const [registerForm, { validate, setFieldsValue }] = useForm({
    colon: true,
    schemas: formSchemas(t),
    showActionButtonGroup: false,
    baseColProps: {
      span: 6,
    },
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 15,
    },
  });

  const handleSetAddendumTable = (tableData) => {
    setFieldsValue({ addendumTableList: tableData });
  };

  const loadConfigData = async () => {
    try {
      pageLoading.value = true;
      let configId = props.configId;
      if (!configId) {
        return;
      }
      if (isString(configId)) {
        configId = toNumber(configId);
      }
      const result = await getConfigByIdApi(configId);
      await setFieldsValue(result);
      // 加载表格数据
      handleSyncTableData();
      const { codePageConfigList, codeFormConfigList, codeSearchConfigList } = result;
      editConfigData.value = {
        codePageConfigList,
        codeFormConfigList,
        codeSearchConfigList,
      };
    } finally {
      pageLoading.value = false;
    }
  };

  onMounted(() => {
    /**
     * 监控configId变化，更新数据
     */
    watch(
      () => props.configId,
      async (value) => {
        if (value) {
          loadConfigData();
        } else {
          setFieldsValue({
            systemId: props.systemId,
          });
        }
      },
      {
        immediate: true,
      },
    );
  });

  const { dbDataLoading, computedTableData, handleSyncTableData, isSyncRef, dbDataRef } =
    useLoadDbData(validate);
  const editConfigData = ref<any>({});

  const handleRemoveRelateTable = (dataList: any[], index: number) => {
    dataList.splice(index, 1);
  };
  const [registerPageAddendumTableChoseModal, { openModal: openPageAddendumTableChoseModal }] =
    useModal();

  const { handleSave, saveLoading, pageTableSettingRef, pageSearchSettingRef, pageFormSettingRef } =
    useSaveConfig(t, isSyncRef, validate, dbDataRef, (configId) => {
      const { fullPath, query, path } = route;
      console.log(fullPath);
      router.push({
        path: path,
        query: {
          ...query,
          configId,
        },
      });
    });
</script>

<style scoped lang="less">
  .page-container {
    padding: 10px;

    :deep(.ant-divider) {
      margin: 5px 0;
    }

    .spin {
      height: 100%;
      padding: 10px;
      background: white;
    }

    .form-container {
      height: calc(100% - 42px);
      overflow: auto;
    }
  }
</style>
