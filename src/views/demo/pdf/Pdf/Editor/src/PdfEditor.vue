<template>
  <Viewer
    ref="ViewerRef"
    :buf="pdfBufferArray"
    :enabledPage="isView"
    edit
    @update-state="updateState"
  >
    <template #canvas>
      <Paint v-if="isPaint" ref="PaintRef" :width="viewportWidth" :height="viewportHeight" />
      <Text v-else-if="isText" ref="TextRef" :width="viewportWidth" :height="viewportHeight" />
      <div v-else></div>
    </template>
    <template #edit-bar>
      <div v-if="isPaint">
        <Button @click="handleExit()">退出</Button>
        <Button @click="handleSavePaint()">保存画笔</Button>
      </div>
      <div v-else-if="isText">
        <Button @click="handleExit()">退出</Button>
        <Button @click="handleSaveText()">保存文字</Button>
      </div>
      <div v-else>
        <Button @click="handleRestore()">重做</Button>
        <Button @click="handlePaint()">画笔</Button>
        <Button @click="handleText()">文字</Button>
        <Button @click="handleSave()">保存</Button>
      </div>
    </template>
  </Viewer>
</template>
<script lang="ts">
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  import { computed, defineComponent, onMounted, reactive, toRefs, watch } from 'vue';
  import { Button } from 'ant-design-vue';
  import { PDFDocument } from 'pdf-lib';
  import Viewer, { PdfViewerRefs } from '../../Viewer/src/PdfViewer.vue';
  import { getBufferArray } from '../../utils';
  // import { TypedArray } from "pdfjs-dist/types/display/api";
  import Paint, { PaintRefs } from './Paint.vue';
  import Text, { TextRefs } from './Text.vue';
  type EditState = null | 'Paint' | 'Text';
  export default defineComponent({
    name: 'PdfEditor',
    components: {
      Viewer,
      Paint,
      Text,
      Button,
    },
    props: {
      src: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      let pdfDoc: PDFDocument | null = null;
      const state = reactive({
        current: 0,
        total: 0,
        viewportWidth: 0,
        viewportHeight: 0,
        editState: null as EditState,
        pdfBufferArray: {} as any,
        ViewerRef: {} as PdfViewerRefs,
        PaintRef: {} as PaintRefs,
        TextRef: {} as TextRefs,
        CanvasRef: {} as HTMLCanvasElement,
      });
      // computed
      const isView = computed(() => {
        return state.editState === null;
      });
      const isPaint = computed(() => {
        return state.editState === 'Paint';
      });
      const isText = computed(() => {
        return state.editState === 'Text';
      });
      // method
      const handleRestore = async () => {
        state.pdfBufferArray = await getBufferArray(props.src);
      };
      const handleSave = () => {
        console.log(state.pdfBufferArray);
      };
      const handleExit = () => {
        state.editState = null;
      };
      const buildPdfDoc = async () => {
        pdfDoc = await PDFDocument.load(state.pdfBufferArray);
      };
      const drawPaint = async (pngImageBase64: string) => {
        const pngImage = await pdfDoc!.embedPng(pngImageBase64);
        const pngDims = pngImage.scale(1);
        const pages = pdfDoc!.getPages();
        const currentPage = pages[state.current - 1];
        currentPage.drawImage(pngImage, {
          x: 0,
          y: 0,
          width: pngDims.width,
          height: pngDims.height,
        });
      };
      const handleSaveText = async () => {
        await buildPdfDoc();
        const pngImageBase64 = state.TextRef.drawTextBoxAndSave();
        await drawPaint(pngImageBase64);
        state.pdfBufferArray = await pdfDoc!.save();
        handleExit();
      };
      const handleSavePaint = async () => {
        await buildPdfDoc();
        const pngImageBase64 = state.PaintRef.save();
        await drawPaint(pngImageBase64);
        state.pdfBufferArray = await pdfDoc!.save();
        handleExit();
      };
      const handlePaint = () => {
        state.editState = 'Paint';
      };
      const handleText = () => {
        state.editState = 'Text';
      };
      const updateState = (parentState: any) => {
        state.current = parentState.current;
        state.total = parentState.total;
        state.viewportWidth = parentState.viewportWidth;
        state.viewportHeight = parentState.viewportHeight;
      };
      const fetchPdfDoc = async () => {
        state.pdfBufferArray = await getBufferArray(props.src);
        state.ViewerRef.refreshPdfDoc(state.pdfBufferArray);
      };
      onMounted(async () => {
        await fetchPdfDoc();
        watch(
          () => state.pdfBufferArray,
          (n) => {
            state.ViewerRef.refreshPdfDoc(n);
          }
        );
      });
      return {
        ...toRefs(state),
        // computed
        isView,
        isPaint,
        isText,
        // method
        updateState,
        handleSave,
        handleExit,
        handleSavePaint,
        handleSaveText,
        handlePaint,
        handleText,
        handleRestore,
      };
    },
  });
</script>
