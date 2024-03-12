<template>
  <a-form
    ref="formRef"
    class="create-code-form"
    :model="formModel"
    :rules="rules"
    :wrapper-col="wrapperCol"
    :label-col="labelCol"
  >
    <a-form-item :label="$t('generator.views.codeCreateForm.title.description')">
      <a-input v-model:value="formModel.description" />
    </a-form-item>
    <a-form-item :label="$t('generator.views.codeCreateForm.title.tableName')">
      <a-input v-model:value="formModel.tableName" disabled />
    </a-form-item>
    <a-form-item name="className" :label="$t('generator.views.codeCreateForm.title.className')">
      <a-input v-model:value="formModel.className" />
    </a-form-item>
    <a-form-item name="packages" :label="$t('generator.views.codeCreateForm.title.packages')">
      <a-input v-model:value="formModel.packages" />
    </a-form-item>
    <a-form-item :label="$t('generator.views.codeCreateForm.title.extPackages')">
      <a-input v-model:value="formModel.extPackages" />
    </a-form-item>
    <a-form-item :label="$t('generator.views.codeCreateForm.title.controllerBasePath')">
      <a-input v-model:value="formModel.controllerBasePath" />
    </a-form-item>
    <div>
      <a-transfer
        :target-keys="targetKeysModel"
        :render="(item) => item.title"
        :data-source="transDataSource"
        show-search
        @change="handleTransChange"
      />
    </div>
  </a-form>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs, watch, ref, onMounted, type PropType } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { message } from 'ant-design-vue';

  import { TemplateType } from '@/modules/smart-code/constants/DatabaseConstants';

  import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

  const modelData = {
    description: '',
    packages: '',
    tableName: '',
    className: '',
    controllerBasePath: '',
    extPackages: '',
  };

  /**
   * 代码生成form
   */
  export default defineComponent({
    name: 'CodeCreateForm',
    props: {
      codeData: {
        type: Object as PropType<any>,
        default: () => ({}) as any,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { codeData } = toRefs(props);
      const formRef = ref();
      const formModel = reactive(modelData);
      const transDataSource = ref([]);
      const dataLoading = ref(false);
      const targetKeysModel = ref<Array<string>>([]);
      watch(codeData, () => {
        formModel.description = codeData.value.remarks;
        formModel.tableName = codeData.value.tableName;
        formModel.className = codeData.value.className;
        targetKeysModel.value = [];
      });
      const loadTemplateData = async () => {
        dataLoading.value = true;
        try {
          const result = await defHttp.post({
            service: ApiServiceEnum.SMART_CODE,
            url: 'db/code/template/list',
            data: {
              parameter: {
                'templateType@=': TemplateType.TEMPLATE_CODE.value,
              },
            },
          });
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
      const handleTransChange = (targetKeys: Array<string>) => {
        targetKeysModel.value = targetKeys;
      };
      onMounted(loadTemplateData);
      /**
       * 获取form的值
       */
      const getFormData = () => {
        return {
          mainId: codeData.value.id,
          ...formModel,
          templateIdList: targetKeysModel.value,
        };
      };
      /**
       * 验证表单
       */
      const validate = (): Promise<any> => {
        return formRef.value.validate().then(() => {
          if (targetKeysModel.value.length === 0) {
            const errorMessage = t('generator.views.codeCreateForm.message.choseTemplate');
            message.error(errorMessage);
            return Promise.reject(new Error(errorMessage));
          }
        });
      };
      return {
        formModel,
        transDataSource,
        dataLoading,
        handleTransChange,
        targetKeysModel,
        getFormData,
        formRef,
        validate,
      };
    },
    data() {
      return {
        labelCol: {
          span: 6,
        },
        wrapperCol: {
          span: 17,
        },
        rules: {
          packages: [
            {
              required: true,
              message: this.$t('generator.views.codeCreateForm.validate.packages'),
              trigger: 'blur',
            },
          ],
          className: [
            {
              required: true,
              message: this.$t('generator.views.codeCreateForm.validate.className'),
              trigger: 'blur',
            },
          ],
          controllerBasePath: [
            {
              required: true,
              message: this.$t('generator.views.codeCreateForm.validate.controllerBasePath'),
              trigger: 'blur',
            },
          ],
        },
      };
    },
  });
</script>

<style lang="less" scoped>
  .create-code-form {
    ::v-deep(.ant-transfer-list) {
      flex: none;
      width: 46%;
      height: 450px;
    }
  }
</style>
