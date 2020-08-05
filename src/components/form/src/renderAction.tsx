import { VNode, Ref, unref } from 'compatible-vue';
import { Form, Col } from 'ant-design-vue';
import { Icon } from '@/components/icon/index';
import { FormProps, ActionButtonOption } from './types/form';
import { ColEx } from './types/index';

// import {} from '@/utils/'
export function renderAction({
  props,
  isAdvancedRef,
  hideAdvanceBtnRef,
  actionSpanRef,
}: {
  props: FormProps;
  isAdvancedRef: Ref<boolean>;
  hideAdvanceBtnRef: Ref<boolean>;
  actionSpanRef: Ref<number>;
}): VNode | boolean {
  const { resetButtonOptions, submitButtonOptions, actionColOptions } = props;

  const resetBtnOptions: Partial<ActionButtonOption> = {
    text: '重置',
    ...resetButtonOptions,
  };

  const submitBtnOptions: Partial<ActionButtonOption> = {
    text: '查询',
    htmlType: 'submit',
    ...submitButtonOptions,
  };

  const { showActionButtonGroup, showResetButton, showSubmitButton, showAdvancedButton } = props;
  const actionSpan = 24 - unref(actionSpanRef);
  const advancedSpanObj = showAdvancedButton ? { span: actionSpan < 6 ? 24 : actionSpan } : {};
  const actionColOpt: Partial<ColEx> = {
    // md: 4,
    // lg: 4,
    // xl: 4,
    span: showAdvancedButton ? 6 : 4,
    ...actionColOptions,
    ...advancedSpanObj,
  };

  function toggleAdvanced() {
    // 展开的状态：isAdvanced===true
    isAdvancedRef.value = !unref(isAdvancedRef);
  }
  return (
    showActionButtonGroup && (
      <Col props={actionColOpt} style={{ textAlign: 'right' }}>
        <Form.Item>
          {showAdvancedButton && !unref(hideAdvanceBtnRef) && (
            <a-button type="default" class="mr-2" onClick={toggleAdvanced}>
              {unref(isAdvancedRef) ? '收起' : '展开'}
              <Icon type={unref(isAdvancedRef) ? 'up' : 'down'} class="advanced-icon" />
            </a-button>
          )}
          {showResetButton && (
            <a-button type="default" class="mr-2" props={resetBtnOptions} on={resetBtnOptions.on}>
              {resetBtnOptions.text}
            </a-button>
          )}
          {showSubmitButton && (
            <a-button type="primary" props={submitBtnOptions} on={submitBtnOptions.on}>
              {submitBtnOptions.text}
            </a-button>
          )}
        </Form.Item>
      </Col>
    )
  );
}
