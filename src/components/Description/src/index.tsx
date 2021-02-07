import type { DescOptions, DescInstance, DescItem } from './types';

import { defineComponent, computed, ref, unref, CSSProperties } from 'vue';
import { get } from 'lodash-es';
import { Descriptions } from 'ant-design-vue';
import { DescriptionsProps } from 'ant-design-vue/es/descriptions/index';
import { CollapseContainer, CollapseContainerOptions } from '/@/components/Container/index';

import descProps from './props';

import { isFunction } from '/@/utils/is';
import { getSlot } from '/@/utils/helper/tsxHelper';
import { cloneDeep } from 'lodash-es';
import { deepMerge } from '/@/utils';

const prefixCls = 'description';
export default defineComponent({
  name: 'Description',
  props: descProps,
  emits: ['register'],
  setup(props, { attrs, slots, emit }) {
    const propsRef = ref<Partial<DescOptions> | null>(null);

    // Custom title component: get title
    const getMergeProps = computed(() => {
      return {
        ...props,
        ...(unref(propsRef) as Recordable),
      } as DescOptions;
    });

    const getProps = computed(() => {
      const opt = {
        ...unref(getMergeProps),
        title: undefined,
      };
      return opt as DescOptions;
    });

    /**
     * @description: Whether to setting title
     */
    const useWrapper = computed(() => !!unref(getMergeProps).title);

    /**
     * @description: Get configuration Collapse
     */
    const getCollapseOptions = computed(
      (): CollapseContainerOptions => {
        return {
          // Cannot be expanded by default
          canExpand: false,
          ...unref(getProps).collapseOptions,
        };
      }
    );

    const getDescriptionsProps = computed(() => {
      return { ...attrs, ...unref(getProps) } as DescriptionsProps;
    });

    /**
     * @description:设置desc
     */
    function setDescProps(descProps: Partial<DescOptions>): void {
      // Keep the last setDrawerProps
      const mergeProps = deepMerge(unref(propsRef) || {}, descProps);
      propsRef.value = cloneDeep(mergeProps);
    }

    // Prevent line breaks
    function renderLabel({ label, labelMinWidth, labelStyle }: DescItem) {
      if (!labelStyle && !labelMinWidth) {
        return label;
      }

      const labelStyles: CSSProperties = {
        ...labelStyle,

        minWidth: `${labelMinWidth}px `,
      };
      return <div style={labelStyles}>{label}</div>;
    }

    function renderItem() {
      const { schema, data } = unref(getProps);
      return unref(schema).map((item) => {
        const { render, field, span, show, contentMinWidth } = item;

        if (show && isFunction(show) && !show(data)) {
          return null;
        }

        const getContent = () => {
          const _data = unref(data);
          const getField = get(_data, field);
          return isFunction(render) ? render(getField, _data) : getField ?? '';
        };

        const width = contentMinWidth;
        return (
          <Descriptions.Item label={renderLabel(item)} key={field} span={span}>
            {() => {
              if (!contentMinWidth) {
                return getContent();
              }
              const style: CSSProperties = {
                minWidth: `${width}px`,
              };
              return <div style={style}>{getContent()}</div>;
            }}
          </Descriptions.Item>
        );
      })
      .filter((item) => !!item);
    }

    const renderDesc = () => {
      return (
        <Descriptions class={`${prefixCls}`} {...(unref(getDescriptionsProps) as any)}>
          {renderItem()}
        </Descriptions>
      );
    };

    const renderContainer = () => {
      const content = props.useCollapse ? renderDesc() : <div>{renderDesc()}</div>;
      // Reduce the dom level

      if (!props.useCollapse) {
        return content;
      }

      const { canExpand, helpMessage } = unref(getCollapseOptions);
      const { title } = unref(getMergeProps);

      return (
        <CollapseContainer title={title} canExpan={canExpand} helpMessage={helpMessage}>
          {{
            default: () => content,
            action: () => getSlot(slots, 'action'),
          }}
        </CollapseContainer>
      );
    };

    const methods: DescInstance = {
      setDescProps,
    };

    emit('register', methods);
    return () => (unref(useWrapper) ? renderContainer() : renderDesc());
  },
});
