import type { PropType } from 'vue';

import { Tooltip } from 'ant-design-vue';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import { defineComponent, computed, unref } from 'vue';

import { getPopupContainer } from '/@/utils';

import { isString, isArray } from '/@/utils/is';
import { getSlot } from '/@/utils/helper/tsxHelper';
import './BasicHelp.less';
export default defineComponent({
  name: 'BaseHelp',
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
        title={(<div style={unref(getWrapStyleRef)}>{renderTitle()}</div>) as any}
        placement="right"
        overlayStyle={unref(getOverlayStyleRef)}
        autoAdjustOverflow={true}
        overlayClassName="base-help__wrap"
        getPopupContainer={() => getPopupContainer()}
      >
        {{
          default: () => (
            <span class="base-help" style={unref(getMainStyleRef)}>
              {getSlot(slots) || <InfoCircleOutlined />}
            </span>
          ),
        }}
      </Tooltip>
    );
  },
});
