<script lang="tsx">
  import { defineComponent, watchEffect, PropOptions, ref, unref } from 'compatible-vue';
  import { toCanvas, QRCodeOptions, toDataURL } from 'qrcode';
  export default defineComponent({
    name: 'QrCode',
    props: {
      value: {
        type: [String, Array],
        default: null,
      } as PropOptions<string | any[]>,
      options: {
        type: Object,
        default: null,
      } as PropOptions<QRCodeOptions>,

      tag: {
        type: String,
        default: 'canvas',
        validator: (v: string) => ['canvas', 'img'].includes(v),
      } as PropOptions<'canvas' | 'img'>,
    },
    setup(props, { emit }) {
      const wrapRef = ref<HTMLCanvasElement | HTMLImageElement | null>(null);

      async function createQrcode() {
        try {
          const { tag, value, options } = props;
          const renderValue = String(value);
          const wrapEl = unref(wrapRef);
          if (!wrapEl) return;
          if (tag === 'canvas') {
            await toCanvas(wrapEl, renderValue, options || {});
            emit('done');
            return;
          }
          if (tag === 'img') {
            const url = await toDataURL(renderValue, { errorCorrectionLevel: 'H', ...options });
            console.log('======================');
            console.log(url);
            console.log('======================');
            (unref(wrapRef) as HTMLImageElement).src = url;
            emit('done');
          }
        } catch (error) {
          console.log('======================');
          console.log(error);
          console.log('======================');
          emit('error', error);
        }
      }
      watchEffect(() => {
        createQrcode();
      });
      return () => {
        const Tag = props.tag as string;

        return <Tag ref={wrapRef} />;
      };
    },
  });
</script>
