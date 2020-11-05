import type { PropType } from 'vue';
import type { FormProps } from './types/form';
import type { FormSchema } from './types/form';
import type { ValidationRule } from 'ant-design-vue/lib/form/Form';

import { defineComponent, computed, unref, toRef } from 'vue';
import { Form, Col } from 'ant-design-vue';
import { componentMap } from './componentMap';
import { BasicHelp } from '/@/components/Basic';

import { isBoolean, isFunction } from '/@/utils/is';
import { getSlot } from '/@/utils/helper/tsxHelper';
import { createPlaceholderMessage } from './helper';
import { upperFirst, cloneDeep } from 'lodash-es';

import { useItemLabelWidth } from './hooks/useLabelWidth';
import { ComponentType } from './types';
import { isNumber } from '../../../utils/is';

export default defineComponent({
  name: 'BasicFormItem',
  inheritAttrs: false,
  props: {
    schema: {
      type: Object as PropType<FormSchema>,
      default: () => {},
    },
    formProps: {
      type: Object as PropType<FormProps>,
      default: {},
    },
    allDefaultValues: {
      type: Object as PropType<any>,
      default: {},
    },
    formModel: {
      type: Object as PropType<any>,
      default: {},
    },
  },
  setup(props, { slots }) {
    const itemLabelWidthRef = useItemLabelWidth(toRef(props, 'schema'), toRef(props, 'formProps'));

    const getValuesRef = computed(() => {
      const { allDefaultValues, formModel, schema } = props;
      const { mergeDynamicData } = props.formProps;
      return {
        field: schema.field,
        model: formModel,
        values: {
          ...mergeDynamicData,
          ...allDefaultValues,
          ...formModel,
        },
        schema: schema,
      };
    });

    const getDisableRef = computed(() => {
      const { disabled: globDisabled } = props.formProps;
      const { dynamicDisabled, componentProps = {} } = props.schema;
      const { disabled: itemDisabled = false } = componentProps;
      let disabled = !!globDisabled || itemDisabled;
      if (isBoolean(dynamicDisabled)) {
        disabled = dynamicDisabled;
      }

      if (isFunction(dynamicDisabled)) {
        disabled = dynamicDisabled(unref(getValuesRef));
      }

      return disabled;
    });

    function getShow() {
      const { show, ifShow } = props.schema;
      const { showAdvancedButton } = props.formProps;
      const itemIsAdvanced = showAdvancedButton ? !!props.schema.isAdvanced : true;
      let isShow = true;
      let isIfShow = true;

      if (isBoolean(show)) {
        isShow = show;
      }
      if (isBoolean(ifShow)) {
        isIfShow = ifShow;
      }
      if (isFunction(show)) {
        isShow = show(unref(getValuesRef));
      }
      if (isFunction(ifShow)) {
        isIfShow = ifShow(unref(getValuesRef));
      }
      isShow = isShow && itemIsAdvanced;
      return { isShow, isIfShow };
    }

    function handleRules(): ValidationRule[] {
      const {
        rules: defRules = [],
        component,
        rulesMessageJoinLabel,
        label,
        dynamicRules,
        required,
      } = props.schema;

      if (isFunction(dynamicRules)) {
        return dynamicRules(unref(getValuesRef));
      }

      let rules: ValidationRule[] = cloneDeep(defRules);

      if ((!rules || rules.length === 0) && required) {
        rules = [{ required }];
      }

      const requiredRuleIndex: number = rules.findIndex(
        (rule) => Reflect.has(rule, 'required') && !Reflect.has(rule, 'validator')
      );
      const { rulesMessageJoinLabel: globalRulesMessageJoinLabel } = props.formProps;
      if (requiredRuleIndex !== -1) {
        const rule = rules[requiredRuleIndex];
        if (rule.required && component) {
          const joinLabel = Reflect.has(props.schema, 'rulesMessageJoinLabel')
            ? rulesMessageJoinLabel
            : globalRulesMessageJoinLabel;
          rule.message =
            rule.message || createPlaceholderMessage(component) + `${joinLabel ? label : ''}`;
          if (component.includes('Input') || component.includes('Textarea')) {
            rule.whitespace = true;
          }
          if (
            component.includes('DatePicker') ||
            component.includes('MonthPicker') ||
            component.includes('WeekPicker') ||
            component.includes('TimePicker')
          ) {
            rule.type = 'object';
          }
          if (component.includes('RangePicker')) {
            rule.type = 'array';
          }
        }
      }

      // 最大输入长度规则校验
      const characterInx = rules.findIndex((val) => val.max);
      if (characterInx !== -1 && !rules[characterInx].validator) {
        rules[characterInx].message =
          rules[characterInx].message || `字符数应小于${rules[characterInx].max}位`;
      }
      return rules;
    }

    function handleValue(component: ComponentType, field: string) {
      const val = (props.formModel as any)[field];
      if (['Input', 'InputPassword', 'InputSearch', 'InputTextArea'].includes(component)) {
        if (val && isNumber(val)) {
          (props.formModel as any)[field] = `${val}`;
          return `${val}`;
        }
        return val;
      }
      return val;
    }

    function renderComponent() {
      const {
        componentProps,
        renderComponentContent,
        component,
        field,
        changeEvent = 'change',
      } = props.schema;

      const isCheck = component && ['Switch'].includes(component);

      const eventKey = `on${upperFirst(changeEvent)}`;
      const on = {
        [eventKey]: (e: any) => {
          if (propsData[eventKey]) {
            propsData[eventKey](e);
          }
          (props.formModel as any)[field] = e && e.target ? e.target.value : e;
        },
      };
      const Comp = componentMap.get(component);

      const { autoSetPlaceHolder, size } = props.formProps;
      const propsData: any = {
        allowClear: true,
        getPopupContainer: (trigger: Element) => trigger.parentNode,
        size,
        ...componentProps,
        disabled: unref(getDisableRef),
      };

      const isCreatePlaceholder = !propsData.disabled && autoSetPlaceHolder;
      let placeholder;
      // RangePicker place为数组
      if (isCreatePlaceholder && component !== 'RangePicker' && component) {
        placeholder =
          (componentProps && componentProps.placeholder) || createPlaceholderMessage(component);
      }
      propsData.placeholder = placeholder;
      propsData.codeField = field;
      propsData.formValues = unref(getValuesRef);
      const bindValue = {
        [isCheck ? 'checked' : 'value']: handleValue(component, field),
      };
      if (!renderComponentContent) {
        return <Comp {...propsData} {...on} {...bindValue} />;
      }

      return (
        <Comp {...propsData} {...on} {...bindValue}>
          {{
            ...renderComponentContent(unref(getValuesRef)),
          }}
        </Comp>
      );
    }

    function renderLabelHelpMessage() {
      const { label, helpMessage, helpComponentProps } = props.schema;
      if (!helpMessage || (Array.isArray(helpMessage) && helpMessage.length === 0)) {
        return label;
      }
      return (
        <span>
          {label}
          <BasicHelp class="mx-1" text={helpMessage} {...helpComponentProps} />
        </span>
      );
    }

    function renderItem() {
      const { itemProps, slot, render, field } = props.schema;
      const { labelCol, wrapperCol } = unref(itemLabelWidthRef);
      const { colon } = props.formProps;
      const getContent = () => {
        return slot
          ? getSlot(slots, slot)
          : render
          ? render(unref(getValuesRef))
          : renderComponent();
      };
      return (
        <Form.Item
          name={field}
          colon={colon}
          {...(itemProps as any)}
          label={renderLabelHelpMessage()}
          rules={handleRules()}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
        >
          {() => getContent()}
        </Form.Item>
      );
    }
    return () => {
      const { colProps = {}, colSlot, renderColContent, component } = props.schema;
      if (!componentMap.has(component)) return null;
      const { baseColProps = {} } = props.formProps;
      const realColProps = { ...baseColProps, ...colProps };
      const { isIfShow, isShow } = getShow();
      const getContent = () => {
        return colSlot
          ? getSlot(slots, colSlot)
          : renderColContent
          ? renderColContent(unref(getValuesRef))
          : renderItem();
      };
      return (
        isIfShow && (
          <Col {...realColProps} class={!isShow ? 'hidden' : ''}>
            {() => getContent()}
          </Col>
        )
      );
    };
  },
});
