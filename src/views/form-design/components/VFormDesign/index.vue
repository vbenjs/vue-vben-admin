<template>
  <Layout>
    <LayoutSider
      :class="`left ${prefixCls}-sider`"
      collapsible
      collapsedWidth="0"
      width="270"
      :zeroWidthTriggerStyle="{
        'margin-top': '-70px',
        'background-color': 'gray',
      }"
      breakpoint="md"
    >
      <CollapseContainer title="基础控件">
        <CollapseItem
          :list="baseComponents"
          :handleListPush="handleListPushDrag"
          @add-attrs="handleAddAttrs"
          @handle-list-push="handleListPush"
        />
      </CollapseContainer>
      <CollapseContainer title="自定义控件">
        <CollapseItem
          :list="customComponents"
          @add-attrs="handleAddAttrs"
          :handleListPush="handleListPushDrag"
          @handle-list-push="handleListPush"
        />
      </CollapseContainer>
      <CollapseContainer title="布局控件">
        <CollapseItem
          :list="layoutComponents"
          :handleListPush="handleListPushDrag"
          @add-attrs="handleAddAttrs"
          @handle-list-push="handleListPush"
        />
      </CollapseContainer>
    </LayoutSider>
    <LayoutContent>
      <Toolbar
        @handle-open-json-modal="handleOpenModal(jsonModal!)"
        @handle-open-import-json-modal="handleOpenModal(importJsonModal!)"
        @handle-preview="handleOpenModal(eFormPreview!)"
        @handle-preview2="handleOpenModal(eFormPreview2!)"
        @handle-open-code-modal="handleOpenModal(codeModal!)"
        @handle-clear-form-items="handleClearFormItems"
      />
      <FormComponentPanel
        :current-item="formConfig.currentItem"
        :data="formConfig"
        @handle-set-select-item="handleSetSelectItem"
      />
    </LayoutContent>
    <LayoutSider
      :class="`right ${prefixCls}-sider`"
      collapsible
      :reverseArrow="true"
      collapsedWidth="0"
      width="270"
      :zeroWidthTriggerStyle="{ 'margin-top': '-70px', 'background-color': 'gray' }"
      breakpoint="lg"
    >
      <PropsPanel ref="propsPanel" :activeKey="formConfig.activeKey">
        <template v-for="item of formConfig.schemas" #[`${item.component}Props`]="data">
          <slot
            :name="`${item.component}Props`"
            v-bind="{ formItem: data, props: data.componentProps }"
          ></slot>
        </template>
      </PropsPanel>
    </LayoutSider>
  </Layout>

  <JsonModal ref="jsonModal" />
  <CodeModal ref="codeModal" />
  <ImportJsonModal ref="importJsonModal" />
  <VFormPreview ref="eFormPreview" :formConfig="formConfig" />
  <VFormPreview2 ref="eFormPreview2" :formConfig="formConfig" />
</template>

<script lang="ts" setup>
  import CollapseItem from './modules/CollapseItem.vue';
  import FormComponentPanel from './modules/FormComponentPanel.vue';
  import JsonModal from './components/JsonModal.vue';
  import VFormPreview from '../VFormPreview/index.vue';
  import VFormPreview2 from '../VFormPreview/useForm.vue';

  import Toolbar from './modules/Toolbar.vue';
  import PropsPanel from './modules/PropsPanel.vue';
  import ImportJsonModal from './components/ImportJsonModal.vue';
  import CodeModal from './components/CodeModal.vue';

  import 'codemirror/mode/javascript/javascript';

  import { ref, provide, Ref } from 'vue';
  import { Layout, LayoutContent, LayoutSider } from 'ant-design-vue';

  import { IVFormComponent, IFormConfig, PropsTabKey } from '../../typings/v-form-component';
  import { formItemsForEach, generateKey } from '../../utils';
  import { cloneDeep } from 'lodash-es';
  import { baseComponents, customComponents, layoutComponents } from '../../core/formItemConfig';
  import { useRefHistory, UseRefHistoryReturn } from '@vueuse/core';
  import { globalConfigState } from './config/formItemPropsConfig';
  import { IFormDesignMethods, IPropsPanel, IToolbarMethods } from '../../typings/form-type';
  import { useDesign } from '/@/hooks/web/useDesign';

  import { CollapseContainer } from '/@/components/Container/index';

  defineProps({
    title: {
      type: String,
      default: 'v-form-antd表单设计器',
    },
  });
  const { prefixCls } = useDesign('form-design');
  // 子组件实例
  const propsPanel = ref<null | IPropsPanel>(null);
  const jsonModal = ref<null | IToolbarMethods>(null);
  const importJsonModal = ref<null | IToolbarMethods>(null);
  const eFormPreview = ref<null | IToolbarMethods>(null);
  const eFormPreview2 = ref<null | IToolbarMethods>(null);

  const codeModal = ref<null | IToolbarMethods>(null);

  const formModel = ref({});
  // endregion
  const formConfig = ref<IFormConfig>({
    // 表单配置
    schemas: [],
    layout: 'horizontal',
    labelLayout: 'flex',
    labelWidth: 100,
    labelCol: {},
    wrapperCol: {},
    currentItem: {
      component: '',
      componentProps: {},
    },
    activeKey: 1,
  });

  const setFormConfig = (config: IFormConfig) => {
    //外部导入时，可能会缺少必要的信息。
    config.schemas = config.schemas || [];
    config.schemas.forEach((item) => {
      item.colProps = item.colProps || { span: 24 };
      item.componentProps = item.componentProps || {};
      item.itemProps = item.itemProps || {};
    });
    formConfig.value = config;
  };
  // 获取历史记录，用于撤销和重构
  const historyReturn = useRefHistory(formConfig, {
    deep: true,
    capacity: 20,
    parse: (val: IFormConfig) => {
      // 使用lodash.cloneDeep重新拷贝数据，把currentItem指向选中项
      const formConfig = cloneDeep(val);
      const { currentItem, schemas } = formConfig;
      // 从formItems中查找选中项

      const item = schemas && schemas.find((item) => item.key === currentItem?.key);
      // 如果有，则赋值给当前项，如果没有，则切换属性面板
      if (item) {
        formConfig.currentItem = item;
      }
      return formConfig;
    },
  });

  /**
   * 选中表单项
   * @param schema 当前选中的表单项
   */
  const handleSetSelectItem = (schema: IVFormComponent) => {
    formConfig.value.currentItem = schema;
    handleChangePropsTabs(
      schema.key ? (formConfig.value.activeKey! === 1 ? 2 : formConfig.value.activeKey!) : 1,
    );
  };

  const setGlobalConfigState = (formItem: IVFormComponent) => {
    formItem.colProps = formItem.colProps || {};
    formItem.colProps.span = globalConfigState.span;
    // console.log('setGlobalConfigState', formItem);
  };

  /**
   * 添加属性
   * @param schemas
   * @param index
   */
  const handleAddAttrs = (_formItems: IVFormComponent[], _index: number) => {};

  const handleListPushDrag = (item: IVFormComponent) => {
    const formItem = cloneDeep(item);
    setGlobalConfigState(formItem);
    generateKey(formItem);

    return formItem;
  };
  /**
   * 单击控件时添加到面板中
   * @param item {IVFormComponent} 当前点击的组件
   */
  const handleListPush = (item: IVFormComponent) => {
    // console.log('handleListPush', item);
    const formItem = cloneDeep(item);
    setGlobalConfigState(formItem);
    generateKey(formItem);
    if (!formConfig.value.currentItem?.key) {
      handleSetSelectItem(formItem);
      formConfig.value.schemas && formConfig.value.schemas.push(formItem);

      return;
    }
    handleCopy(formItem, false);
  };

  /**
   * 复制表单项，如果表单项为栅格布局，则遍历所有自表单项重新生成key
   * @param {IVFormComponent} formItem
   * @return {IVFormComponent}
   */
  const copyFormItem = (formItem: IVFormComponent) => {
    const newFormItem = cloneDeep(formItem);
    if (newFormItem.component === 'Grid') {
      formItemsForEach([formItem], (item) => {
        generateKey(item);
      });
    }
    return newFormItem;
  };
  /**
   * 复制或者添加表单，isCopy为true时则复制表单
   * @param item {IVFormComponent} 当前点击的组件
   * @param isCopy {boolean} 是否复制
   */
  const handleCopy = (
    item: IVFormComponent = formConfig.value.currentItem as IVFormComponent,
    isCopy = true,
  ) => {
    const key = formConfig.value.currentItem?.key;
    /**
     * 遍历当表单项配置，如果是复制，则复制一份表单项，如果不是复制，则直接添加到表单项中
     * @param schemas
     */
    const traverse = (schemas: IVFormComponent[]) => {
      // 使用some遍历，找到目标后停止遍历
      schemas.some((formItem: IVFormComponent, index: number) => {
        if (formItem.key === key) {
          // 判断是不是复制
          isCopy
            ? schemas.splice(index, 0, copyFormItem(formItem))
            : schemas.splice(index + 1, 0, item);
          const event = {
            newIndex: index + 1,
          };
          // 添加到表单项中
          handleBeforeColAdd(event, schemas, isCopy);
          return true;
        }
        if (['Grid', 'Tabs'].includes(formItem.component)) {
          // 栅格布局
          formItem.columns?.forEach((item) => {
            traverse(item.children);
          });
        }
      });
    };
    if (formConfig.value.schemas) {
      traverse(formConfig.value.schemas);
    }
  };

  /**
   * 添加到表单中
   * @param newIndex {object} 事件对象
   * @param schemas {IVFormComponent[]} 表单项列表
   * @param isCopy {boolean} 是否复制
   */
  const handleBeforeColAdd = ({ newIndex }: any, schemas: IVFormComponent[], isCopy = false) => {
    const item = schemas[newIndex];
    isCopy && generateKey(item);
    handleSetSelectItem(item);
  };

  /**
   * 打开模态框
   * @param Modal {IToolbarMethods}
   */
  const handleOpenModal = (Modal: IToolbarMethods) => {
    const config = cloneDeep(formConfig.value);
    Modal?.showModal(config);
  };
  /**
   * 切换属性面板
   * @param key
   */
  const handleChangePropsTabs = (key: PropsTabKey) => {
    formConfig.value.activeKey = key;
  };
  /**
   * 清空表单项列表
   */
  const handleClearFormItems = () => {
    formConfig.value.schemas = [];
    handleSetSelectItem({ component: '' });
  };

  const setFormModel = (key, value) => (formModel.value[key] = value);
  provide('formModel', formModel);
  // 把祖先组件的方法项注入到子组件中，子组件可通过inject获取
  provide<(key: String, value: any) => void>('setFormModelMethod', setFormModel);
  // region 注入给子组件的属性
  // provide('currentItem', formConfig.value.currentItem)

  // 把表单配置项注入到子组件中，子组件可通过inject获取，获取到的数据为响应式
  provide<Ref<IFormConfig>>('formConfig', formConfig);

  // 注入历史记录
  provide<UseRefHistoryReturn<any, any>>('historyReturn', historyReturn);

  // 把祖先组件的方法项注入到子组件中，子组件可通过inject获取
  provide<IFormDesignMethods>('formDesignMethods', {
    handleBeforeColAdd,
    handleCopy,
    handleListPush,
    handleSetSelectItem,
    handleAddAttrs,
    setFormConfig,
  });

  // endregion
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-form-design';

  [data-theme='dark'] {
  .@{prefix-cls}-sider{
    background-color: #1f1f1f;
  }}

  [data-theme='light'] {
    .@{prefix-cls}-sider{
    background-color: #fff;
  }
  }
</style>
