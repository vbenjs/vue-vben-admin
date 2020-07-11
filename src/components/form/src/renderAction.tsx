import { VNode } from 'compatible-vue';
import { Form, Button, Col } from 'ant-design-vue';
import { FormProps, ActionButtonOption } from './types/form';
import { ColEx } from './types/index';

// import {} from '@/utils/'
export function renderAction(props: FormProps): VNode | boolean {
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

  const actionColOpt: Partial<ColEx> = {
    // md: 4,
    // lg: 4,
    // xl: 4,
    span: 4,
    ...actionColOptions,
  };
  const { showActionButtonGroup, showResetButton, showSubmitButton } = props;
  return (
    showActionButtonGroup && (
      <Col props={actionColOpt} style={{ textAlign: 'right' }}>
        <Form.Item>
          {showResetButton && (
            <Button type="default" class="mr-2" props={resetBtnOptions} on={resetBtnOptions.on}>
              {resetBtnOptions.text}
            </Button>
          )}
          {showSubmitButton && (
            <Button type="primary" props={submitBtnOptions} on={submitBtnOptions.on}>
              {submitBtnOptions.text}
            </Button>
          )}
        </Form.Item>
      </Col>
    )
  );
}
