<script lang="tsx">
  import { Tooltip } from 'ant-design-vue';
  import { Icon } from '@/components/icon/index';

  import { defineComponent, computed, unref, PropOptions } from 'compatible-vue';

  // hook
  import { useDesign } from '@/hooks/core/useDesign';

  // import { getSlot } from '@/utils/helper/tsxHelper';
  import { getPopupContainer } from '@/utils/mountUtil';

  import { isString, isArray } from '@/utils/is/index';
  export default defineComponent({
    name: 'BaseHelp',
    props: {
      maxWidth: {
        type: String,
        default: '600px',
      } as PropOptions<string>,
      // 是否显示序号
      showIndex: {
        type: Boolean,
        default: true,
      } as PropOptions<boolean>,
      // 文本列表
      text: {
        type: [Array, String, Object],
        default: null,
      } as PropOptions<any>,
      // 颜色
      color: {
        type: String,
        default: '#ffffff',
      } as PropOptions<string>,
      // 字体大小
      fontSize: {
        type: String,
        default: '14px',
      } as PropOptions<string>,
      icon: {
        type: String,
        default: 'info-circle',
      } as PropOptions<string>,
      absolute: {
        type: Boolean,
        default: false,
      } as PropOptions<boolean>,
      // 定位
      position: {
        type: [Object],
        default: () => ({
          position: 'absolute',
          left: 0,
          bottom: 0,
        }),
      } as PropOptions<any>,
    },
    setup(props) {
      const getOverlayStyle = computed(() => {
        return {
          maxWidth: props.maxWidth,
        };
      });
      const getWrapStyle = computed(() => {
        return {
          color: props.color,
          fontSize: props.fontSize,
        };
      });
      const getMainStyle = computed(() => {
        return props.absolute ? props.position : {};
      });

      const { prefixCls } = useDesign('base-help');

      /**
       * @description: 渲染内容
       */
      const renderTitle = () => {
        const list = props.text;
        if (isString(list)) {
          return <p>{list}</p>;
        }
        if (isArray(list)) {
          return list.map((item, index) => {
            return (
              <p key={item}>
                {props.showIndex ? `${index + 1}. ` : ''}
                {item}
              </p>
            );
          });
        }
        return null;
      };
      return () => (
        <Tooltip
          placement="right"
          overlayStyle={unref(getOverlayStyle)}
          autoAdjustOverflow={true}
          overlayClassName={`${prefixCls}__wrap`}
          getPopupContainer={() => getPopupContainer()}
        >
          <template slot="title">
            <div style={unref(getWrapStyle)}>{renderTitle()}</div>
          </template>
          <span class={prefixCls} style={unref(getMainStyle)}>
            <Icon type={props.icon} />
          </span>
        </Tooltip>
      );
    },
  });
</script>
<style lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-base-help';

  .@{prefix-cls} {
    display: inline-block;
    font-size: 14px;
    color: @text-color-help-dark;
    cursor: pointer;

    &:hover {
      color: @primary-color;
    }

    &__wrap {
      p {
        margin-bottom: 0;
      }
    }
  }
</style>
