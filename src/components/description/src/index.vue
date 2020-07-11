<script lang="tsx">
  import { defineComponent, computed, ref, unref } from '@/setup/vue';
  import { Descriptions } from 'ant-design-vue';
  import { CollapseContainer, CollapseContainerOptions } from '@/components/container/index';
  import { DescOptions, DescInstance } from './type';
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
      emit('get', methods);

      function renderItem() {
        return unref(getProps).schema.map((item, index) => {
          const { label, render, field, span } = item;
          const { data } = unref(getProps);
          return (
            <Descriptions.Item label={label} key={index} span={span}>
              {isFunction(render) ? render(data && data[field]) : data && data[field]}
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
        return (
          <CollapseContainer
            title={unref(getMergeProps).title}
            canExpan={unref(getCollapseOptions).canExpand}
            helpMessage={unref(getCollapseOptions).helpMessage}
          >
            {renderDesc()}

            <template slot="action">{getSlot(slots, 'action')}</template>
          </CollapseContainer>
        );
      };

      return () => (unref(useWrapper) ? renderContainer() : renderDesc());
      // return () => renderContainer();
    },
  });
</script>
//
<style lang="less" scoped>
  // @import (reference)  '~@design';
  // @prefix-cls: ~'@{namespace}-desc';
  // .@{prefix-cls} {
  //   &__title{
  //     margin: 16px 0;
  //   }
  // }
  //
</style>
