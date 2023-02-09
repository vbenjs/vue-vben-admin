import { Ref, SetupContext } from 'vue';
import { IVFormComponent, IFormConfig, AForm } from '../typings/v-form-component';
import { findFormItem, formItemsForEach } from '../utils';
import { cloneDeep, isFunction } from 'lodash-es';
import { IAnyObject } from '../typings/base-type';

interface IFormInstanceMethods extends AForm {
  submit: () => Promise<any>;
}

export interface IProps {
  formConfig: IFormConfig;
  formModel: IAnyObject;
}

type ISet = <T extends keyof IVFormComponent>(
  field: string,
  key: T,
  value: IVFormComponent[T],
) => void;
// 获取当前field绑定的表单项
type IGet = (field: string) => IVFormComponent | undefined;
// 获取field在formData中的值
type IGetValue = (field: string) => any;
// 设置field在formData中的值并且触发校验
type ISetValue = (field: string | IAnyObject, value?: any) => void;
// 隐藏field对应的表单项
type IHidden = (field: string) => void;
// 显示field对应的表单项
type IShow = (field: string) => void;
// 设置field对应的表单项绑定的props属性
type ISetProps = (field: string, key: string, value: any) => void;
// 获取formData中的值
type IGetData = () => Promise<IAnyObject>;
// 禁用表单，如果field为空，则禁用整个表单
type IDisable = (field?: string | boolean) => void;
// 设置表单配置方法
type ISetFormConfig = (key: string, value: any) => void;
interface ILinkOn {
  [key: string]: Set<IVFormComponent>;
}

export interface IVFormMethods extends Partial<IFormInstanceMethods> {
  set: ISet;
  get: IGet;
  getValue: IGetValue;
  setValue: ISetValue;
  hidden: IHidden;
  show: IShow;
  setProps: ISetProps;
  linkOn: ILinkOn;
  getData: IGetData;
  disable: IDisable;
}
export function useVFormMethods(
  props: IProps,
  _context: Partial<SetupContext>,
  formInstance: Ref<AForm | null>,
  formInstanceMethods: Partial<IFormInstanceMethods>,
): IVFormMethods {
  /**
   * 根据field获取表单项
   * @param {string} field
   * @return {IVFormComponent | undefined}
   */
  const get: IGet = (field) =>
    findFormItem(props.formConfig.schemas, (item) => item.field === field);

  /**
   * 根据表单field设置表单项字段值
   * @param {string} field
   * @param {keyof IVFormComponent} key
   * @param {never} value
   */
  const set: ISet = (field, key, value) => {
    const formItem = get(field);
    if (formItem) formItem[key] = value;
  };

  /**
   * 设置表单项的props
   * @param {string} field 需要设置的表单项field
   * @param {string} key 需要设置的key
   * @param value 需要设置的值
   */
  const setProps: ISetProps = (field, key, value) => {
    const formItem = get(field);
    if (formItem?.componentProps) {
      ['options', 'treeData'].includes(key) && setValue(field, undefined);

      formItem.componentProps[key] = value;
    }
  };
  /**
   * 设置字段的值，设置后触发校验
   * @param {string} field  需要设置的字段
   * @param value  需要设置的值
   */
  const setValue: ISetValue = (field, value) => {
    if (typeof field === 'string') {
      // props.formData[field] = value
      props.formModel[field] = value;
      formInstance.value?.validateField(field, value, []);
    } else {
      const keys = Object.keys(field);
      keys.forEach((key) => {
        props.formModel[key] = field[key];
        formInstance.value?.validateField(key, field[key], []);
      });
    }
  };
  /**
   * 设置表单配置方法
   * @param {string} key
   * @param value
   */
  const setFormConfig: ISetFormConfig = (key, value) => {
    props.formConfig[key] = value;
  };
  /**
   * 根据表单项field获取字段值，如果field为空，则
   * @param {string} field  需要设置的字段
   */
  const getValue: IGetValue = (field) => {
    const formData = cloneDeep(props.formModel);
    return formData[field];
  };

  /**
   * 获取formData中的值
   * @return {Promise<IAnyObject<any>>}
   */
  const getData: IGetData = async () => {
    return cloneDeep(props.formModel);
  };
  /**
   * 隐藏指定表单项
   * @param {string} field 需要隐藏的表单项的field
   */
  const hidden: IHidden = (field) => {
    set(field, 'hidden', true);
  };

  /**
   * 禁用表单
   * @param {string | undefined} field
   */
  const disable: IDisable = (field) => {
    typeof field === 'string'
      ? setProps(field, 'disabled', true)
      : setFormConfig('disabled', field !== false);
  };

  /**
   * 显示表单项
   * @param {string} field 需要显示的表单项的field
   */
  const show: IShow = (field) => {
    set(field, 'hidden', false);
  };

  /**
   * 监听表单字段联动时触发
   * @type {ILinkOn}
   */
  const linkOn: ILinkOn = {};
  const initLink = (schemas: IVFormComponent[]) => {
    // 首次遍历，查找需要关联字段的表单
    formItemsForEach(schemas, (formItem) => {
      // 如果需要关联，则进行第二层遍历，查找表单中关联的字段，存到Set中
      formItemsForEach(schemas, (item) => {
        if (!linkOn[item.field!]) linkOn[item.field!] = new Set<IVFormComponent>();
        if (formItem.link?.includes(item.field!) && isFunction(formItem.update)) {
          linkOn[item.field!].add(formItem);
        }
      });
      linkOn[formItem.field!].add(formItem);
    });
  };
  initLink(props.formConfig.schemas);

  return {
    linkOn,
    setValue,
    getValue,
    hidden,
    show,
    set,
    get,
    setProps,
    getData,
    disable,
    ...formInstanceMethods,
  };
}
