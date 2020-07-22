<script lang="tsx">
  import { defineComponent, reactive, unref, computed } from 'compatible-vue';
  import { Upload } from 'ant-design-vue';
  import { UploadFile } from 'ant-design-vue/types/upload';
  import { BasicModal, useModal } from '@/components/modal/index';
  import { Icon } from '@/components/icon/index';
  import { useMessage } from '@/hooks/core/useMessage';
  import { basicProps } from './props';
  import { BasicProps } from './types';
  export default defineComponent({
    name: 'UploadImage',
    props: basicProps,
    setup(props: BasicProps, { listeners, emit }) {
      const state = reactive<{
        fileList: UploadFile[];
        previewImage: false;
      }>({
        fileList: [],
        previewImage: false,
      });

      const { createMessage } = useMessage();

      // 文件类型限制
      const getAccept = computed(() => {
        return props.accept.map((item) => `.${item}`).join(',');
      });
      // 限制上传的图片
      function beforeUpload(file) {
        const { maxSize, accept } = props;
        const newTypes = accept.join('|');
        // const reg = /\.(jpg|jpeg|png|gif|txt|doc|docx|xls|xlsx|xml)$/i;
        const reg = new RegExp('\\.(' + newTypes + ')$', 'i');
        const isType = reg.test(file.name);
        // const isType = types.includes(file.type);
        if (!isType) {
          createMessage.error!(`只能上传${accept.join(',')}格式文件`);
        }

        const isLt2M = file.size / 1024 / 1024 < maxSize;
        if (!isLt2M) {
          createMessage.error(`只能上传小于${maxSize}MB的图片!`);
        }
        return isType && isLt2M;
      }

      function handleChange({ fileList }) {
        state.fileList = fileList;
      }
      // 预览图片
      const [register, { isFirstLoadRef, openModal }] = useModal();

      function getBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      }
      async function handlePreview(file) {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        state.previewImage = file.url || file.preview;
        openModal({
          visible: true,
        });
      }
      // 点击保存
      function handleOk() {
        const isAllUpload = state.fileList.every((file) => {
          const { status } = file;
          return status !== 'uploading';
        });
        if (isAllUpload) {
          // 返回上传成功的图片
          emit(
            'change',
            state.fileList.filter((file) => {
              return file.status === 'done';
            })
          );
        } else {
          createMessage.warning('请等待图片上传完毕');
        }
      }

      return () => (
        <BasicModal title="上传图片" on={{ ...listeners, ok: handleOk }}>
          <p>{props.helpText}</p>
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            list-type="picture-card"
            accept={unref(getAccept)}
            file-list={state.fileList}
            before-upload={beforeUpload}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            {state.fileList.length <= props.maxNumber && (
              <div>
                <Icon type="plus" />
                <div class="ant-upload-text">上传</div>
              </div>
            )}
          </Upload>
          {!unref(isFirstLoadRef) && (
            <BasicModal title="预览图片" onRegister={register} footer={null}>
              <img alt="预览图片" style="width: 100%" src={state.previewImage} />
            </BasicModal>
          )}
        </BasicModal>
      );
    },
  });
</script>
