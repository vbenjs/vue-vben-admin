import type { SmartAddEditModalCallbackData } from '@/components/SmartTable';

import { computed, defineComponent, ref, unref } from 'vue';

import { message } from 'ant-design-vue';

import { BasicModal, useModalInner } from '@/components/Modal';
import { BasicForm, FormProps, useForm } from '@/components/Form';
import { isBoolean, isPromise, isFunction } from '@/utils/is';
import { useI18n } from '@/hooks/web/useI18n';
import { propTypes } from '@/utils/propTypes';

export default defineComponent({
  name: 'SmartTableAddEditModal',
  props: {
    formConfig: {
      type: Object as PropType<FormProps>,
      required: true,
    },
    beforeSave: {
      type: Function as PropType<(data) => any | Promise<any>>,
    },
    saveFunction: Function as PropType<(data) => Promise<any>>,
    afterSave: Function as PropType<(data?) => boolean | Promise<boolean> | undefined>,
    tableId: propTypes.string,
  },
  setup(props) {
    const { t } = useI18n();
    const isAddRef = ref(true);
    const computedTitle = computed(() => {
      return unref(isAddRef) ? t('common.title.add') : t('common.title.edit');
    });

    const [registerForm, formAction] = useForm();
    const { resetFields, getFieldsValue, setFieldsValue, validate, validateFields } = formAction;
    const [register, { changeLoading, changeOkLoading, closeModal }] = useModalInner(
      (data: SmartAddEditModalCallbackData) => {
        const { isAdd, formData } = data;
        resetFields();
        isAddRef.value = isAdd;
        if (isAdd) {
          setFieldsValue({
            ...(formData || {}),
            isAdd,
          });
          return false;
        }
        loadEditData(data);
      },
    );

    const loadEditData = async (data: SmartAddEditModalCallbackData) => {
      const { getFunction, validateFunction, selectData, isAdd, formData } = data;
      try {
        if (!isFunction(getFunction)) {
          throw new Error('proxyConfig.ajax.getById未定义');
        }
        changeLoading(true);
        const editData = await getFunction(selectData);
        // todo: 触发事件
        if (isFunction(validateFunction)) {
          const result = validateFunction(data, selectData);
          if (isBoolean(result) && !result) {
            return false;
          }
          if (isPromise(result)) {
            const promiseResult = await result;
            if (isBoolean(promiseResult) && !promiseResult) {
              return false;
            }
          }
        }
        setFieldsValue({
          ...editData,
          formData,
          isAdd,
        });
      } finally {
        changeLoading(false);
      }
    };

    const handleSubmit = async () => {
      try {
        let data = await validate();
        changeOkLoading(true);
        // 保存前对参数进行处理
        const beforeSave = props.beforeSave;
        if (beforeSave) {
          if (!isFunction(beforeSave)) {
            throw new Error('参数错误，beforeSave必须是Function');
          }
          const result = beforeSave(data);
          if (isPromise(result)) {
            data = await result;
          } else {
            data = result;
          }
        }
        const saveFunction = props.saveFunction;
        if (!saveFunction) {
          throw new Error('proxyConfig.ajax.save未定义，无法执行保存操作');
        }
        const saveResult = await saveFunction({
          body: {
            insertRecords: unref(isAddRef) ? [data] : [],
            updateRecords: unref(isAddRef) ? [] : [data],
          },
        });
        if (props.afterSave) {
          let afterSaveResult = props.afterSave(saveResult);
          if (isPromise(afterSaveResult)) {
            afterSaveResult = await afterSaveResult;
          }
          if (isBoolean(afterSaveResult) && !afterSaveResult) {
            // 返回结果验证错误，停止执行
            return false;
          }
        }
        message.success(
          unref(isAddRef) ? t('common.message.saveSuccess') : t('common.message.editSuccess'),
        );
        closeModal();
      } finally {
        changeOkLoading(false);
      }
    };

    return {
      register,
      registerForm,
      resetFields,
      getFieldsValue,
      setFieldsValue,
      handleSubmit,
      validate,
      validateFields,
      getFormAction: () => formAction,
      computedTitle,
    };
  },
  render() {
    const {
      $attrs,
      register,
      registerForm,
      handleSubmit,
      $slots,
      tableId,
      formConfig,
      computedTitle,
    } = this;
    const attrs = {
      ...$attrs,
      onRegister: register,
      title: computedTitle,
    };
    return (
      <BasicModal {...attrs} onOk={handleSubmit}>
        <BasicForm {...formConfig} name={`${tableId}_addEdit_form`} onRegister={registerForm}>
          {$slots}
        </BasicForm>
      </BasicModal>
    );
  },
});
