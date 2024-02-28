import { isClient } from '@/utils/is';
import { createVNode, render } from 'vue';
import { downloadBlob } from '@/utils/file/file';
import { TemplateEnum, exportTemplate } from '@/api/export';
import { getDocTemplates } from '@/api/system/docTemplate';
import { YN } from '@/enums/YN';
import { message } from 'ant-design-vue';
import ExportDoc from './index.vue';

const downloadTemp = async (
  templateType: TemplateEnum,
  templateId: number,
  ids: number[],
  queryParam = {},
) => {
  try {
    const res = await exportTemplate(templateType, templateId, ids, {
      ...queryParam,
    });
    console.log(res);
    downloadBlob(res);
  } catch (error) {
    console.log(error);
  }
};

let instance: ReturnType<typeof createVNode> | null = null;
export function createExportDoc(options: Recordable) {
  if (!isClient) return;
  const propsData: Partial<Recordable> = {};
  const container = document.createElement('div');
  Object.assign(propsData, { show: true }, options);

  instance = createVNode(ExportDoc, propsData);
  render(instance, container);
  document.body.appendChild(container);
  return instance.component?.exposed;
}

export async function useExportDoc(templateType: TemplateEnum, ids: number[], params: Recordable) {
  if (!templateType) return;
  const data = await getDocTemplates({ templateType, isEnable: YN.Y });
  if (data.length === 0) {
    message.error('请先上传(启用)模板');
  } else if (data.length === 1) {
    const id = data[0].id;
    downloadTemp(templateType, id, ids, params);
  } else {
    createExportDoc({
      ids,
      where: params,
      templateType,
      templateList: data.sort((a, b) => b.sortNum - a.sortNum),
    });
  }
}
