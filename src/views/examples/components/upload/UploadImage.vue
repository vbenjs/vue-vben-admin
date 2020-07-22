<script lang="tsx">
  import { defineComponent, unref } from 'compatible-vue';
  import { Button } from 'ant-design-vue';
  import { useModal } from '@/components/modal/index';
  import { UploadImageModal } from '@/components/upload/index';

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
          <Button
            class="m-4"
            type="primary"
            onClick={() => {
              openModal({
                visible: true,
              });
            }}
          >
            上传
          </Button>
          {!unref(isFirstLoadRef) && (
            <UploadImageModal onRegister={register} onChange={handleChange} />
          )}
        </div>
      );
    },
  });
</script>
