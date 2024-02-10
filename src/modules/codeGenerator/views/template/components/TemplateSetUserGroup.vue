<template>
  <a-layout class="full-height">
    <a-layout-header style="height: 56px; background: white; text-align: center">
      <h3>{{ $t('generator.views.template.title.userGroup') }}</h3>
    </a-layout-header>
    <a-divider style="margin: 0" />
    <a-layout-content style="background: white">
      <div class="full-height">
        <a-spin class="full-height" :spinning="dataLoading">
          <a-table
            class="full-height"
            size="small"
            row-key="groupId"
            :row-selection="rowSelection"
            :columns="columns"
            :show-header="false"
            :pagination="false"
            :data-source="allUserGroup"
          />
        </a-spin>
      </div>
    </a-layout-content>
    <a-divider style="margin: 0" />
    <a-layout-footer style="height: 50px; padding: 10px 0; background: white; text-align: center">
      <div style="padding: 0 5px">
        <a-button
          :disabled="!saveButtonVisible"
          :loading="saveLoading"
          block
          type="primary"
          @click="handleSave"
        >
          {{ $t('common.button.save') }}
        </a-button>
      </div>
    </a-layout-footer>
  </a-layout>
</template>

<script lang="ts">
  import { defineComponent, toRefs, onMounted, ref, reactive, watch, computed } from 'vue';
  import type { PropType } from 'vue';

  import { isSuperAdmin, getCurrentUserId } from '@/utils/auth';

  import { message } from 'ant-design-vue';
  import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

  /**CodeListView
   * 模板设置关联的用户组
   */
  export default defineComponent({
    name: 'TemplateSetUserGroup',
    props: {
      template: {
        type: Object as PropType<any>,
        default: null,
      },
    },
    setup(props) {
      const { template } = toRefs(props);
      const dataLoading = ref(false);
      // 保存状态
      const saveLoading = ref(false);
      const allUserGroup = ref<Array<any>>([]);
      const rowSelection = reactive({
        columnWidth: 60,
        selectedRowKeys: [] as Array<number>,
        onChange: (selectedRowKeys: Array<number>) => {
          rowSelection.selectedRowKeys = selectedRowKeys;
        },
      });
      /**
       * 保存安装显示状态
       */
      const saveButtonVisible = computed(() => {
        if (isSuperAdmin()) {
          return true;
        }
        const currentUserId = getCurrentUserId;
        const templateValue: any = template.value;
        return templateValue ? templateValue.createUserId === currentUserId : false;
      });
      /**
       * 加载所有用户组数据
       */
      const loadAllUserGroup = async () => {
        try {
          dataLoading.value = true;
          allUserGroup.value = await defHttp.post({
            service: ApiServiceEnum.SMART_SYSTEM,
            url: 'sys/userGroup/list',
            data: {
              sortName: 'seq',
              parameter: {
                'useYn@=': true,
              },
            },
          });
        } finally {
          dataLoading.value = false;
        }
      };
      /**
       * 加载模板对应的用户组信息
       */
      const loadTemplateUserGroup = async () => {
        const templateValue: any = template.value;
        if (templateValue === null) {
          rowSelection.selectedRowKeys = [];
        }
        try {
          dataLoading.value = true;
          const result: Array<any> = await defHttp.post({
            service: ApiServiceEnum.SMART_CODE,
            url: 'db/code/template/listUserGroupByTemplate',
            data: templateValue.templateId,
          });
          rowSelection.selectedRowKeys = result.map((item) => item.groupId);
        } finally {
          dataLoading.value = false;
        }
      };
      /**
       * 保存操作
       */
      const handleSave = async () => {
        const templateValue: any = template.value;
        if (!templateValue) {
          message.error('请先指定模板');
          return false;
        }
        try {
          saveLoading.value = true;
          await defHttp.post({
            service: ApiServiceEnum.SMART_CODE,
            url: 'db/code/template/saveTemplateUserGroup',
            data: {
              templateId: templateValue.templateId,
              groupIdList: rowSelection.selectedRowKeys,
            },
          });
          message.success('保存成功');
        } finally {
          saveLoading.value = false;
        }
      };
      watch(template, loadTemplateUserGroup);
      onMounted(loadAllUserGroup);
      return {
        dataLoading,
        allUserGroup,
        rowSelection,
        handleSave,
        saveLoading,
        saveButtonVisible,
      };
    },
    data() {
      return {
        columns: [
          {
            dataIndex: 'groupName',
          },
        ],
      };
    },
  });
</script>

<style scoped></style>
