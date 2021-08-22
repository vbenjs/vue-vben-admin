<template>
  <PageWrapper title="PDF示例">
    <template #headerContent>
      <div class="flex justify-between items-center">
        <span class="flex-1">
          <div
            >使用 <a href="https://github.com/Hopding/pdf-lib" target="_blank">pdf-lib</a>、<a
              href="https://github.com/mozilla/pdfjs-dist"
              target="_blank"
              >pdfjs-dist</a
            >,
          </div>
          <div
            >原型来自插件
            <a href="https://github.com/Lanseria/vue-pdf-useinvite" target="_blank"
              >Lanseria/vue-pdf-useinvite</a
            >,
          </div>
          <div>
            更多详情请关注
            <a href="https://github.com/Lanseria/vue-pdf-useinvite/issues/1" target="_blank"
              >vue-pdf-useinvite/issues/1</a
            >,
            <a href="https://github.com/anncwb/vue-vben-admin/issues/1064" target="_blank"
              >ssues/1064</a
            >,
          </div>
          <div
            >示例文件引用参考
            <a href="https://cn.vitejs.dev/guide/assets.html" target="_blank"
              >vite静态资源处理</a
            ></div
          >
        </span>
      </div>
    </template>
    <PdfViewer src="pdf-sample.pdf" />
    <PdfEditor src="pdf-sample.pdf" />
    <!-- <PdfEditor src="http://183.131.134.242:1889/files/20210619/383518b085f9469eb9ec34594196f8c7.pdf"></PdfEditor> -->
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { PdfViewer } from './Pdf';
  import { PdfEditor } from './Pdf';

  // import test from "./pdf-sample.pdf?url"; // 放public路径下, 设置【?url】https://cn.vitejs.dev/guide/assets.html

  export default defineComponent({
    name: 'PdfDemo',
    components: {
      PageWrapper,
      PdfEditor,
      PdfViewer,
    },
    setup() {
      return {
        // test,
      };
    },
  });
</script>
