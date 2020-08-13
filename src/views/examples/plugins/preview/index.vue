<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { createImgPreview } from '@/components/preview/index';

  import { Divider } from 'ant-design-vue';
  const imgList: string[] = [
    'https://picsum.photos/id/66/346/216',
    'https://picsum.photos/id/67/346/216',
    'https://picsum.photos/id/68/346/216',
  ];
  export default defineComponent({
    name: 'PreviewDemo',
    setup() {
      return () => (
        <div class="p-4">
          <Divider>有略缩图</Divider>
          {imgList.map((img, index) => {
            return (
              <img
                src={img}
                width={260}
                onClick={createImgPreview.bind(null, { imageList: [imgList[index]] })}
              />
            );
          })}
          <Divider>没有略缩图</Divider>
          <a-button
            class="my-4"
            type="primary"
            onClick={() => createImgPreview({ imageList: imgList })}
          >
            预览图片
          </a-button>
        </div>
      );
    },
  });
</script>
