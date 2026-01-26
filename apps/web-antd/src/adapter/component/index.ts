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
import type { Recordable } from '@vben/types';

import {
  computed,
  defineAsyncComponent,
  defineComponent,
  h,
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

const withPreviewUpload = () => {
  // 检查是否为图片文件的辅助函数
  const isImageFile = (file: UploadFile): boolean => {
    const imageExtensions = new Set([
      'bmp',
      'gif',
      'jpeg',
      'jpg',
      'png',
      'svg',
      'webp',
    ]);
    if (file.url) {
      try {
        const pathname = new URL(file.url, 'http://localhost').pathname;
        const ext = pathname.split('.').pop()?.toLowerCase();
        return ext ? imageExtensions.has(ext) : false;
      } catch {
        const ext = file.url?.split('.').pop()?.toLowerCase();
        return ext ? imageExtensions.has(ext) : false;
      }
    }
    if (!file.type) {
      const ext = file.name?.split('.').pop()?.toLowerCase();
      return ext ? imageExtensions.has(ext) : false;
    }
    return file.type.startsWith('image/');
  };
  // 创建默认的上传按钮插槽
  const createDefaultSlotsWithUpload = (
    listType: string,
    placeholder: string,
  ) => {
    switch (listType) {
      case 'picture-card': {
        return {
          default: () => placeholder,
        };
      }
      default: {
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
    }
  };
  // 构建预览图片组
  const previewImage = async (
    file: UploadFile,
    visible: Ref<boolean>,
    fileList: Ref<UploadProps['fileList']>,
  ) => {
    // 如果当前文件不是图片，直接打开
    if (!isImageFile(file)) {
      if (file.url) {
        window.open(file.url, '_blank');
      } else if (file.preview) {
        window.open(file.preview, '_blank');
      } else {
        message.error($t('ui.formRules.previewWarning'));
      }
      return;
    }

    // 对于图片文件，继续使用预览组
    const [ImageComponent, PreviewGroupComponent] = await Promise.all([
      Image,
      PreviewGroup,
    ]);

    const getBase64 = (file: File) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener('load', () => resolve(reader.result));
        reader.addEventListener('error', (error) => reject(error));
      });
    };
    // 从fileList中过滤出所有图片文件
    const imageFiles = (unref(fileList) || []).filter((element) =>
      isImageFile(element),
    );

    // 为所有没有预览地址的图片生成预览
    for (const imgFile of imageFiles) {
      if (!imgFile.url && !imgFile.preview && imgFile.originFileObj) {
        imgFile.preview = (await getBase64(imgFile.originFileObj)) as string;
      }
    }
    const container: HTMLElement | null = document.createElement('div');
    document.body.append(container);

    // 用于追踪组件是否已卸载
    let isUnmounted = false;

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
                // 设置初始显示的图片索引
                current: imageFiles.findIndex((f) => f.uid === file.uid),
                onVisibleChange: (value: boolean) => {
                  visible.value = value;
                  if (!value) {
                    // 延迟清理，确保动画完成
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
              // 渲染所有图片文件
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
  };

  // 图片裁剪操作
  const cropImage = (file: File, aspectRatio: string | undefined) => {
    return new Promise((resolve, reject) => {
      const container: HTMLElement | null = document.createElement('div');
      document.body.append(container);

      // 用于追踪组件是否已卸载
      let isUnmounted = false;
      let objectUrl: null | string = null;

      const open = ref<boolean>(true);
      const cropperRef = ref<InstanceType<typeof VCropper> | null>(null);

      const closeModal = () => {
        open.value = false;
        // 延迟清理，确保动画完成
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
                    resolve(dataUrl);
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
  };

  return defineComponent({
    name: Upload.name,
    emits: ['update:modelValue'],
    setup: (
      props: any,
      { attrs, slots, emit }: { attrs: any; emit: any; slots: any },
    ) => {
      const previewVisible = ref<boolean>(false);

      const placeholder = attrs?.placeholder || $t(`ui.placeholder.upload`);

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
        if (maxSize.value && (file.size || 0) / 1024 / 1024 > maxSize.value) {
          message.error($t('ui.formRules.sizeLimit', [maxSize.value]));
          file.status = 'removed';
          return false;
        }
        // 多选或者非图片不唤起裁剪框
        if (
          attrs.crop &&
          !attrs.multiple &&
          originFileList[0] &&
          isImageFile(file)
        ) {
          file.status = 'removed';
          // antd Upload组件问题 file参数获取的是UploadFile类型对象无法取到File类型 所以通过originFileList[0]获取
          const blob = await cropImage(originFileList[0], aspectRatio.value);
          return new Promise((resolve, reject) => {
            if (!blob) {
              return reject(new Error($t('ui.crop.errorTip')));
            }
            resolve(blob);
          });
        }

        return attrs.beforeUpload?.(file) ?? true;
      };

      const handleChange = (event: UploadChangeParam) => {
        try {
          // 行内写法 handleChange: (event) => {}
          attrs.handleChange?.(event);
          // template写法 @handle-change="(event) => {}"
          attrs.onHandleChange?.(event);
        } catch (error) {
          // Avoid breaking internal v-model sync on user handler errors
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

      const renderUploadButton = (): any => {
        const isDisabled = attrs.disabled;

        // 如果禁用，不渲染上传按钮
        if (isDisabled) {
          return null;
        }

        // 否则渲染默认上传按钮
        return isEmpty(slots)
          ? createDefaultSlotsWithUpload(listType, placeholder)
          : slots;
      };

      // 可以监听到表单API设置的值
      watch(
        () => attrs.modelValue,
        (res) => {
          fileList.value = res;
        },
      );

      return () =>
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
          renderUploadButton(),
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
