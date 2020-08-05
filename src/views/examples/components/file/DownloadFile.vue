<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { Alert } from 'ant-design-vue';
  import { downloadByUrl, downloadByData } from '@/components/file/index';
  // import { downloadApi } from '@/api/demo/file';

  export default defineComponent({
    name: 'ComponentBaseDemo',
    setup() {
      async function handleDownload() {
        // const data = await downloadApi();
        downloadByData('测试二进制流下载', 'testName.txt');
      }
      return () => (
        <div class="p-4">
          <Alert message="根据后台接口文件流下载" />
          <a-button type="primary" class="my-4" onClick={handleDownload}>
            文件流下载
          </a-button>
          <Alert message="根据文件地址下载文件" />
          <a-button
            type="primary"
            class="my-4"
            onClick={() => {
              downloadByUrl(
                'https://codeload.github.com/anncwb/vue-vben-admin-doc/zip/master',
                '_self'
              );
            }}
          >
            文件地址下载
          </a-button>
        </div>
      );
    },
  });
</script>
