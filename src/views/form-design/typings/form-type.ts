import { Ref } from 'vue';
import { IAnyObject } from './base-type';
import { IFormConfig, IVFormComponent } from './v-form-component';

export interface IToolbarMethods {
  showModal: (jsonData: IAnyObject) => void;
}

type ChangeTabKey = 1 | 2;
export interface IPropsPanel {
  changeTab: (key: ChangeTabKey) => void;
}
export interface IState {
  // 语言
  locale: any;
  // 公用组件
  baseComponents: IVFormComponent[];
  // 自定义组件
  customComponents: IVFormComponent[];
  // 布局组件
  layoutComponents: IVFormComponent[];
  // 属性面板实例
  propsPanel: Ref<null | IPropsPanel>;
  // json模态框实例
  jsonModal: Ref<null | IToolbarMethods>;
  // 导入json数据模态框
  importJsonModal: Ref<null | IToolbarMethods>;
  // 代码预览模态框
  codeModal: Ref<null | IToolbarMethods>;
  // 预览模态框
  eFormPreview: Ref<null | IToolbarMethods>;

  eFormPreview2: Ref<null | IToolbarMethods>;
}

export interface IFormDesignMethods {
  // 设置当前选中的控件
  handleSetSelectItem(item: IVFormComponent): void;
  // 添加控件到formConfig.formItems中
  handleListPush(item: IVFormComponent): void;
  // 复制控件
  handleCopy(item?: IVFormComponent, isCopy?: boolean): void;
  // 添加控件属性
  handleAddAttrs(schemas: IVFormComponent[], index: number): void;
  setFormConfig(config: IFormConfig): void;
  // 添加到表单中之前触发
  handleBeforeColAdd(
    event: { newIndex: string },
    schemas: IVFormComponent[],
    isCopy?: boolean,
  ): void;
}
