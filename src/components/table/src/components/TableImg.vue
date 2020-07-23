<script lang="tsx">
  import { defineComponent, PropOptions } from 'compatible-vue';
  import { useDesign } from '@/hooks/core/useDesign';
  import { createImgPreview } from '@/components/preview/index';

  export default defineComponent({
    name: 'TableAction',
    props: {
      imgList: {
        type: Array,
        default: null,
      } as PropOptions<string[]>,
      size: {
        type: Number,
        default: 40,
      } as PropOptions<number>,
    },
    setup(props) {
      const { prefixCls } = useDesign('table-img');
      function handlePreview(index: number) {
        const { imgList } = props;

        createImgPreview({
          imageList: imgList as string[],
          index: index,
        });
      }
      return () => {
        const { imgList, size } = props;
        if (!imgList || imgList.length === 0) {
          return null;
        }
        return (
          <div class={prefixCls}>
            {imgList.map((img, index) => {
              return (
                <img key={img} width={size} src={img} onClick={handlePreview.bind(null, index)} />
              );
            })}
          </div>
        );
      };
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-table-img';
  .@{prefix-cls} {
    display: flex;

    img {
      margin-right: 4px;
    }
  }
</style>
