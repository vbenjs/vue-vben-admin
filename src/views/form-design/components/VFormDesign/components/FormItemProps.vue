<!--
 * @Description: 表单项属性，控件属性面板
-->
<template>
  <div class="properties-content">
    <div class="properties-body" v-if="formConfig.currentItem?.itemProps">
      <Empty class="hint-box" v-if="!formConfig.currentItem.key" description="未选择控件" />
      <Form v-else label-align="left" layout="vertical">
        <div v-for="item of baseFormItemProps" :key="item.name">
          <FormItem :label="item.label" v-if="showProps(item.exclude)">
            <component
              v-if="item.component"
              class="component-props"
              v-bind="item.componentProps"
              :is="item.component"
              v-model:value="formConfig.currentItem[item.name]"
            />
          </FormItem>
        </div>
        <div v-for="item of advanceFormItemProps" :key="item.name">
          <FormItem :label="item.label" v-if="showProps(item.exclude)">
            <component
              v-if="item.component"
              class="component-props"
              v-bind="item.componentProps"
              :is="item.component"
              v-model:value="formConfig.currentItem.itemProps[item.name]"
            />
          </FormItem> </div
        ><div v-for="item of advanceFormItemColProps" :key="item.name">
          <FormItem :label="item.label" v-if="showProps(item.exclude)">
            <component
              v-if="item.component"
              class="component-props"
              v-bind="item.componentProps"
              :is="item.component"
              v-model:value="formConfig.currentItem.itemProps[item.name]['span']"
            />
          </FormItem>
        </div>
        <FormItem label="控制属性" v-if="controlPropsList.length">
          <Col v-for="item of controlPropsList" :key="item.name">
            <Checkbox v-model:checked="formConfig.currentItem.itemProps[item.name]">
              {{ item.label }}
            </Checkbox>
          </Col>
        </FormItem>
        <FormItem label="是否必选" v-if="!['Grid'].includes(formConfig.currentItem.component)">
          <Switch v-model:checked="formConfig.currentItem.itemProps['required']" />
          <Input
            v-if="formConfig.currentItem.itemProps['required']"
            v-model:value="formConfig.currentItem.itemProps['message']"
            placeholder="请输入必选提示"
          />
        </FormItem>
        <FormItem
          v-if="!['Grid'].includes(formConfig.currentItem.component)"
          label="校验规则"
          :class="{ 'form-rule-props': !!formConfig.currentItem.itemProps['rules'] }"
        >
          <RuleProps />
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script lang="ts" setup name="FormItemProps">
  import { computed, watch } from 'vue';
  import {
    baseFormItemControlAttrs,
    baseFormItemProps,
    advanceFormItemProps,
    advanceFormItemColProps,
  } from '../../VFormDesign/config/formItemPropsConfig';

  import { Empty, Input, Form, FormItem, Switch, Checkbox, Col } from 'ant-design-vue';
  import RuleProps from './RuleProps.vue';
  import { useFormDesignState } from '../../../hooks/useFormDesignState';
  import { isArray } from 'lodash-es';

  const { formConfig } = useFormDesignState();

  watch(
    () => formConfig.value,
    () => {
      if (formConfig.value.currentItem) {
        formConfig.value.currentItem.itemProps = formConfig.value.currentItem.itemProps || {};
        formConfig.value.currentItem.itemProps.labelCol =
          formConfig.value.currentItem.itemProps.labelCol || {};
        formConfig.value.currentItem.itemProps.wrapperCol =
          formConfig.value.currentItem.itemProps.wrapperCol || {};
      }
    },
    { deep: true, immediate: true },
  );
  const showProps = (exclude: string[] | undefined) => {
    if (!exclude) {
      return true;
    }
    return isArray(exclude) ? !exclude.includes(formConfig.value.currentItem!.component) : true;
  };

  const controlPropsList = computed(() => {
    return baseFormItemControlAttrs.filter((item) => {
      return showProps(item.exclude);
    });
  });
</script>
