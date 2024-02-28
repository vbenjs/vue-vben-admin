import { hiprint, defaultElementTypeProvider, disAutoConnect } from 'vue-plugin-hiprint';
import { HiPrintProps, PaperType } from '../typing';
import { ref, unref, watch, watchEffect } from 'vue';
import { message } from 'ant-design-vue';
import { showJson, showPrintPreview } from '../functional';
import { panel as defaultPanel, fontList, paperTypes, scaleMax, scaleMin } from '../constant';
import { useMessage } from '@/hooks/web/useMessage';

disAutoConnect();

const { createMessage: msg } = useMessage();

const findPageSize = (panel: any) => {
  const data = panel?.panels?.[0];
  if (!data)
    return {
      key: 'A4' as PaperType,
      width: 210,
      height: 297,
      scale: 1,
    };
  const key = Object.keys(paperTypes).find((key) => {
    const item = paperTypes[key];
    if (item.width === data.width && item.height === data.height) {
      return true;
    }
    return false;
  });
  return {
    key: (key || 'other') as PaperType,
    width: data.width,
    height: data.height,
    scale: data.scale || 1,
  };
};

export function useHiPrint(props: HiPrintProps): [any, Recordable] {
  const scale = ref(1);
  const selectedElements = ref([]);
  const { provider, designEleId, settingContainer, printElementContainer, paper, panel, config } =
    props || {};

  hiprint.init({
    providers: [provider ? provider?.f : new defaultElementTypeProvider()],
  });

  if (unref(paper)) {
    const { key, width, height, scale } = findPageSize(panel);
    unref(paper)!.type = key;
    unref(paper)!.width = width;
    unref(paper)!.height = height;
    unref(paper)!.scale = scale;
  }

  if (config) {
    // 还原配置
    hiprint.setConfig();
    // 替换配置
    hiprint.setConfig(config);
  }

  if (provider) {
    $(printElementContainer).empty();
    hiprint.PrintElementTypeManager.build(printElementContainer, provider.value);
  } else {
    hiprint.PrintElementTypeManager.buildByHtml($('.ep-draggable-item'));
  }

  $(designEleId).empty();
  const hiprintTemplate = new hiprint.PrintTemplate({
    settingContainer: settingContainer,
    // paginationContainer: '.hiprint-printPagination',
    template: panel ?? defaultPanel,
    history: true, // 是否需要 撤销重做功能
    fontList,
  });
  hiprintTemplate.design(designEleId);
  console.log(hiprint, hiprintTemplate);
  // 获取当前放大比例, 当zoom时传true 才会有
  scale.value = hiprintTemplate.editingPanel.scale || 1;

  $('.hiprint-printElement').on('click', () => {
    // 监听选中元素
    console.log('监听选中元素');
    const elements = hiprintTemplate.getSelectEls();
    // console.log(elements);
    selectedElements.value = elements;
  });

  watch(
    () => unref(paper),
    (paper) => {
      if (!paper) return;
      if (!hiprintTemplate) return;
      const pageSize = paperTypes[paper.type];
      if (paper.type !== 'other') hiprintTemplate.setPaper(pageSize.width, pageSize.height);
      else hiprintTemplate.setPaper(paper.width, paper.height);
    },
    { deep: true },
  );

  const methods = {
    // print: (printData: Object = {}, options) => {
    //   if (window.hiwebSocket.opened) {
    //     const printerList = hiprintTemplate.getPrinterList();
    //     console.log(printerList);
    //     hiprintTemplate.print2(printData, { printer: '', title: 'hiprint测试打印', ...options });
    //     return;
    //   }
    //   message.error('客户端未连接,无法直接打印');
    // },

    preview: (width: number, printData?: Object) => {
      // preViewRef.value.show(hiprintTemplate, printData, width);
      showPrintPreview({
        width: paper?.value.width,
        template: hiprintTemplate,
        hiprintData: printData,
      });
    },
    previewJson: () => {
      showJson({ template: hiprintTemplate });
    },
    clear: () => {
      try {
        hiprintTemplate.clear();
      } catch (error) {
        message.error(`操作失败: ${error}`);
      }
    },
    changeScale: (big: boolean) => {
      if (!paper) return;
      if (big) {
        paper.value.scale += 0.1;
        if (paper.value.scale > scaleMax) paper.value.scale = scaleMax;
      } else {
        paper.value.scale -= 0.1;
        if (paper.value.scale < scaleMin) paper.value.scale = scaleMin;
      }
      if (hiprintTemplate) {
        // scaleValue: 放大缩小值, false: 不保存(不传也一样), 如果传 true, 打印时也会放大
        hiprintTemplate.zoom(paper.value.scale, false);
      }
    },
  };

  return [hiprintTemplate, { scale: scale.value, ...methods }];
}
