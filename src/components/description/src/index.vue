<script lang="tsx">
  import { defineComponent, computed, ref, unref } from 'compatible-vue';
  import { Descriptions } from 'ant-design-vue';
  import { CollapseContainer, CollapseContainerOptions } from '@/components/container/index';
  import { DescOptions, DescInstance, DescItem } from './type';
  import descProps from './props';

  import { isFunction } from '@/utils/is/index';
  import { getSlot } from '@/utils/helper/tsxHelper';
  import { cloneDeep } from '@/utils/lodashChunk';
  import { deepMerge } from '@/utils/deepMerge';

  import { useDesign } from '@/hooks/core/useDesign';

  export default defineComponent({
    props: descProps,
    setup(props: Readonly<DescOptions>, { attrs, slots, emit }) {
      const { prefixCls } = useDesign('description');
      // props来自设置
      const propsRef = ref<Partial<DescOptions> | null>(null);
      // 自定义title组件：获得title
      const getMergeProps = computed(() => {
        return {
          ...props,
          ...unref(propsRef),
        };
      });
      const getProps = computed(() => {
        const opt = {
          ...props,
          ...(unref(propsRef) || {}),
          title: undefined,
        };
        return opt;
      });
      /**
       * @description: 是否使用标题
       */
      const useWrapper = computed(() => {
        return !!unref(getMergeProps).title;
      });
      /**
       * @description: 获取配置Collapse
       */
      const getCollapseOptions = computed(
        (): CollapseContainerOptions => {
          return {
            // 默认不能展开
            canExpand: false,
            ...unref(getProps).collapseOptions,
          };
        }
      );
      /**
       * @description:设置desc
       */
      function setProps(descProps: Partial<DescOptions>): void {
        // 保留上一次的setDrawerProps
        const mergeProps = deepMerge(unref(propsRef) || {}, descProps);
        propsRef.value = cloneDeep(mergeProps);
      }
      const methods: DescInstance = {
        setProps,
      };
      emit('register', methods);

      // 防止换行
      function renderLabel({ label, labelMinWidth, labelStyle }: DescItem) {
        if (!labelStyle && !labelMinWidth) {
          return label;
        }
        return (
          <div
            style={{
              ...labelStyle,
              'min-width': `${labelMinWidth}px`,
            }}
          >
            {label}
          </div>
        );
      }

      function renderItem() {
        const { schema } = unref(getProps);
        return unref(schema).map((item, index) => {
          const { render, field, span, show } = item;
          const { data } = unref(getProps);
          if (show && isFunction(show) && !show(data)) {
            return null;
          }
          return (
            <Descriptions.Item label={renderLabel(item)} key={index} span={span}>
              {isFunction(render) ? render(data && data[field]) : unref(data) && unref(data)[field]}
            </Descriptions.Item>
          );
        });
      }
      const renderDesc = () => {
        return (
          <Descriptions class={`${prefixCls}`} props={{ ...attrs, ...unref(getProps) }}>
            {renderItem()}
          </Descriptions>
        );
      };
      const renderContainer = () => {
        const actionSlot = <template slot="action">{getSlot(slots, 'action')}</template>;
        const content = props.useCollapse ? (
          [renderDesc(), actionSlot]
        ) : (
          <div>
            {renderDesc()}
            actionSlot
          </div>
        );
        // 减少dom层级
        return props.useCollapse ? (
          <CollapseContainer
            title={unref(getMergeProps).title}
            canExpan={unref(getCollapseOptions).canExpand}
            helpMessage={unref(getCollapseOptions).helpMessage}
          >
            {content}
          </CollapseContainer>
        ) : (
          content
        );
      };

      return () => (unref(useWrapper) ? renderContainer() : renderDesc());
    },
  });
</script>
