<script lang="tsx">
  import {
    defineComponent,
    watchEffect,
    PropOptions,
    ref,
    unref,
    getCurrentInstance,
  } from 'compatible-vue';
  import { toCanvas, QRCodeRenderersOptions, LogoType } from './qrcodePlus';
  import { toDataURL } from 'qrcode';
  import { downloadByUrl } from '@/components/file/index';

  export default defineComponent({
    name: 'QrCode',
    props: {
      value: {
        type: [String, Array],
        default: null,
      } as PropOptions<string | any[]>,
      // 参数
      options: {
        type: Object,
        default: null,
      } as PropOptions<QRCodeRenderersOptions>,
      // 宽度
      width: {
        type: Number,
        default: 200,
      } as PropOptions<number>,
      // 中间logo图标
      logo: {
        type: [String, Object],
        default: '',
      } as PropOptions<LogoType | string>,
      // img 不支持内嵌logo
      tag: {
        type: String,
        default: 'canvas',
        validator: (v: string) => ['canvas', 'img'].includes(v),
      } as PropOptions<'canvas' | 'img'>,
    },
    setup(props, { emit }) {
      const wrapRef = ref<HTMLCanvasElement | HTMLImageElement | null>(null);
      const urlRef = ref<string>('');
      async function createQrcode() {
        try {
          const { tag, value, options = {}, width, logo } = props;
          const renderValue = String(value);
          const wrapEl = unref(wrapRef);

          if (!wrapEl) return;

          if (tag === 'canvas') {
            const url: string = await toCanvas({
              canvas: wrapEl,
              width,
              logo,
              content: renderValue,
              options: options || {},
            });
            urlRef.value = url;
            emit('done', url);
            return;
          }

          if (tag === 'img') {
            const url = await toDataURL(renderValue, {
              errorCorrectionLevel: 'H',
              width,
              ...options,
            });
            (unref(wrapRef) as HTMLImageElement).src = url;
            urlRef.value = url;
            emit('done', url);
          }
        } catch (error) {
          emit('error', error);
        }
      }
      /**
       * 文件下载
       */
      function download(fileName?: string) {
        const url = unref(urlRef);
        if (!url) return;
        downloadByUrl({
          url,
          fileName,
        });
      }

      watchEffect(() => {
        createQrcode();
      });

      const currentInstance = getCurrentInstance() as any;
      if (currentInstance) {
        currentInstance.download = download;
      }
      return () => {
        const Tag = props.tag as string;

        return <Tag ref={wrapRef} />;
      };
    },
  });
</script>
