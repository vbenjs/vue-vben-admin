<template>
  <BasicModal
    @register="registerModal"
    width="800px"
    @ok="handleOk"
    style="top: 15px"
    :title="$t('generator.views.code.button.createCode')"
  >
    <BasicForm @register="registerForm">
      <template #form-templateIdList="{ model }">
        <SmartTableSelect
          v-model:value="model.templateIdList"
          :table-props="{}"
          title="选择模板"
          defaultFullscreen
          multiple
          :list-api="listByIdApi"
          label-field="name"
          value-field="templateId"
        >
          <template #table="{ addSelectData, removeSelectData, selectData }">
            <TemplateSelectTable
              :add-select-data="addSelectData"
              :remove-select-data="removeSelectData"
              :select-data="selectData"
            />
          </template>
        </SmartTableSelect>
      </template>
    </BasicForm>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { useI18n } from '@/hooks/web/useI18n';
  import { useRouter } from 'vue-router';
  import { message } from 'ant-design-vue';
  import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicForm, useForm, SmartTableSelect } from '@/components/Form';
  import TemplateSelectTable from './TemplateSelectTable.vue';

  const router = useRouter();
  const { t } = useI18n();

  const handleOk = async () => {
    const model = await validate();
    const templateIdList = model.templateIdList;
    if (!templateIdList || templateIdList.length === 0) {
      message.warn(t('generator.views.codeCreateForm.message.choseTemplate'));
    }
    const url = router.resolve({
      path: '/codeCreateView',
      query: {
        ...model,
        templateIdList: templateIdList.join(','),
      },
    });
    window.open(url.href, '_blank');
  };

  const [registerModal] = useModalInner((codeConfigData: Recordable) => {
    const { remarks, tableName, className, id } = codeConfigData;
    setFieldsValue({
      description: remarks,
      tableName,
      className,
      mainId: id,
    });
  });

  const listByIdApi = (ids) => {
    return defHttp.post({
      service: ApiServiceEnum.SMART_CODE,
      url: 'db/code/template/listById',
      data: ids,
    });
  };

  const [registerForm, { setFieldsValue, validate }] = useForm({
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 17,
    },
    baseColProps: {
      span: 24,
    },
    showActionButtonGroup: false,
    schemas: [
      {
        label: '',
        field: 'mainId',
        component: 'Input',
        show: false,
      },
      {
        label: t('generator.views.codeCreateForm.title.description'),
        field: 'description',
        component: 'Input',
      },
      {
        label: t('generator.views.codeCreateForm.title.tableName'),
        field: 'tableName',
        component: 'Input',
        componentProps: {
          disabled: true,
        },
      },
      {
        label: t('generator.views.codeCreateForm.title.className'),
        field: 'className',
        component: 'Input',
        required: true,
      },
      {
        label: t('generator.views.codeCreateForm.title.packages'),
        field: 'packages',
        component: 'Input',
        required: true,
      },
      {
        label: t('generator.views.codeCreateForm.title.controllerBasePath'),
        field: 'controllerBasePath',
        component: 'Input',
        required: true,
      },
      {
        label: t('generator.views.codeCreateForm.title.customConfig'),
        field: 'customConfig',
        component: 'InputTextArea',
        componentProps: {
          placeholder: t('generator.views.codeCreateForm.message.customConfig'),
        },
      },
      {
        label: t('generator.views.codeCreateForm.title.templateList'),
        field: 'templateIdList',
        slot: 'form-templateIdList',
      },
    ],
  });
</script>

<style scoped></style>
