<script lang="tsx">
  import { defineComponent, unref, reactive } from 'compatible-vue';
  import { Button } from 'ant-design-vue';
  // import { UploadFile } from 'ant-design-vue/types/upload';

  import { useModal } from '@/components/modal/index';

  import UploadModal from './UploadModal.vue';
  import UploadPreviewModal from './UploadPreviewModal.vue';

  import { UploadResult, UploadContainerProps } from './types';
  import { uploadContainerProps } from './props';

  export default defineComponent({
    name: 'UploadContainer',
    props: uploadContainerProps,
    setup(props: UploadContainerProps, { emit }) {
      const state = reactive<{ fileList: Array<UploadResult> }>({
        fileList: [],
      });
      const [register, { isFirstLoadRef, openModal }] = useModal();
      const [registerPv, { isFirstLoadRef: isFirstLoadRefPv, openModal: openModalPv }] = useModal();

      // 上传完成
      function handleChange(fileList: UploadResult[]) {
        if (fileList) {
          state.fileList = fileList;
        }
        emit('change', state.fileList);
        openModal({
          visible: false,
        });
      }

      return () => (
        <div class="m-4">
          <Button
            class="mr-4"
            type="primary"
            onClick={() => {
              openModal({
                visible: true,
              });
            }}
          >
            上传
          </Button>
          <Button
            class="mr-4"
            onClick={() => {
              openModalPv({
                visible: true,
              });
            }}
          >
            预览
          </Button>
          {!unref(isFirstLoadRef) && (
            <UploadModal props={props} onRegister={register} onChange={handleChange} />
          )}
          {!unref(isFirstLoadRefPv) && (
            <UploadPreviewModal
              props={{ ...props, priviewList: state.fileList }}
              onRegister={registerPv}
            />
          )}
        </div>
      );
    },
  });
</script>
