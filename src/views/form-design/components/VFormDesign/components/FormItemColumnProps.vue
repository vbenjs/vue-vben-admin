<!--
 * @Description: 表单项属性
-->
<template>
  <div class="properties-content">
    <div class="properties-body" v-if="formConfig.currentItem">
      <Empty class="hint-box" v-if="!formConfig.currentItem.key" description="未选择控件" />
      <Form v-else label-align="left" layout="vertical">
        <div v-for="item of baseItemColumnProps" :key="item.name">
          <FormItem :label="item.label" v-if="showProps(item.exclude)">
            <component
              v-if="formConfig.currentItem.colProps"
              class="component-props"
              v-bind="item.componentProps"
              :is="item.component"
              v-model:value="formConfig.currentItem.colProps[item.name]"
            />
          </FormItem>
        </div>
      </Form>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { baseItemColumnProps } from '../config/formItemPropsConfig';

  import { Empty, Input, Form, FormItem, Switch, Checkbox, Select, Slider } from 'ant-design-vue';
  import RuleProps from './RuleProps.vue';
  import { useFormDesignState } from '../../../hooks/useFormDesignState';
  import { isArray } from 'lodash-es';

  export default defineComponent({
    name: 'FormItemProps',
    components: {
      RuleProps,
      Empty,
      Input,
      Form,
      FormItem,
      Switch,
      Checkbox,
      Select,
      Slider,
    },
    // props: {} as PropsOptions,

    setup() {
      const { formConfig } = useFormDesignState();
      const showProps = (exclude: string[] | undefined) => {
        if (!exclude) {
          return true;
        }

        return isArray(exclude) ? !exclude.includes(formConfig.value.currentItem!.component) : true;
      };
      return {
        baseItemColumnProps,
        formConfig,
        showProps,
      };
    },
  });
</script>
