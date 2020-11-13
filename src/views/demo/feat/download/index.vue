<template>
  <div class="m-5 demo-box">
    <a-alert message="根据后台接口文件流下载" />
    <a-button type="primary" class="my-4" @click="handleDownByData"> 文件流下载 </a-button>

    <a-alert message="根据文件地址下载文件" />
    <a-button type="primary" class="my-4" @click="handleDownloadByUrl"> 文件地址下载 </a-button>

    <a-alert message="base64流下载" />
    <a-button type="primary" class="my-4" @click="handleDownloadByBase64"> base64流下载 </a-button>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { downloadByUrl, downloadByData, downloadByBase64 } from '/@/utils/file/FileDownload';
  import imgBase64 from './imgBase64';
  export default defineComponent({
    setup() {
      function handleDownByData() {
        downloadByData('text content', 'testName.txt');
      }
      function handleDownloadByUrl() {
        downloadByUrl({
          url: 'https://codeload.github.com/anncwb/vue-vben-admin-doc/zip/master',
          target: '_self',
        });
      }

      function handleDownloadByBase64() {
        downloadByBase64(imgBase64, 'logo.png');
      }
      return {
        handleDownloadByUrl,
        handleDownByData,
        handleDownloadByBase64,
      };
    },
  });
</script>
