<!--
 * @Description: 节点操作复制删除控件
-->
<template>
  <div class="copy-delete-box">
    <a class="copy" :class="activeClass" @click.stop="handleCopy">
      <Icon icon="ant-design:copy-outlined" />
    </a>
    <a class="delete" :class="activeClass" @click.stop="handleDelete">
      <Icon icon="ant-design:delete-outlined" />
    </a>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { IVFormComponent } from '../../../typings/v-form-component';
  import { remove } from '../../../utils';
  import { useFormDesignState } from '../../../hooks/useFormDesignState';
  import Icon from '@/components/Icon/Icon.vue';

  export default defineComponent({
    name: 'FormNodeOperate',
    components: {
      Icon,
    },
    props: {
      schema: {
        type: Object,
        default: () => ({}),
      },
      currentItem: {
        type: Object,
        default: () => ({}),
      },
    },
    setup(props) {
      const { formConfig, formDesignMethods } = useFormDesignState();
      const activeClass = computed(() => {
        return props.schema.key === props.currentItem.key ? 'active' : 'unactivated';
      });
      /**
       * 删除当前项
       */
      const handleDelete = () => {
        const traverse = (schemas: IVFormComponent[]) => {
          schemas.some((formItem, index) => {
            const { component, key } = formItem;
            // 处理栅格和标签页布局
            ['Grid', 'Tabs'].includes(component) &&
              formItem.columns?.forEach((item) => traverse(item.children));
            if (key === props.currentItem.key) {
              let params: IVFormComponent =
                schemas.length === 1
                  ? { component: '' }
                  : schemas.length - 1 > index
                  ? schemas[index + 1]
                  : schemas[index - 1];
              formDesignMethods.handleSetSelectItem(params);
              remove(schemas, index);
              return true;
            }
          });
        };
        traverse(formConfig.value!.schemas);
      };

      const handleCopy = () => {
        formDesignMethods.handleCopy();
      };
      return { activeClass, handleDelete, handleCopy };
    },
  });
</script>
