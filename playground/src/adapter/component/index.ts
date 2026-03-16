/**
 * 通用组件共同的使用的基础组件，原先放在 adapter/form 内部，限制了使用范围，这里提取出来，方便其他地方使用
 * 可用于 vben-form、vben-modal、vben-drawer 等组件使用,
 */

/* eslint-disable vue/one-component-per-file */

import type {
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from 'ant-design-vue';

import type { Component, Ref } from 'vue';

import type { BaseFormComponentType } from '@vben/common-ui';
import type { Sortable } from '@vben/hooks';
import type { Recordable } from '@vben/types';

import {
  computed,
  defineAsyncComponent,
  defineComponent,
  h,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  render,
  unref,
  watch,
} from 'vue';

import {
  ApiComponent,
  globalShareState,
  IconPicker,
  VCropper,
} from '@vben/common-ui';
import { useSortable } from '@vben/hooks';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';
import { isEmpty } from '@vben/utils';

import { message, Modal, notification } from 'ant-design-vue';

const AutoComplete = defineAsyncComponent(
  () => import('ant-design-vue/es/auto-complete'),
);
const Button = defineAsyncComponent(() => import('ant-design-vue/es/button'));
const Checkbox = defineAsyncComponent(
  () => import('ant-design-vue/es/checkbox'),
);
const CheckboxGroup = defineAsyncComponent(() =>
  import('ant-design-vue/es/checkbox').then((res) => res.CheckboxGroup),
);
const DatePicker = defineAsyncComponent(
  () => import('ant-design-vue/es/date-picker'),
);
const Divider = defineAsyncComponent(() => import('ant-design-vue/es/divider'));
const Input = defineAsyncComponent(() => import('ant-design-vue/es/input'));
const InputNumber = defineAsyncComponent(
  () => import('ant-design-vue/es/input-number'),
);
const InputPassword = defineAsyncComponent(() =>
  import('ant-design-vue/es/input').then((res) => res.InputPassword),
);
const Mentions = defineAsyncComponent(
  () => import('ant-design-vue/es/mentions'),
);
const Radio = defineAsyncComponent(() => import('ant-design-vue/es/radio'));
const RadioGroup = defineAsyncComponent(() =>
  import('ant-design-vue/es/radio').then((res) => res.RadioGroup),
);
const RangePicker = defineAsyncComponent(() =>
  import('ant-design-vue/es/date-picker').then((res) => res.RangePicker),
);
const Rate = defineAsyncComponent(() => import('ant-design-vue/es/rate'));
const Select = defineAsyncComponent(() => import('ant-design-vue/es/select'));
const Space = defineAsyncComponent(() => import('ant-design-vue/es/space'));
const Switch = defineAsyncComponent(() => import('ant-design-vue/es/switch'));
const Textarea = defineAsyncComponent(() =>
  import('ant-design-vue/es/input').then((res) => res.Textarea),
);
const TimePicker = defineAsyncComponent(
  () => import('ant-design-vue/es/time-picker'),
);
const TreeSelect = defineAsyncComponent(
  () => import('ant-design-vue/es/tree-select'),
);
const Cascader = defineAsyncComponent(
  () => import('ant-design-vue/es/cascader'),
);
const Upload = defineAsyncComponent(() => import('ant-design-vue/es/upload'));
const Image = defineAsyncComponent(() => import('ant-design-vue/es/image'));
const PreviewGroup = defineAsyncComponent(() =>
  import('ant-design-vue/es/image').then((res) => res.ImagePreviewGroup),
);

const withDefaultPlaceholder = <T extends Component>(
  component: T,
  type: 'input' | 'select',
  componentProps: Recordable<any> = {},
) => {
  return defineComponent({
    name: component.name,
    inheritAttrs: false,
    setup: (props: any, { attrs, expose, slots }) => {
      const placeholder =
        props?.placeholder ||
        attrs?.placeholder ||
        $t(`ui.placeholder.${type}`);
      // 透传组件暴露的方法
      const innerRef = ref();
      expose(
        new Proxy(
          {},
          {
            get: (_target, key) => innerRef.value?.[key],
            has: (_target, key) => key in (innerRef.value || {}),
          },
        ),
      );
      return () =>
        h(
          component,
          { ...componentProps, placeholder, ...props, ...attrs, ref: innerRef },
          slots,
        );
    },
  });
};

const IMAGE_EXTENSIONS = new Set([
  'bmp',
  'gif',
  'jpeg',
  'jpg',
  'png',
  'svg',
  'webp',
]);

/**
 * 检查是否为图片文件
 */
function isImageFile(file: UploadFile): boolean {
  if (file.url) {
    try {
      const pathname = new URL(file.url, 'http://localhost').pathname;
      const ext = pathname.split('.').pop()?.toLowerCase();
      return ext ? IMAGE_EXTENSIONS.has(ext) : false;
    } catch {
      const ext = file.url?.split('.').pop()?.toLowerCase();
      return ext ? IMAGE_EXTENSIONS.has(ext) : false;
    }
  }
  if (!file.type) {
    const ext = file.name?.split('.').pop()?.toLowerCase();
    return ext ? IMAGE_EXTENSIONS.has(ext) : false;
  }
  return file.type.startsWith('image/');
}

/**
 * 创建默认的上传按钮插槽
 */
function createDefaultUploadSlots(listType: string, placeholder: string) {
  if (listType === 'picture-card') {
    return { default: () => placeholder };
  }
  return {
    default: () =>
      h(
        Button,
        {
          icon: h(IconifyIcon, {
            icon: 'ant-design:upload-outlined',
            class: 'mb-1 size-4',
          }),
        },
        () => placeholder,
      ),
  };
}

/**
 * 获取文件的 Base64
 */
function getBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => resolve(reader.result as string));
    reader.addEventListener('error', reject);
  });
}

/**
 * 预览图片
 */
async function previewImage(
  file: UploadFile,
  visible: Ref<boolean>,
  fileList: Ref<UploadProps['fileList']>,
) {
  // 非图片文件直接打开链接
  if (!isImageFile(file)) {
    const url = file.url || file.preview;
    if (url) {
      window.open(url, '_blank');
    } else {
      message.error($t('ui.formRules.previewWarning'));
    }
    return;
  }

  const [ImageComponent, PreviewGroupComponent] = await Promise.all([
    Image,
    PreviewGroup,
  ]);

  // 过滤图片文件并生成预览
  const imageFiles = (unref(fileList) || []).filter((f) => isImageFile(f));

  for (const imgFile of imageFiles) {
    if (!imgFile.url && !imgFile.preview && imgFile.originFileObj) {
      imgFile.preview = await getBase64(imgFile.originFileObj);
    }
  }

  const container = document.createElement('div');
  document.body.append(container);
  let isUnmounted = false;

  const currentIndex = imageFiles.findIndex((f) => f.uid === file.uid);

  const PreviewWrapper = {
    setup() {
      return () => {
        if (isUnmounted) return null;
        return h(
          PreviewGroupComponent,
          {
            class: 'hidden',
            preview: {
              visible: visible.value,
              current: currentIndex,
              onVisibleChange: (value: boolean) => {
                visible.value = value;
                if (!value) {
                  setTimeout(() => {
                    if (!isUnmounted && container) {
                      isUnmounted = true;
                      render(null, container);
                      container.remove();
                    }
                  }, 300);
                }
              },
            },
          },
          () =>
            imageFiles.map((imgFile) =>
              h(ImageComponent, {
                key: imgFile.uid,
                src: imgFile.url || imgFile.preview,
              }),
            ),
        );
      };
    },
  };

  render(h(PreviewWrapper), container);
}

/**
 * 图片裁剪操作
 */
function cropImage(file: File, aspectRatio: string | undefined) {
  return new Promise<Blob | string | undefined>((resolve, reject) => {
    const container = document.createElement('div');
    document.body.append(container);

    let isUnmounted = false;
    let objectUrl: null | string = null;

    const open = ref<boolean>(true);
    const cropperRef = ref<InstanceType<typeof VCropper> | null>(null);

    const closeModal = () => {
      open.value = false;
      setTimeout(() => {
        if (!isUnmounted && container) {
          if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
          }
          isUnmounted = true;
          render(null, container);
          container.remove();
        }
      }, 300);
    };

    const CropperWrapper = {
      setup() {
        return () => {
          if (isUnmounted) return null;
          if (!objectUrl) {
            objectUrl = URL.createObjectURL(file);
          }
          return h(
            Modal,
            {
              open: open.value,
              title: h('div', {}, [
                $t('ui.crop.title'),
                h(
                  'span',
                  {
                    class: `${aspectRatio ? '' : 'hidden'} ml-2 text-sm text-gray-400 font-normal`,
                  },
                  $t('ui.crop.titleTip', [aspectRatio]),
                ),
              ]),
              centered: true,
              width: 548,
              keyboard: false,
              maskClosable: false,
              closable: false,
              cancelText: $t('common.cancel'),
              okText: $t('ui.crop.confirm'),
              destroyOnClose: true,
              onOk: async () => {
                const cropper = cropperRef.value;
                if (!cropper) {
                  reject(new Error('Cropper not found'));
                  closeModal();
                  return;
                }
                try {
                  const dataUrl = await cropper.getCropImage();
                  if (dataUrl) {
                    resolve(dataUrl);
                  } else {
                    reject(new Error($t('ui.crop.errorTip')));
                  }
                } catch {
                  reject(new Error($t('ui.crop.errorTip')));
                } finally {
                  closeModal();
                }
              },
              onCancel() {
                resolve('');
                closeModal();
              },
            },
            () =>
              h(VCropper, {
                ref: (ref: any) => (cropperRef.value = ref),
                img: objectUrl as string,
                aspectRatio,
              }),
          );
        };
      },
    };

    render(h(CropperWrapper), container);
  });
}

/**
 * 带预览功能的上传组件
 */
const withPreviewUpload = () => {
  return defineComponent({
    name: Upload.name,
    emits: ['update:modelValue'],
    setup(
      props: any,
      { attrs, slots, emit }: { attrs: any; emit: any; slots: any },
    ) {
      const previewVisible = ref<boolean>(false);
      const placeholder = attrs?.placeholder || $t('ui.placeholder.upload');
      const listType = attrs?.listType || attrs?.['list-type'] || 'text';
      const fileList = ref<UploadProps['fileList']>(
        attrs?.fileList || attrs?.['file-list'] || [],
      );

      const maxSize = computed(() => attrs?.maxSize ?? attrs?.['max-size']);
      const aspectRatio = computed(
        () => attrs?.aspectRatio ?? attrs?.['aspect-ratio'],
      );

      const handleBeforeUpload = async (
        file: UploadFile,
        originFileList: Array<File>,
      ) => {
        // 文件大小限制
        if (maxSize.value && (file.size || 0) / 1024 / 1024 > maxSize.value) {
          message.error($t('ui.formRules.sizeLimit', [maxSize.value]));
          file.status = 'removed';
          return false;
        }

        // 图片裁剪处理
        if (
          attrs.crop &&
          !attrs.multiple &&
          originFileList[0] &&
          isImageFile(file)
        ) {
          file.status = 'removed';
          const blob = await cropImage(originFileList[0], aspectRatio.value);
          if (!blob) {
            throw new Error($t('ui.crop.errorTip'));
          }
          return blob;
        }

        return attrs.beforeUpload?.(file) ?? true;
      };

      const handleChange = (event: UploadChangeParam) => {
        try {
          attrs.handleChange?.(event);
          attrs.onHandleChange?.(event);
        } catch (error) {
          console.error(error);
        }
        fileList.value = event.fileList.filter(
          (file) => file.status !== 'removed',
        );
        emit(
          'update:modelValue',
          event.fileList?.length ? fileList.value : undefined,
        );
      };

      const handlePreview = async (file: UploadFile) => {
        previewVisible.value = true;
        await previewImage(file, previewVisible, fileList);
      };

      const renderUploadButton = () => {
        if (attrs.disabled) return null;
        return isEmpty(slots)
          ? createDefaultUploadSlots(listType, placeholder)
          : slots;
      };

      // 拖拽排序
      const draggable = computed(
        () => (attrs.draggable ?? false) && !attrs.disabled,
      );
      const uploadId = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const sortableInstance = ref<null | Sortable>(null);

      const styleId = `upload-drag-style-${uploadId}`;

      function injectDragStyle() {
        if (!document.querySelector(`[id="${styleId}"]`)) {
          const style = document.createElement('style');
          style.id = styleId;
          style.textContent = `
            [data-upload-id="${uploadId}"] .ant-upload-list-item { cursor: move; }
            [data-upload-id="${uploadId}"] .ant-upload-list-item:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
          `;
          document.head.append(style);
        }
      }

      function removeDragStyle() {
        document.querySelector(`[id="${styleId}"]`)?.remove();
      }

      async function initSortable(retryCount = 0) {
        if (!draggable.value) return;

        injectDragStyle();
        await nextTick();
        await new Promise((resolve) => setTimeout(resolve, 100));

        const container = document.querySelector(
          `[data-upload-id="${uploadId}"] .ant-upload-list`,
        ) as HTMLElement;

        if (!container) {
          if (retryCount < 5) {
            setTimeout(() => initSortable(retryCount + 1), 200);
          }
          return;
        }

        const { initializeSortable } = useSortable(container, {
          animation: 300,
          delay: 400,
          delayOnTouchOnly: true,
          filter:
            '.ant-upload-select, .ant-upload-list-item-error, .ant-upload-list-item-uploading',
          onEnd: (evt) => {
            const { oldIndex, newIndex } = evt;
            if (
              oldIndex === undefined ||
              newIndex === undefined ||
              oldIndex === newIndex
            ) {
              return;
            }

            const list = [...(fileList.value || [])];
            const [movedItem] = list.splice(oldIndex, 1);
            if (movedItem) {
              list.splice(newIndex, 0, movedItem);
              fileList.value = list;
            }

            attrs.onDragSort?.(oldIndex, newIndex);
            emit('update:modelValue', fileList.value);
          },
        });

        sortableInstance.value = await initializeSortable();
      }

      // 监听表单值变化
      watch(
        () => attrs.modelValue,
        (res) => {
          fileList.value = res;
        },
      );

      onMounted(initSortable);
      onUnmounted(() => {
        sortableInstance.value?.destroy();
        removeDragStyle();
      });

      return () =>
        h(
          'div',
          { 'data-upload-id': uploadId, class: 'w-full' },
          h(
            Upload,
            {
              ...props,
              ...attrs,
              fileList: fileList.value,
              beforeUpload: handleBeforeUpload,
              onChange: handleChange,
              onPreview: handlePreview,
            },
            renderUploadButton() as any,
          ),
        );
    },
  });
};

// 这里需要自行根据业务组件库进行适配，需要用到的组件都需要在这里类型说明
export type ComponentType =
  | 'ApiCascader'
  | 'ApiSelect'
  | 'ApiTreeSelect'
  | 'AutoComplete'
  | 'Cascader'
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'DatePicker'
  | 'DefaultButton'
  | 'Divider'
  | 'IconPicker'
  | 'Input'
  | 'InputNumber'
  | 'InputPassword'
  | 'Mentions'
  | 'PrimaryButton'
  | 'Radio'
  | 'RadioGroup'
  | 'RangePicker'
  | 'Rate'
  | 'Select'
  | 'Space'
  | 'Switch'
  | 'Textarea'
  | 'TimePicker'
  | 'TreeSelect'
  | 'Upload'
  | BaseFormComponentType;

async function initComponentAdapter() {
  const components: Partial<Record<ComponentType, Component>> = {
    // 如果你的组件体积比较大，可以使用异步加载
    // Button: () =>
    // import('xxx').then((res) => res.Button),

    ApiCascader: withDefaultPlaceholder(ApiComponent, 'select', {
      component: Cascader,
      fieldNames: { label: 'label', value: 'value', children: 'children' },
      loadingSlot: 'suffixIcon',
      modelPropName: 'value',
      visibleEvent: 'onVisibleChange',
    }),
    ApiSelect: withDefaultPlaceholder(ApiComponent, 'select', {
      component: Select,
      loadingSlot: 'suffixIcon',
      modelPropName: 'value',
      visibleEvent: 'onVisibleChange',
    }),
    ApiTreeSelect: withDefaultPlaceholder(ApiComponent, 'select', {
      component: TreeSelect,
      fieldNames: { label: 'label', value: 'value', children: 'children' },
      loadingSlot: 'suffixIcon',
      modelPropName: 'value',
      optionsPropName: 'treeData',
      visibleEvent: 'onVisibleChange',
    }),
    AutoComplete,
    Cascader,
    Checkbox,
    CheckboxGroup,
    DatePicker,
    // 自定义默认按钮
    DefaultButton: (props, { attrs, slots }) => {
      return h(Button, { ...props, attrs, type: 'default' }, slots);
    },
    Divider,
    IconPicker: withDefaultPlaceholder(IconPicker, 'select', {
      iconSlot: 'addonAfter',
      inputComponent: Input,
      modelValueProp: 'value',
    }),
    Input: withDefaultPlaceholder(Input, 'input'),
    InputNumber: withDefaultPlaceholder(InputNumber, 'input'),
    InputPassword: withDefaultPlaceholder(InputPassword, 'input'),
    Mentions: withDefaultPlaceholder(Mentions, 'input'),
    // 自定义主要按钮
    PrimaryButton: (props, { attrs, slots }) => {
      return h(Button, { ...props, attrs, type: 'primary' }, slots);
    },
    Radio,
    RadioGroup,
    RangePicker,
    Rate,
    Select: withDefaultPlaceholder(Select, 'select'),
    Space,
    Switch,
    Textarea: withDefaultPlaceholder(Textarea, 'input'),
    TimePicker,
    TreeSelect: withDefaultPlaceholder(TreeSelect, 'select'),
    Upload: withPreviewUpload(),
  };

  // 将组件注册到全局共享状态中
  globalShareState.setComponents(components);

  // 定义全局共享状态中的消息提示
  globalShareState.defineMessage({
    // 复制成功消息提示
    copyPreferencesSuccess: (title, content) => {
      notification.success({
        description: content,
        message: title,
        placement: 'bottomRight',
      });
    },
  });
}

export { initComponentAdapter };
