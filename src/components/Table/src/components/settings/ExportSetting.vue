<template>
  <Tooltip placement="top" title="导出" class="anticon">
    <Icon icon="file-icons:microsoft-excel" @click="showModal = true" />
    <BasicModal
      v-bind="$attrs"
      :title="t('component.excel.exportModalTitle')"
      @ok="handleOk"
      @register="registerModal"
      @cancel="resetAllFields"
      v-model:visible="showModal"
    >
      <BasicForm
        :labelWidth="100"
        :schemas="schemas"
        :showActionButtonGroup="false"
        @register="registerForm"
        class="w-full"
      >
        <template #columns="{ model, field }">
          <Card>
            <span>{{ model[field] }}</span>
            <CheckboxGroup v-model:value="checkedColumns">
              <Row>
                <Col :span="12" v-for="item of columnsOptions" :key="item.dataIndex">
                  <Checkbox :disabled="item.disabled" :value="item.value">{{
                    item.label
                  }}</Checkbox>
                </Col>
              </Row>
            </CheckboxGroup>
          </Card>
        </template>
      </BasicForm>
    </BasicModal>
  </Tooltip>
</template>

<script setup lang="ts">
  import { Tooltip, Checkbox, CheckboxGroup, Row, Col, Card } from 'ant-design-vue';
  import Icon from '/@/components/Icon/Icon.vue';
  import { ref, computed, watch } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useTableContext } from '../../hooks/useTableContext';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { isFunction } from '/@/utils/is';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { jsonToSheetXlsx, JsonToSheet } from '/@/components/Excel';
  import { BasicTableParams } from '/@/api/model/baseModel';
  import { saveAs } from 'file-saver';
  import { pick } from 'lodash-es';

  type Option = {
    label: string;
    value: string;
    disabled: boolean;
    checked: boolean;
  };
  /**
   * @description 1 导出 0 不导出
   */
  type exportData = '0' | '1';
  interface exportCol {
    field: string;
    title: string;
  }
  type exportModel = BasicTableParams & {
    exportCols: exportCol[];
    exportData: exportData;
  };
  const { createMessage } = useMessage();
  const table = useTableContext();
  const {
    getBindValues,
    getDataSource,
    formActions: { getFieldsValue },
  } = table;
  const { t } = useI18n();
  const columnsOptions = ref<Option[]>([]);
  const showModal = ref<boolean>(false);
  const checkedColumns = ref<string[]>([]);
  watch(
    () => getBindValues.value.columns,
    (columns) => {
      columnsOptions.value = [];
      columns.forEach((item) => {
        const disabled = !item.dataIndex || item.key === 'action';
        if (!disabled) {
          checkedColumns.value.push(item.dataIndex as string);
          columnsOptions.value.push({
            label: item.customTitle,
            value: item.dataIndex,
            disabled,
            checked: !disabled,
          } as Option);
        }
      });
    },
  );
  const title = computed(() => {
    if (isFunction(getBindValues.value.title)) {
      return getBindValues.value.title()?.props?.title;
    }
    return '';
  });
  const schemas: FormSchema[] = [
    {
      field: 'filename',
      component: 'Input',
      label: t('component.excel.fileName'),
      rules: [{ required: true }],
      componentProps: {
        addonAfter: '.xlsx',
      },
      colProps: {
        span: 20,
      },
      defaultValue: title.value,
    },
    {
      field: 'exportRange',
      component: 'Select',
      label: '选择数据',
      rules: [{ required: true }],
      componentProps: {
        options: [
          {
            label: '所有数据',
            value: '1',
          },
          {
            label: '当前页的数据',
            value: '0',
          },
        ],
      },
      defaultValue: '1',
      colProps: {
        span: 20,
      },
    },
    {
      field: 'columns',
      slot: 'columns',
      label: '选择字段',
      component: 'CheckboxGroup',
      colProps: {
        span: 20,
      },
    },
  ];

  const [registerForm, { validateFields, resetFields }] = useForm({
    schemas,
  });
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner();

  async function handleOk() {
    const exportCols = getExportCols();
    const fields = await validateFields();
    if (checkedColumns.value.length === 0) {
      createMessage.warning('请选择导出的列');
      return;
    }
    changeOkLoading(true);
    try {
      if (fields.exportRange == '1') {
        const data = await exportTabelByApi({
          exportData: '1',
          exportCols,
          ...getFieldsValue(),
          pageNumber: 1,
          pageSize: 20,
        });
        saveAs(data, fields.filename);
      } else {
        const header = {};
        exportCols.forEach((item) => {
          header[`${item.field}`] = item.title;
        });
        console.log(header, getDataSource());
        const picks = Object.keys(header);
        exportTableLocal({
          data: getDataSource().map((item) => pick(item, picks)),
          header,
          filename: fields.filename + '.xlsx',
        });
      }
      closeModal();
      changeOkLoading(false);
    } catch (error) {
      changeOkLoading(false);
    }
  }
  function getExportCols(): exportCol[] {
    const exportCols: exportCol[] = [];
    columnsOptions.value.forEach((item) => {
      if (checkedColumns.value.indexOf(item.value) >= 0) {
        exportCols.push({
          field: item.value,
          title: item.label,
        });
      }
    });
    return exportCols;
  }
  // 导出的列,
  function exportTabelByApi(params: exportModel) {
    if (!getBindValues.value.api) {
      createMessage.error('暂不支持导出全部数据');
      return Promise.reject();
    }
    return getBindValues.value.api(params);
  }

  function exportTableLocal(params: JsonToSheet) {
    jsonToSheetXlsx(params);
  }

  function resetAllFields() {
    resetFields();
    // checkedColumns.value = [];
  }
</script>

<style scoped></style>
