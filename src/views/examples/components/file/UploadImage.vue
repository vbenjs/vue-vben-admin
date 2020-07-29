<script lang="tsx">
  import { defineComponent, unref } from 'compatible-vue';
  import { Button, Alert } from 'ant-design-vue';
  import { useModal } from '@/components/modal/index';
  import { UploadModal, UploadContainer } from '@/components/file/index';

  export default defineComponent({
    name: 'UploadImageDemo',
    setup() {
      const [register, { isFirstLoadRef, openModal }] = useModal();
      function handleChange(fileList) {
        console.log('fileList', fileList);
        openModal({
          visible: false,
        });
      }

      return () => (
        <div class="m-4">
          <Alert message="单独的上传按钮" />
          <Button
            class="m-4"
            onClick={() => {
              openModal({
                visible: true,
              });
            }}
          >
            上传
          </Button>
          {!unref(isFirstLoadRef) && <UploadModal onRegister={register} onChange={handleChange} />}
          <div>
            <Alert message="上传与预览功能，默认图片上传" />
            <UploadContainer
              maxSize={1}
              maxNumber={3}
              priviewList={[
                {
                  name: 'image0',
                  status: 'done',
                  thumbUrl: '',
                  url:
                    'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                },
                {
                  name: 'image1',
                  status: 'done',
                  thumbUrl: '',
                  url: 'https://picsum.photos/id/66/346/216',
                },
                {
                  name: 'image2',
                  status: 'done',
                  thumbUrl: '',
                  url: 'https://picsum.photos/id/67/346/216',
                },
                {
                  name: 'image3',
                  status: 'done',
                  thumbUrl: '',
                  url: 'https://picsum.photos/id/68/346/216',
                },
              ]}
            />
            <Alert message="上传与预览功能，文件上传" />
            <UploadContainer maxSize={2} maxNumber={10} uploadImg={false} />
          </div>
        </div>
      );
    },
  });
</script>
