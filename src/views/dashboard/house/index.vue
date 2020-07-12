<script lang="tsx">
  import { defineComponent, PropOptions, unref } from 'compatible-vue';
  import { useDesign } from '@/hooks/core/useDesign';
  import { useBreakpoint } from '@/hooks/event/useBreakpoint';
  export default defineComponent({
    name: 'House',
    props: {
      size: {
        type: Number,
        default: 600,
      } as PropOptions<number>,
    },
    setup(props) {
      const { prefixCls } = useDesign('house-wrap');
      const { screenEnum, widthRef } = useBreakpoint();
      return () => {
        const { size } = props;
        let scale = (size || 600) / 600;

        if (unref(widthRef) <= screenEnum.MD!) {
          scale = 300 / 600;
        }
        return (
          <div
            class={prefixCls}
            style={{
              transform: `scale(${scale})`,
            }}
          >
            <div class="house">
              <div class="floor"></div>
              <div class="wall">
                <div class="window"></div>
                <div class="door">
                  <div class="door__square"></div>
                  <div class="door__line"></div>
                  <div class="door__square"></div>
                </div>
                <div class="window"></div>
              </div>
              <div class="top"></div>
              <div class="circle"></div>
              <div class="plastic">
                <div class="plastic__g">
                  <div class="plastic__item" />
                  <div class="plastic__item" />
                  <div class="plastic__item" />
                  <div class="plastic__item" />
                  <div class="plastic__item" />
                  <div class="plastic__item" />
                  <div class="plastic__item" />
                  <div class="plastic__item" />
                </div>
              </div>
              <div class="line">
                <div class="line__item" />
                <div class="line__item" />
                <div class="line__item" />
                <div class="line__item" />
                <div class="line__item" />
                <div class="line__item" />
                <div class="line__item" />
                <div class="line__item" />
                <div class="line__item" />
              </div>
            </div>
            <div class="clouds">
              <div class="cloud">
                <div class="cloud__item"></div>
                <div class="cloud__item"></div>
              </div>
              <div class="cloud">
                <div class="cloud__item" />
                <div class="cloud__item" />
              </div>
              <div class="cloud">
                <div class="cloud__item" />
                <div class="cloud__item" />
              </div>
              <div class="bird" />
            </div>
            <div class="birds">
              <div class="bird" />
              <div class="bird" />
            </div>
            <div class="tree">
              <div class="tree__item" />
              <div class="tree__item" />
              <div class="tree__item" />
            </div>
            <div class="bush">
              <div class="bush__item" />
              <div class="bush__item" />
            </div>
            <div class="dot" />
          </div>
        );
      };
    },
  });
</script>
<style lang="less" scoped>
  @import './index.less';
</style>
