<template>
  <div>
    <a-button :loading="loading" v-bind="$attrs">
      {{ label }}
    </a-button>
    <BasicModal destroyOnClose title="选择模板" :visible="show" @cancel="onCancel" width="60%">
      <template #footer></template>
      <template v-if="loading">
        <div class="empty-tips">加载中，请稍后……</div>
      </template>
      <div v-if="!loading" class="flex flex-wrap">
        <div
          v-for="(item, index) in templateList"
          :key="item.id"
          class="template-box md:w-[calc(25%_-_9px)] w-full"
          :class="{
            'md:mr-12px': (index % 4) + 1 < 4,
            'mt-12px': (index + 1) / 4 > 1,
          }"
        >
          <div class="template-content" @click="onClick(item)">
            <div class="template-icon flex items-center justify-center">
              <div v-if="item.sysDefault === 'Y'" class="default">
                <div class="default-icon text-xs">默认</div>
              </div>
              <FIcon :file-name="item.templateName" :width="50" />
            </div>
            <div class="select-button">
              <a-button type="link" :disabled="item.isEnable === 'N'">选择</a-button>
            </div>
          </div>
          <div>
            <div class="whitespace-nowrap text-ellipsis overflow-hidden" :title="item.templateName">
              {{ item.templateName }}
            </div>
            <div class="text-xs text-gray-300">
              {{ item.supportMaxRecord === 0 ? '无限制' : item.supportMaxRecord + '行' }}
            </div>
          </div>
        </div>
      </div>
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { debounce } from 'lodash-es';
  import { reactive, ref } from 'vue';
  import { exportTemplate, TemplateEnum } from '@/api/export';
  import { getDocTemplates } from '@/api/system/docTemplate';
  import { DocTemplateResult } from '@/api/system/model/docTempModel';
  import { downloadBlob } from '@/utils/file/file';
  import { propTypes } from '@/utils/propTypes';
  import { FIcon } from '@/components/Business';
  import { YN } from '@/enums/YN';
  import { BasicModal } from '../Modal';

  const props = defineProps({
    label: propTypes.string.def('下载'),
    templateType: {
      type: String as PropType<TemplateEnum>,
      required: true,
    },
    where: {
      type: Object as PropType<Recordable>,
      default: () => {},
    },
  });
  const loading = ref(false);
  const show = ref(false);
  const templateList = ref<DocTemplateResult[]>([]);
  const templateData = reactive({
    ids: [] as number[],
    queryParam: {} as Recordable,
    templateList: [] as DocTemplateResult[],
  });
  const exportDoc = debounce(async function (ids: number[], queryParam: Object) {
    const { templateType } = props;
    if (!templateType) return;
    loading.value = true;
    const data = await getDocTemplates({ templateType, isEnable: YN.Y });
    loading.value = false;
    if (data.length === 0) {
      message.error('请先上传(启用)模板');
    } else if (data.length === 1) {
      const id = data[0].id;
      downloadTemp(templateType, id, ids, queryParam);
    } else {
      templateData.ids = ids;
      templateData.queryParam = queryParam;
      templateList.value = data.sort((a, b) => b.sortNum - a.sortNum);
      show.value = true;
    }
  }, 500);
  const onCancel = () => {
    show.value = false;
    templateData.ids = [];
    templateData.queryParam = {};
  };
  const onClick = debounce(function ({ id }) {
    const { ids, queryParam } = templateData;
    downloadTemp(props.templateType, id, ids, queryParam);
    onCancel();
  }, 1000);
  const downloadTemp = async (
    templateType: TemplateEnum,
    templateId: number,
    ids: number[],
    queryParam = {},
  ) => {
    loading.value = true;
    try {
      const res = await exportTemplate(templateType, templateId, ids, {
        ...queryParam,
        ...props.where,
      });
      console.log(res);
      downloadBlob(res);
    } catch (error) {
      console.log(error);
    }
    loading.value = false;
  };
  defineExpose({
    exportDoc,
  });
</script>

<style lang="less" scoped>
  .empty-tips {
    height: 100px;
    line-height: 100px;
    text-align: center;
  }

  .template-box {
    .template-content {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 148%;
      overflow: hidden;
      border: 1px solid #c2c2c2;
      border-radius: 4px;
      background-color: #fff;
      // box-shadow: 2px 2px 2px #dddddd;
      text-align: center;

      .template-icon {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .default {
        position: absolute;
        top: 0;
        right: 0;

        .default-icon {
          position: relative;
          width: 30px;
          height: 16px;
          border-radius: 0 0 0 2px;
          background: linear-gradient(to right, #ffb996, #fb9968);
          color: #fff;

          &::after {
            content: ' ';
            position: absolute;
            top: 0;
            left: -12px;
            width: 0;
            height: 0;
            border-top: 16px solid #ffb996;
            border-left: 12px solid transparent;
          }
        }
      }

      .select-button {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 32px;

        button {
          display: none;
        }
      }
    }

    &:hover {
      .select-button {
        background-color: #f4fcfc;

        button {
          display: inline-block;
        }
      }
    }
  }
</style>
