<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { Alert } from 'ant-design-vue';
  import { UploadContainer } from '@/components/file/index';

  export default defineComponent({
    name: 'UploadImageDemo',
    setup() {
      function handleImgChange(fileList) {
        console.log('---img----');
        console.log(fileList);
      }
      function handleFileChange(fileList) {
        console.log('---file----');
        console.log(fileList);
      }
      return () => (
        <div class="m-4">
          <Alert message="上传与预览功能，默认图片上传" />
          <UploadContainer maxSize={1} maxNumber={3} onChange={handleImgChange} class="m-4" />
          <Alert message="上传与预览功能，文件上传" />
          <UploadContainer
            class="m-4"
            maxSize={2}
            maxNumber={20}
            isUploadImg={false}
            onChange={handleFileChange}
          />
        </div>
      );
    },
  });
</script>
