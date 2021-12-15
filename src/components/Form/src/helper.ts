import type { ValidationRule } from 'ant-design-vue/lib/form/Form';
import type { ComponentType } from './types/index';
import { useI18n } from '/@/hooks/web/useI18n';
import { dateUtil } from '/@/utils/dateUtil';
import { isNumber, isObject, isString } from '/@/utils/is';
import { get, has, set, unset } from 'lodash-es';

const { t } = useI18n();

/**
 * @description: 生成placeholder
 */
export function createPlaceholderMessage(component: ComponentType) {
  if (component.includes('Input') || component.includes('Complete')) {
    return t('common.inputText');
  }
  if (component.includes('Picker')) {
    return t('common.chooseText');
  }
  if (
    component.includes('Select') ||
    component.includes('Cascader') ||
    component.includes('Checkbox') ||
    component.includes('Radio') ||
    component.includes('Switch')
  ) {
    // return `请选择${label}`;
    return t('common.chooseText');
  }
  return '';
}

const SINGLE_VALUE_DATE_TYPE = ['DatePicker', 'MonthPicker', 'WeekPicker', 'TimePicker'];
const RANGE_VALUE_DATE_TYPE = ['RangePicker'];

function genType() {
  return [...SINGLE_VALUE_DATE_TYPE, ...RANGE_VALUE_DATE_TYPE];
}

export function setComponentRuleType(
  rule: ValidationRule,
  component: ComponentType,
  valueFormat: string,
) {
  if (['DatePicker', 'MonthPicker', 'WeekPicker', 'TimePicker'].includes(component)) {
    rule.type = valueFormat ? 'string' : 'object';
  } else if (['RangePicker', 'Upload', 'CheckboxGroup', 'TimePicker'].includes(component)) {
    rule.type = 'array';
  } else if (['InputNumber'].includes(component)) {
    rule.type = 'number';
  }
}

export function processDateValue(attr: Recordable, component: string) {
  const { valueFormat, value } = attr;
  if (valueFormat) {
    attr.value = isObject(value) ? dateUtil(value).format(valueFormat) : value;
  } else if (SINGLE_VALUE_DATE_TYPE.includes(component) && value) {
    attr.value = dateUtil(attr.value);
  }
}

export function handleInputNumberValue(component?: ComponentType, val?: any) {
  if (!component) return val;
  if (['Input', 'InputPassword', 'InputSearch', 'InputTextArea'].includes(component)) {
    return val && isNumber(val) ? `${val}` : val;
  }
  return val;
}

/**
 * 时间字段
 */
export const dateItemType = genType();
/**
 * 单值时间字段
 */
export const singleDateItemType = SINGLE_VALUE_DATE_TYPE;
/**
 * 范围时间字段
 */
export const rangeDateItemType = RANGE_VALUE_DATE_TYPE;

/**
 * 获取指定对象的属性，支持Ant Design Vue的NamePath形式
 * 为了兼容原来的扁平化属性的方式，比如target['a.b']
 * 如果属性的名称为字符型，采用target[property]的获取
 * 如果需要获取嵌套的对象属性，属性参数需要为数组
 */
export function getProperty(target: object, property: string | number | (string | number)[]) {
  return isString(property) ? target[property] : get(target, property);
}

/**
 * 设置指定对象的属性，属性参数的规则同获取方法
 */
export function setProperty(
  target: object,
  property: string | number | (string | number)[],
  value: any,
) {
  return isString(property) ? (target[property] = value) : set(target, property, value);
}
/**
 * 删除指定对象的属性，属性参数的规则同获取方法
 */
export function deleteProperty(target: object, property: string | number | (string | number)[]) {
  return isString(property) ? Reflect.deleteProperty(target, property) : unset(target, property);
}
/**
 * 判断指定对象是否含有指定的属性，属性参数的规则同获取方法
 */
export function hasProperty(target: object, property: string | number | (string | number)[]) {
  return isString(property) ? Reflect.has(target, property) : has(target, property);
}
