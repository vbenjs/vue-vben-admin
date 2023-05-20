<!--
 * @Description: 右侧属性面板控件 表单属性面板
-->
<template>
  <div class="properties-content">
    <Form class="properties-body" label-align="left" layout="vertical">
      <!--      <e-upload v-model="fileList"></e-upload>-->

      <FormItem label="表单布局">
        <RadioGroup button-style="solid" v-model:value="formConfig.layout">
          <RadioButton value="horizontal">水平</RadioButton>
          <RadioButton value="vertical" :disabled="formConfig.labelLayout === 'Grid'">
            垂直
          </RadioButton>
          <RadioButton value="inline" :disabled="formConfig.labelLayout === 'Grid'">
            行内
          </RadioButton>
        </RadioGroup>
      </FormItem>

      <!-- <Row> -->
      <FormItem label="标签布局">
        <RadioGroup
          buttonStyle="solid"
          v-model:value="formConfig.labelLayout"
          @change="lableLayoutChange"
        >
          <RadioButton value="flex">固定</RadioButton>
          <RadioButton value="Grid" :disabled="formConfig.layout !== 'horizontal'">
            栅格
          </RadioButton>
        </RadioGroup>
      </FormItem>
      <!-- </Row> -->
      <FormItem label="标签宽度（px）" v-show="formConfig.labelLayout === 'flex'">
        <InputNumber
          :style="{ width: '100%' }"
          v-model:value="formConfig.labelWidth"
          :min="0"
          :step="1"
        />
      </FormItem>
      <div v-if="formConfig.labelLayout === 'Grid'">
        <FormItem label="labelCol">
          <Slider v-model:value="formConfig.labelCol!.span" :max="24" />
        </FormItem>
        <FormItem label="wrapperCol">
          <Slider v-model:value="formConfig.wrapperCol!.span" :max="24" />
        </FormItem>

        <FormItem label="标签对齐">
          <RadioGroup button-style="solid" v-model:value="formConfig.labelAlign">
            <RadioButton value="left">靠左</RadioButton>
            <RadioButton value="right">靠右</RadioButton>
          </RadioGroup>
        </FormItem>

        <FormItem label="控件大小">
          <RadioGroup button-style="solid" v-model:value="formConfig.size">
            <RadioButton value="default">默认</RadioButton>
            <RadioButton value="small">小</RadioButton>
            <RadioButton value="large">大</RadioButton>
          </RadioGroup>
        </FormItem>
      </div>
      <FormItem label="表单属性">
        <Col
          ><Checkbox v-model:checked="formConfig.colon" v-if="formConfig.layout == 'horizontal'"
            >label后面显示冒号</Checkbox
          ></Col
        >
        <Col><Checkbox v-model:checked="formConfig.disabled">禁用</Checkbox></Col>
        <Col><Checkbox v-model:checked="formConfig.hideRequiredMark">隐藏必选标记</Checkbox></Col>
      </FormItem>
    </Form>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { useFormDesignState } from '../../../hooks/useFormDesignState';
  import { InputNumber, Slider, Checkbox, Col, RadioChangeEvent } from 'ant-design-vue';
  // import RadioButtonGroup from '/@/components/RadioButtonGroup.vue';
  import { Form, FormItem, Radio } from 'ant-design-vue';
  export default defineComponent({
    name: 'FormProps',
    components: {
      InputNumber,
      Slider,
      Checkbox,
      RadioGroup: Radio.Group,
      RadioButton: Radio.Button,
      Form,
      FormItem,
      Col,
    },
    setup() {
      const { formConfig } = useFormDesignState();

      formConfig.value = formConfig.value || {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
      };

      const lableLayoutChange = (e: RadioChangeEvent) => {
        if (e.target.value === 'Grid') {
          formConfig.value.layout = 'horizontal';
        }
      };

      return { formConfig, lableLayoutChange };
    },
  });
</script>
