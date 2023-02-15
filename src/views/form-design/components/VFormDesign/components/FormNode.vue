<!--
 * @Description: 拖拽节点控件
-->
<template>
  <div
    class="drag-move-box"
    @click.stop="handleSelectItem"
    :class="{ active: schema.key === formConfig.currentItem?.key }"
  >
    <div class="form-item-box">
      <VFormItem :formConfig="formConfig" :schema="schema" />
    </div>
    <div class="show-key-box">
      {{ schema.label + (schema.field ? '/' + schema.field : '') }}
    </div>
    <FormNodeOperate :schema="schema" :currentItem="formConfig.currentItem" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, toRefs, PropType } from 'vue';
  import { IVFormComponent } from '../../../typings/v-form-component';
  import FormNodeOperate from './FormNodeOperate.vue';
  import { useFormDesignState } from '../../../hooks/useFormDesignState';
  import VFormItem from '../../VFormItem/index.vue';
  // import VFormItem from '../../VFormItem/vFormItem.vue';
  export default defineComponent({
    name: 'FormNode',
    components: {
      VFormItem,
      FormNodeOperate,
    },
    props: {
      schema: {
        type: Object as PropType<IVFormComponent>,
        required: true,
      },
    },
    setup(props) {
      const { formConfig, formDesignMethods } = useFormDesignState();
      const state = reactive({});
      // 获取 formDesignMethods
      const handleSelectItem = () => {
        // 调用 formDesignMethods
        formDesignMethods.handleSetSelectItem(props.schema);
      };
      return {
        ...toRefs(state),
        handleSelectItem,
        formConfig,
      };
    },
  });
</script>
