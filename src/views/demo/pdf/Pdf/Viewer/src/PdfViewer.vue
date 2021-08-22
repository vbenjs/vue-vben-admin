<template>
  <div class="pdf-viewer-wrap">
    <div class="top-bar">
      <div class="left-box">
        <Button color="success">
          <template #icon>
            <MenuOutlined :style="{ fontSize: '20px' }" />
          </template>
        </Button>
      </div>
      <div class="center-box">
        <span :class="{ active: !isEdit }" @click="isEdit = false"> <Button>预览</Button></span>
        <span v-if="edit" :class="{ active: isEdit }" @click="isEdit = true">
          <Button>编辑</Button>
        </span>
      </div>
      <div class="right-box">
        <Popover title="" trigger="click" placement="topLeft">
          <Button color="success">
            <template #icon>
              <InfoOutlined :style="{ fontSize: '20px' }" />
            </template>
          </Button>
          <template #content>
            <a-descriptions title="文件信息" :column="1" :span="4" :bordered="true">
              <a-descriptions-item label="标题: "> {{ info.title }} </a-descriptions-item>
              <a-descriptions-item label="作者: "> {{ info.author }} </a-descriptions-item>
              <a-descriptions-item label="主题: "> {{ info.subject }} </a-descriptions-item>
              <a-descriptions-item label="关键字: "> {{ info.keywords }} </a-descriptions-item>
            </a-descriptions>
          </template>
        </Popover>
      </div>
    </div>
    <div v-if="edit && isEdit" class="tool-bar">
      <slot name="edit-bar"></slot>
    </div>
    <div class="content-wrap">
      <div class="render-content" ref="RenderContentRef">
        <slot name="canvas"></slot>
        <canvas ref="CanvasRef"></canvas>
      </div>
      <div v-if="enabledPage" class="page-wrap">
        <Button @click="handlePrev()" :disabled="prevDisabled">
          <template #icon>
            <CaretLeftOutlined :style="{ fontSize: '20px' }" />
          </template>
        </Button>
        <span class="page-count">{{ current }} / {{ total }}</span>
        <Button @click="handleNext()" :disabled="nextDisabled">
          <template #icon>
            <CaretRightOutlined :style="{ fontSize: '20px' }" />
          </template>
        </Button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, onMounted, reactive, toRefs, PropType } from 'vue';
  import { Button, Popover, Descriptions } from 'ant-design-vue';
  import {
    MenuOutlined,
    InfoOutlined,
    CaretLeftOutlined,
    CaretRightOutlined,
  } from '@ant-design/icons-vue';
  import * as pdfjsLib from 'pdfjs-dist';
  import { PDFDocumentProxy, PDFPageProxy, TypedArray } from 'pdfjs-dist/types/display/api';
  import { getBufferArray } from '../../utils';
  // pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.min.js'; // 此用法需要将此文件放置 public 文件夹下
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://unpkg.zhimg.com/pdfjs-dist@2.10.377/build/pdf.worker.min.js'; // 与package.json 中 pdfjs-dist 同版本，不一定是此CDN地址，视情况而定
  const pdfViewerProps = {
    src: {
      type: String,
      default: '',
    },
    buf: {
      type: Object as PropType<TypedArray>,
      default: () => ({}),
    },
    edit: {
      type: Boolean,
      default: false,
    },
    enabledPage: {
      type: Boolean,
      default: true,
    },
  };
  const PdfViewer = defineComponent({
    name: 'PdfViewer',
    components: {
      Button,
      MenuOutlined,
      InfoOutlined,
      Popover,
      [Descriptions.name]: Descriptions,
      [Descriptions.Item.name]: Descriptions.Item,
      CaretLeftOutlined,
      CaretRightOutlined,
    },
    props: pdfViewerProps,
    emits: ['update-state'],
    setup(props, { emit }) {
      const state = reactive({
        CanvasRef: {} as HTMLCanvasElement,
        RenderContentRef: {} as HTMLElement,
        loading: false,
        isEdit: false,
        current: 1,
        total: 0,
        pdfDoc: {} as PDFDocumentProxy,
        pdfPage: {} as PDFPageProxy,
        info: {
          title: '',
          author: '',
          subject: '',
          keywords: '',
        },
      });
      // computed
      const prevDisabled = computed(() => {
        if (state.total === 0) {
          return true;
        } else {
          if (state.current === 1) {
            return true;
          } else {
            return false;
          }
        }
      });
      const nextDisabled = computed(() => {
        if (state.total === 0) {
          return true;
        } else {
          if (state.current === state.total) {
            return true;
          } else {
            return false;
          }
        }
      });
      // method
      const handlePrev = () => {
        state.current--;
        getPdfPage(state.current);
      };
      const handleNext = () => {
        state.current++;
        getPdfPage(state.current);
      };
      const render = async () => {
        // Display page on the existing canvas with 100% scale.
        const viewport = state.pdfPage.getViewport({ scale: 1.0 });
        state.CanvasRef.width = viewport.width;
        state.CanvasRef.height = viewport.height;
        const ctx = state.CanvasRef.getContext('2d');
        if (!ctx) {
          return;
        }
        const renderTask = state.pdfPage.render({
          canvasContext: ctx,
          viewport,
        });
        await renderTask.promise;
        // emit to parent
        emit('update-state', {
          current: state.current,
          total: state.total,
          viewportWidth: viewport.width,
          viewportHeight: viewport.height,
        });
      };
      const getPdfPage = async (crt: number) => {
        console.log(crt);
        state.loading = true;
        if (!state.pdfDoc) {
          return;
        }
        state.pdfPage = await state.pdfDoc.getPage(crt);
        await render();
        state.loading = false;
        state.RenderContentRef.scrollTo({
          top: 0,
        });
      };
      const refreshPdfDoc = async (buf: TypedArray) => {
        state.pdfDoc = await pdfjsLib.getDocument(buf as TypedArray).promise;
        state.total = state.pdfDoc.numPages;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { info }: { info: any } = await state.pdfDoc.getMetadata();
        state.info = {
          title: info.Title,
          author: info.Author,
          subject: info.Subject,
          keywords: info.Keywords,
        };
        getPdfPage(state.current);
      };
      const getPdfDoc = async () => {
        if (props.src) {
          await refreshPdfDoc(await getBufferArray(props.src));
        }
      };
      onMounted(() => {
        getPdfDoc();
      });
      return {
        // ref
        ...toRefs(state),
        // computed
        prevDisabled,
        nextDisabled,
        // method
        handlePrev,
        handleNext,
        refreshPdfDoc,
      };
    },
  });
  export default PdfViewer;
  export type PdfViewerRefs = InstanceType<typeof PdfViewer>;
</script>
<style lang="less" scoped>
  .pdf-viewer-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .top-bar {
    height: 40px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f9f9f9;
    padding: 2px 5px;
  }

  .tool-bar {
    height: 40px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e0e0e0;
    padding: 2px 5px;
  }

  .content-wrap {
    min-height: 0;
    position: relative;
    flex: 1;
    width: 100%;
    display: flex;
  }

  .page-wrap {
    position: absolute;
    bottom: 5%;
    left: calc(50% - 65px);
    padding: 2px 5px;
    height: 32px;
    display: flex;
    align-items: center;

    .page-count {
      padding: 5px;
    }
  }

  .render-content {
    flex: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: scroll;
    overflow-x: hidden;
    background: #eee;
    padding: 15px 0;
    box-sizing: border-box;
    position: relative;
  }

  .render-content canvas {
    box-shadow: 0 0 15px 5px #cfcfcf;
  }

  .left-box,
  .center-box,
  .right-box {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .center-box > span {
    color: #666;
    cursor: pointer;
  }

  .center-box > span.active {
    color: #999;
    cursor: default;
  }
</style>
