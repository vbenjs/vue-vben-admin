<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          type="primary"
          :disabled="!hasPermission('system:task:create')"
          @click="handleCreate"
        >
          新增任务
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'ant-design:edit-outlined',
                tooltip: '编辑任务',
                disabled: !hasPermission('system:task:update'),
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '删除此任务',
                disabled: !hasPermission('system:task:delete'),
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
      <template #expandedRowRender="{ record }">
        <Descriptions :column="1">
          <Descriptions.Item label="任务编号"># {{ record.id }}</Descriptions.Item>
          <Descriptions.Item label="执行次数">
            {{ record.limit > 0 ? `仅 ${record.limit} 次` : '无次数限制' }}
          </Descriptions.Item>
          <Descriptions.Item v-if="record.type === 1" label="执行间隔">
            每{{ record.every }}毫秒执行一次
          </Descriptions.Item>
          <Descriptions.Item v-else label="Cron表达式">
            <Tooltip>
              <template #title>秒 分 小时 日期 月份 星期 年(可选)</template>
              {{ record.cron }}
            </Tooltip>
          </Descriptions.Item>
          <Descriptions.Item v-if="record.type === 0" label="执行时间段">
            <span>{{ parseExecTime(record) }}</span>
          </Descriptions.Item>
          <Descriptions.Item label="执行操作">
            <Popconfirm
              title="确认手动执行一次该任务吗?"
              :disabled="!hasPermission('system:task:once')"
              @confirm="handleOnce(record)"
            >
              <Button type="link" size="small" :disabled="!hasPermission('system:task:once')">
                <template #icon><ToolOutlined /></template>仅一次
              </Button>
            </Popconfirm>
            <Popconfirm
              title="确认运行该任务吗?"
              :disabled="!hasPermission('system:task:start') || !(record.status === 0)"
              @confirm="handleStart(record)"
            >
              <Button
                type="link"
                size="small"
                :disabled="!hasPermission('system:task:start') || !(record.status === 0)"
              >
                <template #icon><CaretRightOutlined /></template>运行
              </Button>
            </Popconfirm>
            <Popconfirm
              title="确认停止该任务吗?"
              :disabled="!hasPermission('system:task:stop') || !(record.status === 1)"
              @confirm="handleStop(record)"
            >
              <Button
                type="link"
                size="small"
                :disabled="!hasPermission('system:task:stop') || !(record.status === 1)"
              >
                <template #icon><PoweroffOutlined /></template>停止
              </Button>
            </Popconfirm>
          </Descriptions.Item>
        </Descriptions>
      </template>
    </BasicTable>
    <TaskModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup name="定时任务">
  import { Descriptions, Tooltip, Popconfirm, Button } from 'ant-design-vue';
  import { ToolOutlined, CaretRightOutlined, PoweroffOutlined } from '@ant-design/icons-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useModal } from '/@/components/Modal';
  import TaskModal from './TaskModal.vue';
  import { getTaskList, taskDelete, taskOnce, taskStart, taskStop } from '/@/api/system/task';
  import { columns, searchFormSchema, TableListItem } from './task.data';

  const [registerTable, { reload, updateTableDataRecord, deleteTableDataRecord }] = useTable({
    title: '任务列表',
    api: getTaskList,
    useSearchForm: true,
    formConfig: {
      labelWidth: 80,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    columns: columns,
    bordered: true,
    striped: false,
    canResize: false,
    expandRowByClick: true,
    showTableSetting: true,
    showIndexColumn: false,
    rowKey: 'id',
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      fixed: 'right',
    },
  });
  const [registerModal, { openModal }] = useModal();
  const { hasPermission } = usePermission();

  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }

  function handleEdit(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
    });
  }

  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      updateTableDataRecord(values.id, values);
    } else {
      reload();
    }
  }

  function handleDelete({ id }: Recordable) {
    taskDelete(id);
    deleteTableDataRecord(id);
  }

  const handleOnce = async ({ id }: TableListItem) => {
    await taskOnce(id);
    reload();
  };

  const handleStart = async ({ id }: TableListItem) => {
    await taskStart(id);
    reload();
  };

  const handleStop = async ({ id }: TableListItem) => {
    await taskStop(id);
    reload();
  };

  const parseExecTime = (record: TableListItem) => {
    if (!record.startTime && !record.endTime) {
      return '无时段限制';
    }
    if (!record.startTime && record.endTime) {
      return `无开始时间限制 - ${record.endTime}`;
    }
    if (record.startTime && !record.endTime) {
      return `${record.startTime} - 长期有效`;
    }
    return `${record.startTime} - ${record.endTime}`;
  };
</script>

<style scoped></style>
