<script lang="ts">
  import type { PropType } from 'vue';
  import { defineComponent, computed, unref, h } from 'vue';

  import { Tooltip } from 'ant-design-vue';
  import { InfoCircleOutlined } from '@ant-design/icons-vue';

  import { getPopupContainer } from '/@/utils';
  import { isString, isArray } from '/@/utils/is';
  import { getSlot } from '/@/utils/helper/tsxHelper';
  export default defineComponent({
    name: 'BasicHelp',
    components: { Tooltip },
    props: {
      // max-width
      maxWidth: {
        type: String as PropType<string>,
        default: '600px',
      },
      // Whether to display the serial number
      showIndex: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
      // Text list
      text: {
        type: [Array, String] as PropType<string[] | string>,
      },
      // color
      color: {
        type: String as PropType<string>,
        default: '#ffffff',
      },
      fontSize: {
        type: String as PropType<string>,
        default: '14px',
      },
      absolute: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
      // 定位
      position: {
        type: [Object] as PropType<any>,
        default: () => ({
          position: 'absolute',
          left: 0,
          bottom: 0,
        }),
      },
      placement: {
        type: String as PropType<string>,
        defualt: 'right',
      },
    },
    setup(props, { slots }) {
      const getOverlayStyleRef = computed(() => {
        return {
          maxWidth: props.maxWidth,
        };
      });

      const getWrapStyleRef = computed(() => {
        return {
          color: props.color,
          fontSize: props.fontSize,
        };
      });

      const getMainStyleRef = computed(() => {
        return props.absolute ? props.position : {};
      });

      const renderTitle = () => {
        const list = props.text;
        if (isString(list)) {
          return h('p', list);
        }
        if (isArray(list)) {
          return list.map((item, index) => {
            return h('p', { key: item }, [props.showIndex ? `${index + 1}. ` : '', item]);
          });
        }
        return null;
      };

      return () => {
        return h(
          // @ts-ignores
          Tooltip,
          {
            title: h(
              'div',
              {
                style: unref(getWrapStyleRef),
              },
              [renderTitle()]
            ) as any,
            overlayClassName: 'base-help__wrap',
            autoAdjustOverflow: true,
            overlayStyle: unref(getOverlayStyleRef),
            placement: props.placement,
            getPopupContainer: () => getPopupContainer(),
          },
          {
            default: () =>
              h(
                'span',
                {
                  class: 'base-help',
                  style: unref(getMainStyleRef),
                },
                getSlot(slots) || h(InfoCircleOutlined)
              ),
          }
        );
      };
    },
  });
</script>
<style lang="less">
  @import (reference) '../../../design/index.less';

  .base-help {
    display: inline-block;
    margin-left: 6px;
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
