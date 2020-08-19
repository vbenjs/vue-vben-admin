<script lang="tsx">
  import { defineComponent, computed, PropOptions, ref, watch, unref } from 'compatible-vue';
  import { useDesign } from '@/hooks/core/useDesign';

  import { Input } from 'ant-design-vue';

  import zxcvbn from 'zxcvbn';
  import { extendSlots } from '@/utils/helper/tsxHelper';
  export default defineComponent({
    name: 'StrengMeter',
    props: {
      value: {
        type: String,
      } as PropOptions<string>,

      userInputs: {
        type: Array,
        default: () => [],
      } as PropOptions<string[]>,

      showInput: {
        type: Boolean,
        default: true,
      } as PropOptions<boolean>,
      disabled: {
        type: Boolean,
        default: false,
      } as PropOptions<boolean>,
    },
    setup(props, { emit, attrs, slots, listeners }) {
      const innerValueRef = ref('');
      const { prefixCls } = useDesign('streng-meter');

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

      watch(
        () => props.value,
        (val = '') => {
          innerValueRef.value = val;
        },
        { immediate: true }
      );
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
                allowClear={true}
                value={unref(innerValueRef)}
                onChange={handleChange}
                props={attrs}
                on={listeners}
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
</script>
<style scoped lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-streng-meter';

  .@{prefix-cls} {
    position: relative;

    &-bar {
      position: relative;
      height: 4px;
      margin: 10px auto 6px;
      background: @disabled-color;
      border-radius: 3px;

      &::before,
      &::after {
        position: absolute;
        z-index: 10;
        display: block;
        width: 20%;
        height: inherit;
        background: transparent;
        border-color: @white;
        border-style: solid;
        border-width: 0 5px 0 5px;
        content: '';
      }

      &::before {
        left: 20%;
      }

      &::after {
        right: 20%;
      }

      &__fill {
        position: absolute;
        width: 0;
        height: inherit;
        background: transparent;
        border-radius: inherit;
        transition: width 0.5s ease-in-out, background 0.25s;

        &[data-score='0'] {
          width: 20%;
          background: darken(@error-color, 10%);
        }

        &[data-score='1'] {
          width: 40%;
          background: @error-color;
        }

        &[data-score='2'] {
          width: 60%;
          background: @warning-color;
        }

        &[data-score='3'] {
          width: 80%;
          background: fade(@success-color, 50%);
        }

        &[data-score='4'] {
          width: 100%;
          background: @success-color;
        }
      }
    }
  }
</style>
