<!--
  设置表单验证规则
-->
<template>
  <BasicModal
    width="1000px"
    v-bind="$attrs"
    title="配置验证规则"
    @ok="handleOk"
    @register="registerModal"
    class="form-rule-set-modal"
  >
    <SmartTable @register="registerTable" :data="ruleListRef" class="form-rule-set-table">
      <template #table-options="{ row }">
        <a-button size="small" @click="() => handleDeleteRow(row)">删除</a-button>
      </template>
      <template #table-tools>
        <a-button size="small" :disabled="autoValidateRef" type="primary" @click="insertRow">
          添加一行
        </a-button>
      </template>
      <template #table-buttons>
        <a-form-item label="是否自动校验">
          <a-switch v-model:checked="autoValidateRef" />
        </a-form-item>
        <span style="margin-left: 10px">开启后，校验参数自动生成，配置的校验内容无效</span>
      </template>
    </SmartTable>
  </BasicModal>
</template>

<script lang="ts" setup>
  import type { SizeType } from 'vxe-table';

  import { ref, unref } from 'vue';
  import { useModalInner, BasicModal } from '@/components/Modal';
  import { SmartTable, useSmartTable } from '@/components/SmartTable';
  import { useI18n } from '@/hooks/web/useI18n';
  import { errorMessage } from '@/utils/message/SystemNotice';

  import { getRuleList } from '../PageSettingSupport';

  const { t } = useI18n();

  const sizeRef = ref('small');
  // 是否自动配置
  const autoValidateRef = ref(false);

  const currentDataRef = ref<any>({});
  const ruleListRef = ref<any[]>([]);

  const [registerModal, { closeModal }] = useModalInner((data) => {
    currentDataRef.value = data;
    autoValidateRef.value = data.autoValidate;
    ruleListRef.value = data.ruleList || [];
  });

  const insertRow = async () => {
    const vxeGrid = getTableInstance();
    const { row: newRow } = await vxeGrid.insertAt({}, -1);
    await vxeGrid.setActiveCell(newRow, 'ruleType');
  };

  const handleDeleteRow = (row) => {
    getTableInstance().remove(row);
  };

  const handleOk = async () => {
    const vxeTable = getTableInstance();
    const errMap = await vxeTable.fullValidate().catch((errMap) => errMap);
    if (errMap) {
      console.log(errMap);
      errorMessage('校验不通过!');
      return false;
    }
    const autoValidate = unref(autoValidateRef);
    if (autoValidate) {
      unref(currentDataRef).autoValidate = true;
      unref(currentDataRef).ruleList = [];
      closeModal();
      return;
    }
    const { tableData } = vxeTable.getTableData();
    const validateMessage = validateData(tableData);
    if (validateMessage) {
      errorMessage(validateMessage);
    }
    unref(currentDataRef).autoValidate = false;
    unref(currentDataRef).ruleList = tableData;
    closeModal();
  };

  const [registerTable, { getTableInstance }] = useSmartTable({
    border: true,
    size: unref(sizeRef) as SizeType,
    editConfig: {
      trigger: 'click',
      mode: 'row',
    },
    editRules: {
      message: [{ required: true, message: '请填写校验文案' }],
      ruleTrigger: [{ required: true, message: '请选择触发时机' }],
      ruleType: [{ required: true, message: '校验类型必须选择' }],
    },
    toolbarConfig: {
      slots: {
        tools: 'table-tools',
        buttons: 'table-buttons',
      },
    },
    columns: [
      {
        title: '校验类型',
        field: 'ruleType',
        width: 140,
        editRender: {
          name: '$select',
          options: getRuleList(t),
        },
      },
      {
        title: '触发时机',
        field: 'ruleTrigger',
        width: 150,
        editRender: {
          name: '$select',
          options: [
            {
              value: 'BLUR',
              label: 'blur',
            },
            {
              value: 'CHANGE',
              label: 'change',
            },
          ],
          props: {
            multiple: true,
          },
        },
      },
      {
        title: '长度',
        field: 'len',
        width: 120,
        editRender: {
          name: '$input',
          props: { type: 'number' },
        },
      },
      {
        title: '最大程度',
        field: 'max',
        width: 120,
        editRender: {
          name: '$input',
          props: { type: 'number' },
        },
      },
      {
        title: '最小长度',
        field: 'min',
        width: 120,
        editRender: {
          name: '$input',
          props: { type: 'number' },
        },
      },
      {
        title: '校验文案',
        field: 'message',
        minWidth: 200,
        editRender: {
          name: '$input',
        },
      },
      {
        title: '正则表达式',
        field: 'pattern',
        width: 180,
        editRender: {
          name: '$input',
        },
      },
      {
        title: '操作',
        field: 'options',
        width: 120,
        fixed: 'right',
        slots: {
          default: 'table-options',
        },
      },
    ],
  });

  /**
   * 校验数据
   */
  const validateData = (dataList: Array<any>) => {
    // 验证类型是否重复
    const hasType: Array<string> = [];
    for (const { ruleType, pattern } of dataList) {
      if (hasType.includes(ruleType)) {
        return '校验类型不可重复：' + ruleType;
      }
      hasType.push(ruleType);
      if (ruleType === 'regexp' && (pattern == null || pattern.trim() === '')) {
        return '正则类型必须设置正则表达式';
      }
    }
    return null;
  };
</script>

<style lang="less" scoped>
  .form-rule-set-table {
    :deep(.ant-form-item) {
      margin-bottom: 0;
    }
  }
</style>
