<template>
  <PageWrapper title="文件下载示例">
    <Alert message="根据后台接口文件流下载" />
    <a-button type="primary" class="my-4" @click="handleDownByData"> 文件流下载 </a-button>

    <Alert message="根据文件地址下载文件" />
    <a-button type="primary" class="my-4" @click="handleDownloadByUrl"> 文件地址下载 </a-button>

    <Alert message="base64流下载" />
    <a-button type="primary" class="my-4" @click="handleDownloadByBase64"> base64流下载 </a-button>

    <Alert message="图片Url下载,如果有跨域问题，需要处理图片跨域" />
    <a-button type="primary" class="my-4" @click="handleDownloadByOnlineUrl">
      图片Url下载
    </a-button>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import {
    downloadByUrl,
    downloadByData,
    downloadByBase64,
    downloadByOnlineUrl,
  } from '@/utils/file/download';
  import imgBase64 from './imgBase64';
  import { PageWrapper } from '@/components/Page';
  import { Alert } from 'ant-design-vue';

  function handleDownByData() {
    downloadByData('text content', 'testName.txt');
  }
  function handleDownloadByUrl() {
    downloadByUrl({
      url: 'https://codeload.github.com/anncwb/vue-vben-admin-doc/zip/master',
      target: '_self',
    });

    downloadByUrl({
      url: 'https://vebn.oss-cn-beijing.aliyuncs.com/vben/logo.png',
      target: '_self',
    });
  }

  function handleDownloadByBase64() {
    downloadByBase64(imgBase64, 'logo.png');
  }

  function handleDownloadByOnlineUrl() {
    downloadByOnlineUrl(
      'https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5944817f47b8408e9f1442ece49d68ca~tplv-k3u1fbpfcp-watermark.image',
      'logo.png',
    );
  }
</script>
