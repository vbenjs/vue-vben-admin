<script lang="tsx">
  import { defineComponent, computed, unref } from '@/setup/vue';

  export default defineComponent({
    name: 'SvgIcon',
    props: {
      // 图标类型
      type: {
        type: String,
        required: true,
      },

      // 样式名
      className: {
        type: String,
      },

      // 大小
      size: {
        type: String,
      },
    },
    setup(props) {
      // svg样式
      const getSvgStyle = computed(() => {
        const { size = '1em' } = props;
        return {
          width: size,
          height: size,
        };
      });
      // clss样式
      const getIconCls = computed(() => {
        const { className } = props;
        const clsList = ['svg-icon'];
        className && clsList.push(className);
        return clsList.join(' ');
      });
      // 图标名
      const getIconType = computed(() => {
        const { type } = props;
        return `#icon-${type}`;
      });

      return () => (
        <i class="anticon svg-icon__wrap">
          <svg class={getIconCls} style={unref(getSvgStyle)}>
            <use xlinkHref={unref(getIconType)} />
          </svg>
        </i>
      );
    },
  });
</script>
<style scoped lang="less">
  .svg-icon {
    width: 1em;
    height: 1em;
    overflow: hidden;
    vertical-align: -0.15em;
    fill: currentColor;
  }
</style>
