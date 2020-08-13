<script lang="tsx">
  import { defineComponent, ref, unref } from 'compatible-vue';
  import { CollapseContainer } from '@/components/container/index';
  import { QrCode, QrCodeActionType } from '@/components/qrcode/index';
  import LogoImg from '@/assets/images/logo.png';

  const qrCodeUrl = 'https://www.baidu.com';
  export default defineComponent({
    name: 'QrcodePlguinDemo',
    setup() {
      const qrRef = ref<QrCodeActionType | null>(null);

      function download() {
        const qrEl = unref(qrRef);
        if (!qrEl) return;
        qrEl.download('文件名');
      }

      return () => (
        <div class="p-4 qrcode-demo">
          <CollapseContainer title="基础示例" canExpan={false}>
            <QrCode value={qrCodeUrl} />
          </CollapseContainer>

          <CollapseContainer title="渲染成img标签示例" canExpan={false}>
            <QrCode value={qrCodeUrl} tag="img" />
          </CollapseContainer>

          <CollapseContainer title="配置样式示例" canExpan={false}>
            <QrCode
              value={qrCodeUrl}
              options={{
                color: { dark: '#55D187' },
              }}
            />
          </CollapseContainer>

          <CollapseContainer title="本地logo示例" canExpan={false}>
            <QrCode value={qrCodeUrl} logo={LogoImg} />
          </CollapseContainer>

          <CollapseContainer title="在线logo示例" canExpan={false}>
            <QrCode
              value={qrCodeUrl}
              logo="https://vebn.oss-cn-beijing.aliyuncs.com/vben/logo.png"
              options={{
                color: { dark: '#55D187' },
              }}
            />
          </CollapseContainer>

          <CollapseContainer title="logo配置示例" canExpan={false}>
            <QrCode
              value={qrCodeUrl}
              logo={{
                src: 'https://vebn.oss-cn-beijing.aliyuncs.com/vben/logo.png',
                // 与二维码的比例  默认0.15
                logoSize: 0.2,
                // 与二维码的比例  默认0.05
                borderSize: 0.05,
                // logo圆角
                borderRadius: 50,
                // 背景色
                bgColor: 'blue',
              }}
            />
          </CollapseContainer>
          <CollapseContainer title="下载示例" canExpan={false}>
            <QrCode value={qrCodeUrl} ref={qrRef} logo={LogoImg} />
            <a-button type="primary" onClick={download}>
              下载(在线logo会导致图片跨域，需要下载图片需要自行解决跨域问题)
            </a-button>
          </CollapseContainer>
          <CollapseContainer title="配置大小示例" canExpan={false}>
            <QrCode value={qrCodeUrl} width={400} />
          </CollapseContainer>
        </div>
      );
    },
  });
</script>
<style lang="less" scoped>
  .qrcode-demo {
    display: flex;
    flex-wrap: wrap;

    > div {
      width: 32%;
      margin: 0 20px 20px 0;
    }
  }
</style>
