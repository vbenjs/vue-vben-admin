<template>
  <template v-if="['Grid'].includes(schema.component)">
    <Row class="grid-row">
      <Col
        class="grid-col"
        v-for="(colItem, index) in schema.columns"
        :key="index"
        :span="colItem.span"
      >
        <FormRender
          v-for="(item, k) in colItem.children"
          :key="k"
          :schema="item"
          :formData="formData"
          :formConfig="formConfig"
          :setFormModel="setFormModel"
        />
      </Col>
    </Row>
  </template>
  <VFormItem
    v-else
    :formConfig="formConfig"
    :schema="schema"
    :formData="formData"
    :setFormModel="setFormModel"
    @change="$emit('change', { schema: schema, value: $event })"
    @submit="$emit('submit', schema)"
    @reset="$emit('reset')"
  >
    <template
      v-if="schema.componentProps && schema.componentProps.slotName"
      #[schema.componentProps!.slotName]
    >
      <slot :name="schema.componentProps!.slotName"></slot>
    </template>
  </VFormItem>
</template>
<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { IVFormComponent, IFormConfig } from '../../../typings/v-form-component';
  import VFormItem from '../../VFormItem/index.vue';
  import { Row, Col } from 'ant-design-vue';

  export default defineComponent({
    name: 'FormRender',
    components: {
      VFormItem,
      Row,
      Col,
    },
    props: {
      formData: {
        type: Object,
        default: () => ({}),
      },
      schema: {
        type: Object as PropType<IVFormComponent>,
        default: () => ({}),
      },
      formConfig: {
        type: Object as PropType<IFormConfig>,
        default: () => [] as IFormConfig[],
      },
      setFormModel: {
        type: Function as PropType<(key: string, value: any) => void>,
        default: null,
      },
    },
    emits: ['change', 'submit', 'reset'],
    setup(_props) {},
  });
</script>

<style>
  .v-form-render-item {
    overflow: hidden;
  }
</style>
