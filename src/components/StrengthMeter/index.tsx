import { PropType } from 'vue';

import { defineComponent, computed, ref, watch, unref, watchEffect } from 'vue';

import { Input } from 'ant-design-vue';

import zxcvbn from 'zxcvbn';
import { extendSlots } from '/@/utils/helper/tsxHelper';

import './index.less';
const prefixCls = 'strength-meter';
export default defineComponent({
  name: 'StrengthMeter',
  emits: ['score-change', 'change'],
  props: {
    value: {
      type: String as PropType<string>,
      default: undefined,
    },

    userInputs: {
      type: Array as PropType<string[]>,
      default: () => [],
    },

    showInput: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    disabled: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  setup(props, { emit, attrs, slots }) {
    const innerValueRef = ref('');
    const getPasswordStrength = computed(() => {
      const { userInputs, disabled } = props;
      if (disabled) return null;
      const innerValue = unref(innerValueRef);
      const score = innerValue
        ? zxcvbn(unref(innerValueRef), (userInputs as string[]) || null).score
        : null;
      emit('score-change', score);
      return score;
    });

    function handleChange(e: ChangeEvent) {
      innerValueRef.value = e.target.value;
    }

    watchEffect(() => {
      innerValueRef.value = props.value || '';
    });
    watch(
      () => unref(innerValueRef),
      (val) => {
        emit('change', val);
      }
    );

    return () => {
      const { showInput, disabled } = props;
      return (
        <div class={prefixCls}>
          {showInput && (
            <Input.Password
              {...attrs}
              allowClear={true}
              value={unref(innerValueRef)}
              onChange={handleChange}
              disabled={disabled}
            >
              {extendSlots(slots)}
            </Input.Password>
          )}
          <div class={`${prefixCls}-bar`}>
            <div class={`${prefixCls}-bar__fill`} data-score={unref(getPasswordStrength)}></div>
          </div>
        </div>
      );
    };
  },
});
