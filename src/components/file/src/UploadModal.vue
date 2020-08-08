<script lang="tsx">
  import { defineComponent, reactive, unref, computed } from 'compatible-vue';
  import { Upload } from 'ant-design-vue';
  // import { UploadFile } from 'ant-design-vue/types/upload';
  import { BasicModal } from '@/components/modal/index';
  import { Icon } from '@/components/icon/index';
  import { useMessage } from '@/hooks/core/useMessage';
  import { basicProps } from './props';
  import { BasicProps, UploadResultStatus, VaFile, UploadResult } from './types';
  import { getBase64, checkImgType, checkFileType, generateFormData } from './utils';
  import { createImgPreview } from '@/components/preview/index';
  import { uploadApi } from '@/api/demo/file';
  // import { UploadResult } from '@/api/demo/model/fileModel';

  export default defineComponent({
    name: 'UploadModal',
    props: basicProps,
    setup(props: BasicProps, { listeners, emit }) {
      const state = reactive<{
        fileList: VaFile[];
        isAllUpload: boolean;
      }>({
        fileList: [],
        isAllUpload: true,
      });
      const getConfirmLoading = computed(() => {
        return !state.isAllUpload;
      });
      // 文件类型限制
      const getAccept = computed(() => {
        if (props.accept && props.accept.length > 0) {
          return props.accept;
        }
        if (props.isUploadImg) {
          return ['jpg', 'jpeg', 'png', 'gif'];
        }
        return [];
      });
      const getStringAccept = computed(() => {
        return unref(getAccept)
          .map((item) => `.${item}`)
          .join(',');
      });
      // 支持jpg、jpeg、png格式，单次可最多选择10张图片，每张不可大于2M。
      const getHelpText = computed(() => {
        if (props.helpText) {
          return props.helpText;
        }
        const helpTexts: string[] = [];
        if (unref(getAccept).length > 0) {
          helpTexts.push(`支持${unref(getAccept).join('，')}格式`);
        }
        if (props.maxNumber) {
          helpTexts.push(`单次可最多选择${props.maxNumber}个文件`);
        }
        if (props.maxSize) {
          helpTexts.push(`单个文件不可大于${props.maxSize}MB`);
        }
        return helpTexts.join('，');
      });

      const { createMessage, createConfirm } = useMessage();
      // const { createMessage } = useMessage();

      // 上传前校验
      function beforeUpload(file) {
        const { maxSize } = props;
        const accept = unref(getAccept);

        // 设置最大值，则判断
        if (maxSize && file.size / 1024 / 1024 >= maxSize) {
          createMessage.error(`只能上传小于${maxSize}MB的文件!`);
          return false;
        }

        // 设置类型,则判断
        if (accept.length > 0 && !checkFileType(file, accept)) {
          createMessage.error!(`只能上传${accept.join(',')}格式文件`);
          return false;
        }
        // 生成图片缩略图
        if (checkImgType(file) && !file.thumbUrl) {
          // beforeUpload，如果异步会调用自带上传方法
          // file.thumbUrl = await getBase64(file);
          getBase64(file).then(({ result: thumbUrl, file: realFile }) => {
            const index = state.fileList.findIndex((file) => {
              return file.name === realFile.name && file.type === realFile.type;
            });
            if (index !== -1) {
              state.fileList[index].thumbUrl = thumbUrl;
              // 数组双向绑定需要重新，赋值
              state.fileList = state.fileList.slice(0);
            }
          });
        }
        state.fileList = [...state.fileList, file];
        // return isType && isLtMB;
        return false;
      }

      async function handlePreview(file) {
        if (!checkImgType(file)) {
          return;
        }
        if (!file.url && !file.thumbUrl && !file.preview) {
          const { result } = await getBase64(file);
          file.preview = result;
        }
        const previewImage = file.url || file.thumbUrl || file.preview;
        createImgPreview({ imageList: [previewImage] });
      }
      // TODO: 具体接口格式在调整;增加自定义请求props；增加disabled
      async function handleOk() {
        state.isAllUpload = false;
        const formData = generateFormData({
          fileList: state.fileList,
          data: {},
        });
        // console.log(formData);
        try {
          const uploadResultList: UploadResult[] = await uploadApi({
            formData,
            total: state.fileList.length,
          });
          // console.log(uploadResultList);
          const errorList = uploadResultList.filter((file) => {
            return file.status === UploadResultStatus.ERROR;
          });
          const successList = uploadResultList.filter((file) => {
            return file.status === UploadResultStatus.SUCCESS;
          });
          if (errorList.length > 0) {
            const errorNames = errorList.map((file) => {
              return file.name;
            });
            createMessage.warning(`${errorNames.join(',')}上传失败`);
          } else {
            createMessage.warning('文件全部上传成功');
          }
          state.fileList = [];
          emit('change', successList);
        } catch (e) {
          console.log(e);
        } finally {
          state.fileList = [];
          state.isAllUpload = true;
        }
      }
      // TODO:关闭，是要中止上传，还是等到接口完成
      function handleCloseFunc() {
        return new Promise((resolve) => {
          if (!state.isAllUpload) {
            createConfirm({
              iconType: 'warning',
              title: '温馨提醒',
              content: '正在上传中，是否中止上传?',
              onOk: () => {
                // emit('change',[]);
                state.fileList = [];
                resolve(true);
              },
            });
          } else {
            // emit('change', unref(getFileList));
            state.fileList = [];
            resolve(true);
          }
        });
      }
      function handleRemove(file) {
        const index = state.fileList.indexOf(file);
        const newFileList = state.fileList.slice();
        newFileList.splice(index, 1);
        state.fileList = newFileList;
      }
      return () => {
        return (
          <BasicModal
            title="上传"
            width={600}
            maskClosable={false}
            closeFunc={handleCloseFunc}
            confirmLoading={unref(getConfirmLoading)}
            on={{ ...listeners, ok: handleOk }}
          >
            <p>{unref(getHelpText)}</p>
            <Upload
              list-type={props.isUploadImg ? 'picture-card' : 'text'}
              accept={unref(getStringAccept)}
              multiple={props.multiple}
              file-list={state.fileList}
              before-upload={beforeUpload}
              onPreview={handlePreview}
              remove={handleRemove}
            >
              {state.fileList.length < props.maxNumber || !props.maxNumber ? (
                props.isUploadImg ? (
                  <div>
                    <Icon type="plus" />
                    <div class="ant-upload-text">上传</div>
                  </div>
                ) : (
                  <a-button type="primary">上传</a-button>
                )
              ) : null}
            </Upload>
          </BasicModal>
        );
      };
    },
  });
</script>
