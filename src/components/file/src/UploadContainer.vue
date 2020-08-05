<script lang="tsx">
  import { defineComponent, unref, reactive } from 'compatible-vue';

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
          <a-button-group>
            <a-button
              onClick={() => {
                openModal({
                  visible: true,
                });
              }}
            >
              上传
            </a-button>
            <a-button
              icon="eye"
              onClick={() => {
                openModalPv({
                  visible: true,
                });
              }}
            ></a-button>
          </a-button-group>

          {!unref(isFirstLoadRef) && (
            <UploadModal props={props} onRegister={register} onChange={handleChange} />
          )}
          {!unref(isFirstLoadRefPv) && (
            <UploadPreviewModal
              uploadImg={props.uploadImg}
              priviewList={[...state.fileList, ...props.priviewList]}
              onRegister={registerPv}
            />
          )}
        </div>
      );
    },
  });
</script>
