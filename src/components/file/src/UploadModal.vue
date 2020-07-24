<script lang="tsx">
  import { defineComponent, reactive, unref, computed } from 'compatible-vue';
  import { Upload, Button } from 'ant-design-vue';
  import { UploadFile } from 'ant-design-vue/types/upload';
  import { BasicModal, useModal } from '@/components/modal/index';
  import { Icon } from '@/components/icon/index';
  import { useMessage } from '@/hooks/core/useMessage';
  import { basicProps } from './props';
  import { BasicProps, UploadResult } from './types';
  export default defineComponent({
    name: 'UploadModal',
    props: basicProps,
    setup(props: BasicProps, { listeners, emit }) {
      const state = reactive<{
        fileList: UploadFile<UploadResult>[];
        previewImage: boolean;
      }>({
        fileList: [],
        previewImage: false,
      });
      const getAccept = computed(() => {
        if (!props.accept || props.accept.length === 0) {
          if (props.uploadImg) {
            return ['jpg', 'jpeg', 'png'];
          } else {
            // return ['jpg', 'jpeg', 'png', 'gif', 'txt', 'doc', 'docx', 'xls', 'xlsx', 'xml'];
            return [];
          }
        }
        return props.accept;
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

      // 文件类型限制
      const getStringAccept = computed(() => {
        return unref(getAccept)
          .map((item) => `.${item}`)
          .join(',');
      });
      // 限制上传的图片
      function beforeUpload(file) {
        const { maxSize } = props;
        const accept = unref(getAccept);
        let isType = true;
        let isLtMB = true;

        // 设置最大值，则判断
        if (maxSize) {
          isLtMB = file.size / 1024 / 1024 < maxSize;
          if (!isLtMB) {
            createMessage.error(`只能上传小于${maxSize}MB的文件!`);
          }
        }
        // 设置类型,则判断
        if (accept.length > 0) {
          const newTypes = accept.join('|');
          // const reg = /\.(jpg|jpeg|png|gif|txt|doc|docx|xls|xlsx|xml)$/i;
          const reg = new RegExp('\\.(' + newTypes + ')$', 'i');
          isType = reg.test(file.name);

          if (!isType) {
            createMessage.error!(`只能上传${accept.join(',')}格式文件`);
          }
        }

        return isType && isLtMB;
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
        // const reg = /\.(jpg|jpeg|png|gif|txt|doc|docx|xls|xlsx|xml)$/i;
        const reg = new RegExp('\\.(' + ['jpg', 'jpeg', 'png', 'gif'].join('|') + ')$', 'i');
        const isType = reg.test(file.name);
        if (!isType) {
          return;
        }
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        state.previewImage = file.url || file.preview;
        openModal({
          visible: true,
        });
      }
      // 点击保存
      const getFileList = computed(() => {
        return state.fileList
          .filter((file) => {
            return file.status === 'done' && file.response;
          })
          .map((file) => {
            return file.response;
          });
      });

      function handleOk() {
        const isAllUpload = state.fileList.every((file) => {
          const { status } = file;
          return status !== 'uploading';
        });
        if (isAllUpload) {
          // 返回上传成功的图片
          emit('change', unref(getFileList));
        } else {
          createMessage.warning('请等待文件上传完毕');
        }
      }
      function handleCloseFunc() {
        return new Promise((resolve) => {
          if (!state.fileList || state.fileList.length === 0) {
            emit('change', []);
            resolve(true);
          }
          const isAllUpload = state.fileList.every((file) => {
            const { status } = file;
            return status !== 'uploading';
          });
          if (!isAllUpload) {
            createConfirm({
              iconType: 'warning',
              title: '温馨提醒',
              content: '正在上传中，是否继续关闭?',
              onOk: () => {
                emit('change', unref(getFileList));
                // state.fileList = [];
                resolve(true);
              },
            });
          } else {
            emit('change', unref(getFileList));
            // state.fileList = [];
            resolve(true);
          }
        });
      }

      return () => (
        <BasicModal
          title="上传"
          width={600}
          closeFunc={handleCloseFunc}
          maskClosable={false}
          on={{ ...listeners, ok: handleOk }}
        >
          <p>{unref(getHelpText)}</p>
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            list-type={props.uploadImg ? 'picture-card' : 'text'}
            accept={unref(getStringAccept)}
            multiple={props.multiple}
            file-list={state.fileList}
            before-upload={beforeUpload}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            {state.fileList.length <= props.maxNumber || !props.maxNumber ? (
              props.uploadImg ? (
                <div>
                  <Icon type="plus" />
                  <div class="ant-upload-text">上传</div>
                </div>
              ) : (
                <Button type="primary">上传</Button>
              )
            ) : null}
          </Upload>
          {!unref(isFirstLoadRef) && (
            <BasicModal title="预览图片" width={600} onRegister={register} footer={null}>
              <img alt="预览图片" style="width: 100%" src={state.previewImage} />
            </BasicModal>
          )}
        </BasicModal>
      );
    },
  });
</script>
