<!--
 * @Description: 组件属性控件
-->
<template>
  <div class="properties-content">
    <div class="properties-body" v-if="formConfig.currentItem">
      <Empty class="hint-box" v-if="!formConfig.currentItem.key" description="未选择组件" />

      <Form label-align="left" layout="vertical">
        <!--    循环遍历渲染组件属性      -->

        <div v-if="formConfig.currentItem && formConfig.currentItem.componentProps">
          <FormItem v-for="item in inputOptions" :key="item.name" :label="item.label">
            <!--     处理数组属性，placeholder       -->

            <div v-if="item.children">
              <template v-for="(child, index) of item.children" :key="index">
                <component
                  v-if="child.component"
                  v-bind="child.componentProps"
                  v-model:value="formConfig.currentItem.componentProps[item.name][index]"
                  :is="child.component"
                />
              </template>
            </div>
            <!--     如果不是数组，则正常处理属性值       -->
            <component
              v-else-if="item.component"
              class="component-prop"
              v-bind="item.componentProps"
              :is="item.component"
              v-model:value="formConfig.currentItem.componentProps[item.name]"
            />
          </FormItem>
          <FormItem label="控制属性">
            <Col v-for="item in controlOptions" :key="item.name">
              <Checkbox
                v-if="showControlAttrs(item.includes)"
                v-bind="item.componentProps"
                v-model:checked="formConfig.currentItem.componentProps[item.name]"
              >
                {{ item.label }}
              </Checkbox>
            </Col>
          </FormItem>
        </div>
        <FormItem label="关联字段">
          <Select
            mode="multiple"
            v-model:value="formConfig.currentItem['link']"
            :options="linkOptions"
          />
        </FormItem>

        <FormItem
          label="选项"
          v-if="
            [
              'Select',
              'CheckboxGroup',
              'RadioGroup',
              'TreeSelect',
              'Cascader',
              'AutoComplete',
            ].includes(formConfig.currentItem.component)
          "
        >
          <FormOptions />
        </FormItem>

        <FormItem label="栅格" v-if="['Grid'].includes(formConfig.currentItem.component)">
          <FormOptions />
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script lang="ts">
  import {
    Empty,
    Input,
    Form,
    FormItem,
    Switch,
    Checkbox,
    Select,
    InputNumber,
    RadioGroup,
    Col,
    Row,
  } from 'ant-design-vue';
  import RadioButtonGroup from '/@/components/Form/src/components/RadioButtonGroup.vue';
  import { computed, defineComponent, ref, watch } from 'vue';
  import { useFormDesignState } from '../../../hooks/useFormDesignState';
  import {
    baseComponentControlAttrs,
    baseComponentAttrs,
    baseComponentCommonAttrs,
    componentPropsFuncs,
  } from '../../VFormDesign/config/componentPropsConfig';
  import FormOptions from './FormOptions.vue';
  import { formItemsForEach, remove } from '../../../utils';
  import { IBaseFormAttrs } from '../config/formItemPropsConfig';

  export default defineComponent({
    name: 'ComponentProps',
    components: {
      FormOptions,
      Empty,
      Input,
      Form,
      FormItem,
      Switch,
      Checkbox,
      Select,
      InputNumber,
      RadioGroup,
      RadioButtonGroup,
      Col,
      Row,
    },
    setup() {
      // 让compuated属性自动更新

      const allOptions = ref([] as Omit<IBaseFormAttrs, 'tag'>[]);
      const showControlAttrs = (includes: string[] | undefined) => {
        if (!includes) return true;
        return includes.includes(formConfig.value.currentItem!.component);
      };

      const { formConfig } = useFormDesignState();

      if (formConfig.value.currentItem) {
        formConfig.value.currentItem.componentProps =
          formConfig.value.currentItem.componentProps || {};
      }

      watch(
        () => formConfig.value.currentItem?.field,
        (_newValue, oldValue) => {
          formConfig.value.schemas &&
            formItemsForEach(formConfig.value.schemas, (item) => {
              if (item.link) {
                const index = item.link.findIndex((linkItem) => linkItem === oldValue);
                index !== -1 && remove(item.link, index);
              }
            });
        },
      );

      watch(
        () => formConfig.value.currentItem && formConfig.value.currentItem.component,
        () => {
          allOptions.value = [];
          baseComponentControlAttrs.forEach((item) => {
            item.category = 'control';
            if (!item.includes) {
              // 如果属性没有include，所有的控件都适用

              allOptions.value.push(item);
            } else if (item.includes.includes(formConfig.value.currentItem!.component)) {
              // 如果有include，检查是否包含了当前控件类型
              allOptions.value.push(item);
            }
          });

          baseComponentCommonAttrs.forEach((item) => {
            item.category = 'input';
            if (item.includes) {
              if (item.includes.includes(formConfig.value.currentItem!.component)) {
                allOptions.value.push(item);
              }
            } else if (item.exclude) {
              if (!item.exclude.includes(formConfig.value.currentItem!.component)) {
                allOptions.value.push(item);
              }
            } else {
              allOptions.value.push(item);
            }
          });

          baseComponentAttrs[formConfig.value.currentItem!.component] &&
            baseComponentAttrs[formConfig.value.currentItem!.component].forEach(async (item) => {
              if (item.component) {
                if (['Switch', 'Checkbox', 'Radio'].includes(item.component)) {
                  item.category = 'control';
                  allOptions.value.push(item);
                } else {
                  item.category = 'input';
                  allOptions.value.push(item);
                }
              }
            });
        },
        {
          immediate: true,
        },
      );
      // 控制性的选项
      const controlOptions = computed(() => {
        return allOptions.value.filter((item) => {
          return item.category == 'control';
        });
      });

      // 非控制性选择
      const inputOptions = computed(() => {
        return allOptions.value.filter((item) => {
          return item.category == 'input';
        });
      });

      watch(
        () => formConfig.value.currentItem!.componentProps,
        () => {
          const func = componentPropsFuncs[formConfig.value.currentItem!.component];
          if (func) {
            func(formConfig.value.currentItem!.componentProps, allOptions.value);
          }
        },
        {
          immediate: true,
          deep: true,
        },
      );
      const linkOptions = computed(() => {
        return (
          formConfig.value.schemas &&
          formConfig.value.schemas
            .filter((item) => item.key !== formConfig.value.currentItem!.key)
            .map(({ label, field }) => ({ label: label + '/' + field, value: field }))
        );
      });
      return {
        formConfig,
        showControlAttrs,
        linkOptions,
        controlOptions,
        inputOptions,
      };
    },
  });
</script>
