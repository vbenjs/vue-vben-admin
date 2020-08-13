<script lang="tsx">
  import { defineComponent, unref, reactive, watch } from 'compatible-vue';

  // import { UploadFile } from 'ant-design-vue/types/upload';

  import { useModal } from '@/components/modal/index';

  import UploadModal from './UploadModal.vue';
  import UploadPreviewModal from './UploadPreviewModal.vue';

  import { UploadResult, UploadContainerProps } from './types';
  import { uploadContainerProps } from './props';

  export default defineComponent({
    name: 'UploadContainer',
    props: uploadContainerProps,
    setup(props: UploadContainerProps, { emit, attrs }) {
      const state = reactive<{ fileList: Array<UploadResult> }>({
        fileList: [],
      });
      const [register, { isFirstLoadRef, openModal }] = useModal();
      const [registerPv, { isFirstLoadRef: isFirstLoadRefPv, openModal: openModalPv }] = useModal();

      // 上传完成
      function handleChange(fileList: UploadResult[]) {
        if (fileList && fileList.length > 0) {
          state.fileList = [...state.fileList, ...fileList];
        }
        emit('change', state.fileList);
        openModal({
          visible: false,
        });
      }
      // 预览modal
      function handlePreviewChange(fileList: UploadResult[] = []) {
        // console.log(fileList);
        // if (fileList && fileList.length > 0) {
        state.fileList = [...fileList];
        // }
        emit('change', state.fileList);
        openModalPv({
          visible: false,
        });
      }
      watch(
        () => props.value,
        (value) => {
          if (value && value.length > 0) {
            state.fileList = [...value];
          }
        },
        { immediate: true }
      );

      return () => (
        <div {...attrs}>
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
              isUploadImg={props.isUploadImg}
              priviewList={state.fileList}
              onRegister={registerPv}
              onChange={handlePreviewChange}
            />
          )}
        </div>
      );
    },
  });
</script>
