<template>
  <PageWrapper title="截图示例">
    <CollapseContainer title="截图操作">
      <a-button type="primary" class="mr-2" @click="handleScreenshot">截取当前body</a-button>
      <a-button type="primary" class="mr-2" :disabled="!showPicture" @click="handleDelScreenshot"
        >删除截图</a-button
      >
      <a-button type="primary" class="mr-2" :disabled="!showPicture" @click="handlePrintScreenshot"
        >打印截图</a-button
      >
      <a-button
        type="primary"
        class="mr-2"
        :disabled="!showPicture"
        @click="handleDownloadScreenshot"
        >下载截图</a-button
      >
    </CollapseContainer>

    <Card title="截图内容" class="mt-4">
      <div ref="pictureRef" v-show="showPicture"></div>
    </Card>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '@/components/Page';
  import html2canvas from 'html2canvas';
  import { ref } from 'vue';
  import { Card } from 'ant-design-vue';
  import { CollapseContainer } from '@/components/Container';
  import printJS from 'print-js';
  import { downloadByBase64 } from '@/utils/file/download';

  const pictureRef = ref();
  const showPicture = ref<boolean>(false);
  const canvasUrl = ref<string>('');

  function handleScreenshot() {
    if (showPicture.value) return;
    html2canvas(document.body, {
      backgroundColor: '#ffffff',
      allowTaint: true, //开启跨域
      useCORS: true,
      scrollY: 0,
      scrollX: 0,
    })
      .then(function (canvas) {
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        pictureRef.value.appendChild(canvas);
        showPicture.value = true;
        canvasUrl.value = canvas.toDataURL();
      })
      .catch((err) => {
        console.log('绘制失败', err);
      });
  }

  function handleDelScreenshot() {
    pictureRef.value.innerHTML = '';
    canvasUrl.value = '';
    showPicture.value = false;
  }

  function handlePrintScreenshot() {
    if (!canvasUrl.value) return;
    printJS({
      printable: canvasUrl.value,
      type: 'image',
      base64: true,
    });
  }

  function handleDownloadScreenshot() {
    downloadByBase64(canvasUrl.value, 'screen_shot.png');
  }
</script>
