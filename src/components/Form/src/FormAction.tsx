import type { ColEx } from './types/index';

import { defineComponent, unref, computed, PropType } from 'vue';
import { Form, Col } from 'ant-design-vue';
import { Button } from '/@/components/Button';
import { BasicArrow } from '/@/components/Basic/index';

import { getSlot } from '/@/utils/helper/tsxHelper';
import { useI18n } from '/@/hooks/web/useI18n';
import { propTypes } from '/@/utils/propTypes';

const { t } = useI18n();

export default defineComponent({
  name: 'BasicFormAction',
  props: {
    show: propTypes.bool.def(true),
    showResetButton: propTypes.bool.def(true),
    showSubmitButton: propTypes.bool.def(true),
    showAdvancedButton: propTypes.bool.def(true),
    resetButtonOptions: {
      type: Object as PropType<any>,
      default: {},
    },
    submitButtonOptions: {
      type: Object as PropType<any>,
      default: {},
    },
    actionColOptions: {
      type: Object as PropType<any>,
      default: {},
    },
    actionSpan: propTypes.number.def(6),
    isAdvanced: propTypes.bool,
    hideAdvanceBtn: propTypes.bool,
  },
  emits: ['toggle-advanced'],
  setup(props, { slots, emit }) {
    const getResetBtnOptionsRef = computed(() => {
      return {
        text: t('component.form.resetButton'),
        ...props.resetButtonOptions,
      };
    });

    const getSubmitBtnOptionsRef = computed(() => {
      return {
        text: t('component.form.submitButton'),
        // htmlType: 'submit',
        ...props.submitButtonOptions,
      };
    });

    const actionColOpt = computed(() => {
      const { showAdvancedButton, actionSpan: span, actionColOptions } = props;
      const actionSpan = 24 - span;
      const advancedSpanObj = showAdvancedButton ? { span: actionSpan < 6 ? 24 : actionSpan } : {};
      const actionColOpt: Partial<ColEx> = {
        span: showAdvancedButton ? 6 : 4,
        ...advancedSpanObj,
        ...actionColOptions,
      };
      return actionColOpt;
    });

    function toggleAdvanced() {
      emit('toggle-advanced');
    }

    function renderAdvanceButton() {
      const { showAdvancedButton, hideAdvanceBtn, isAdvanced } = props;

      if (!showAdvancedButton || !!hideAdvanceBtn) {
        return null;
      }
      return (
        <Button type="default" class="mr-2" onClick={toggleAdvanced}>
          {() => (
            <>
              {isAdvanced ? t('component.form.putAway') : t('component.form.unfold')}
              <BasicArrow expand={!isAdvanced} top />
            </>
          )}
        </Button>
      );
    }

    function renderResetButton() {
      const { showResetButton } = props;
      if (!showResetButton) {
        return null;
      }
      return (
        <Button type="default" class="mr-2" {...unref(getResetBtnOptionsRef)}>
          {() => unref(getResetBtnOptionsRef).text}
        </Button>
      );
    }

    function renderSubmitButton() {
      const { showSubmitButton } = props;
      if (!showSubmitButton) {
        return null;
      }
      return (
        <Button type="primary" {...unref(getSubmitBtnOptionsRef)}>
          {() => unref(getSubmitBtnOptionsRef).text}
        </Button>
      );
    }

    return () => {
      if (!props.show) {
        return null;
      }

      return (
        <Col {...unref(actionColOpt)} style={{ textAlign: 'right' }}>
          {() => (
            <Form.Item>
              {() => (
                <>
                  {getSlot(slots, 'advanceBefore')}
                  {renderAdvanceButton()}

                  {getSlot(slots, 'resetBefore')}
                  {renderResetButton()}

                  {getSlot(slots, 'submitBefore')}
                  {renderSubmitButton()}

                  {getSlot(slots, 'submitAfter')}
                </>
              )}
            </Form.Item>
          )}
        </Col>
      );
    };
  },
});
