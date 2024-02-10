<template>
  <div class="full-height">
    <div class="table-container">
      <vxe-grid
        ref="gridRef"
        highlight-current-row
        stripe
        :columns="columns"
        height="auto"
        size="small"
        v-bind="tableProps"
        @cell-click="handleChange"
      >
        <template #table-groupName="{ row }">
          <div style="cursor: pointer" @contextmenu="handleContext">
            {{ row.groupName }}
          </div>
          <!--            <ContextMenu event="contextmenu">-->
          <!--              {{ row.groupName }}-->
          <!--              <template #menu>-->
          <!--                <a-menu @click="({ key, domEvent }) => handleMenuClick(key, row.groupId, domEvent)">-->
          <!--                  <a-menu-item key="edit">-->
          <!--                    <EditOutlined />-->
          <!--                    &nbsp;&nbsp;{{ $t('common.button.edit') }}-->
          <!--                  </a-menu-item>-->
          <!--                  <a-menu-item key="delete">-->
          <!--                    <DeleteOutlined />-->
          <!--                    &nbsp;&nbsp;{{ $t('common.button.delete') }}-->
          <!--                  </a-menu-item>-->
          <!--                </a-menu>-->
          <!--              </template>-->
          <!--            </ContextMenu>-->
          <!--          </div>-->
        </template>
      </vxe-grid>
    </div>
    <div class="button-container">
      <a-button class="button" block type="primary" @click="() => handleAddEdit(true, null)">
        {{ $t('common.button.add') }}
      </a-button>
    </div>

    <a-modal v-bind="modalProps">
      <a-spin :spinning="spinning">
        <a-form
          v-bind="formProps"
          :rules="rules"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-form-item :label="$t('generator.views.template.title.templateGroup')" name="groupName">
            <a-input
              v-model:value="formProps.model.groupName"
              :placeholder="$t('generator.views.template.validate.templateGroup')"
            />
          </a-form-item>
          <a-form-item :label="$t('generator.views.template.title.seq')" name="seq">
            <a-input-number
              v-model:value="formProps.model.seq"
              style="width: 100%"
              :placeholder="$t('generator.views.template.validate.seq')"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  // import { ContextMenu } from '@/components/ContextMenu';
  import { useVxeTable, useAddEdit, useVxeDelete } from '@/hooks/web/useCrud';
  import { ApiServiceEnum, defHttp } from '@/utils/http/axios';
  import { useContextMenu } from '@/hooks/web/useContextMenu';

  const handleLoadData = async () => {
    const result = [
      {
        groupName: 'ALL',
      },
    ];
    return result.concat(
      (await defHttp.post({
        url: 'db/code/template/listGroup',
        service: ApiServiceEnum.SMART_CODE,
      })) || [],
    );
  };

  /**
   * 通过ID查询
   */
  const handleGet = (id: any) => {
    return defHttp.post({
      service: ApiServiceEnum.SMART_CODE,
      url: 'db/code/template/getGroupById',
      data: id,
    });
  };

  const handleSaveUpdate = async (model: any) => {
    return defHttp.post({
      service: ApiServiceEnum.SMART_CODE,
      url: 'db/code/template/saveUpdateGroup',
      data: model,
    });
  };

  const handleDelete = async (idList: Array<any>) => {
    return defHttp.post({
      service: ApiServiceEnum.SMART_CODE,
      url: 'db/code/template/deleteGroupById',
      data: idList,
    });
  };

  export default defineComponent({
    name: 'TemplateGroup',
    emits: ['change'],
    setup() {
      const { t } = useI18n();
      const gridRef = ref();
      const { tableProps, loadData } = useVxeTable(handleLoadData, {
        paging: false,
      });
      // 编辑
      const { modalProps, handleAddEdit, spinning, formProps, formRef } = useAddEdit(
        gridRef,
        handleGet,
        loadData,
        handleSaveUpdate,
        t,
        {
          defaultModel: {
            seq: 1,
          },
        },
      );

      const [createContextMenu] = useContextMenu();

      const handleContext = (e: MouseEvent) => {
        return createContextMenu({
          event: e,
          items: [
            {
              label: t('common.button.edit'),
              icon: 'ant-design:edit-outlined',
            },
            {
              label: t('common.button.delete'),
              icon: 'ant-design:delete-outlined',
            },
          ],
        });
      };

      const { handleDeleteById } = useVxeDelete(gridRef, t, handleDelete, {
        idField: 'groupId',
        listHandler: loadData,
      });

      const handleMenuClick = (ident: string, groupId: number, event: Event) => {
        event.preventDefault();
        switch (ident) {
          case 'edit': {
            handleAddEdit(false, groupId);
            break;
          }
          case 'delete': {
            handleDeleteById(groupId);
            break;
          }
        }
      };

      onMounted(loadData);
      return {
        gridRef,
        tableProps,
        loadData,
        handleMenuClick,
        modalProps,
        handleAddEdit,
        spinning,
        formProps,
        formRef,
        handleContext,
      };
    },
    data() {
      return {
        columns: [
          {
            title: '{generator.views.template.title.templateGroup}',
            field: 'groupName',
            slots: {
              default: 'table-groupName',
            },
          },
        ],
        rules: {
          groupName: [
            {
              required: true,
              message: this.$t('generator.views.template.validate.templateGroup'),
              trigger: 'blur',
            },
          ],
          seq: [
            {
              required: true,
              message: this.$t('generator.views.template.validate.seq'),
              trigger: 'blur',
              type: 'number',
            },
          ],
        },
      };
    },
    methods: {
      handleChange({ row }: any) {
        this.$emit('change', row.groupId);
      },
    },
  });
</script>

<style lang="less" scoped>
  @buttonContainerHeight: 50px;

  .table-container {
    height: calc(100% - @buttonContainerHeight);
  }

  .button-container {
    height: @buttonContainerHeight;
    line-height: @buttonContainerHeight;
    text-align: center;

    .button {
      width: 90%;
    }
  }
</style>
