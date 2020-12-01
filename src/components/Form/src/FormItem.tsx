import type { PropType } from 'vue';
import type { FormActionType, FormProps } from './types/form';
import type { FormSchema } from './types/form';
import type { ValidationRule } from 'ant-design-vue/lib/form/Form';
import type { TableActionType } from '/@/components/Table';

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
import { isNumber } from '/@/utils/is';
import { useI18n } from '/@/hooks/web/useI18n';

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
    tableAction: {
      type: Object as PropType<TableActionType>,
    },
    formActionType: {
      type: Object as PropType<FormActionType>,
    },
  },
  setup(props, { slots }) {
    const { t } = useI18n();
    // @ts-ignore
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

    const getComponentsPropsRef = computed(() => {
      const { schema, tableAction, formModel, formActionType } = props;
      const { componentProps = {} } = schema;
      if (!isFunction(componentProps)) {
        return componentProps;
      }
      return componentProps({ schema, tableAction, formModel, formActionType }) || {};
    });

    const getDisableRef = computed(() => {
      const { disabled: globDisabled } = props.formProps;
      const { dynamicDisabled } = props.schema;
      const { disabled: itemDisabled = false } = unref(getComponentsPropsRef);
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
      const itemIsAdvanced = showAdvancedButton
        ? isBoolean(props.schema.isAdvanced)
          ? props.schema.isAdvanced
          : true
        : true;
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
        return dynamicRules(unref(getValuesRef)) as ValidationRule[];
      }

      let rules: ValidationRule[] = cloneDeep(defRules) as ValidationRule[];

      if ((!rules || rules.length === 0) && required) {
        rules = [{ required, type: 'string' }];
      }

      const requiredRuleIndex: number = rules.findIndex(
        (rule) => Reflect.has(rule, 'required') && !Reflect.has(rule, 'validator')
      );
      const { rulesMessageJoinLabel: globalRulesMessageJoinLabel } = props.formProps;
      if (requiredRuleIndex !== -1) {
        const rule = rules[requiredRuleIndex];
        if (rule.required && component) {
          if (!Reflect.has(rule, 'type')) {
            rule.type = 'string';
          }
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
          } else if (component.includes('RangePicker') || component.includes('Upload')) {
            rule.type = 'array';
          } else if (component.includes('InputNumber')) {
            rule.type = 'number';
          }
        }
      }

      // 最大输入长度规则校验
      const characterInx = rules.findIndex((val) => val.max);
      if (characterInx !== -1 && !rules[characterInx].validator) {
        rules[characterInx].message =
          rules[characterInx].message || t('component.form.maxTip', [rules[characterInx].max]);
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
        renderComponentContent,
        component,
        field,
        changeEvent = 'change',
        valueField,
      } = props.schema;

      const isCheck = component && ['Switch', 'Checkbox'].includes(component);

      const eventKey = `on${upperFirst(changeEvent)}`;

      const on = {
        [eventKey]: (e: any) => {
          if (propsData[eventKey]) {
            propsData[eventKey](e);
          }

          const target = e ? e.target : null;
          const value = target ? (isCheck ? target.checked : target.value) : e;
          (props.formModel as any)[field] = value;
        },
      };
      const Comp = componentMap.get(component);

      const { autoSetPlaceHolder, size } = props.formProps;
      const propsData: any = {
        allowClear: true,
        getPopupContainer: (trigger: Element) => trigger.parentNode,
        size,
        ...unref(getComponentsPropsRef),
        disabled: unref(getDisableRef),
      };

      const isCreatePlaceholder = !propsData.disabled && autoSetPlaceHolder;
      let placeholder;
      // RangePicker place为数组
      if (isCreatePlaceholder && component !== 'RangePicker' && component) {
        placeholder =
          (unref(getComponentsPropsRef) && unref(getComponentsPropsRef).placeholder) ||
          createPlaceholderMessage(component);
      }
      propsData.placeholder = placeholder;
      propsData.codeField = field;
      propsData.formValues = unref(getValuesRef);
      const bindValue = {
        [valueField || (isCheck ? 'checked' : 'value')]: handleValue(component, field),
      };

      if (!renderComponentContent) {
        return <Comp {...propsData} {...on} {...bindValue} />;
      }
      const compSlot = isFunction(renderComponentContent)
        ? { ...renderComponentContent(unref(getValuesRef)) }
        : {
            default: () => renderComponentContent,
          };

      return (
        <Comp {...propsData} {...on} {...bindValue}>
          {compSlot}
        </Comp>
      );
    }

    function renderLabelHelpMessage() {
      const { label, helpMessage, helpComponentProps, subLabel } = props.schema;
      const renderLabel = subLabel ? (
        <span>
          {label} <span style="color:#00000073">{subLabel}</span>
        </span>
      ) : (
        label
      );
      if (!helpMessage || (Array.isArray(helpMessage) && helpMessage.length === 0)) {
        return renderLabel;
      }
      return (
        <span>
          {renderLabel}
          <BasicHelp placement="top" class="mx-1" text={helpMessage} {...helpComponentProps} />
        </span>
      );
    }

    function renderItem() {
      const { itemProps, slot, render, field } = props.schema;
      const { labelCol, wrapperCol } = unref(itemLabelWidthRef);
      const { colon } = props.formProps;
      const getContent = () => {
        return slot
          ? getSlot(slots, slot, unref(getValuesRef))
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
          ? getSlot(slots, colSlot, unref(getValuesRef))
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
