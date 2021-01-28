<template>
  <div :class="prefixCls">
    <InputPassword
      v-if="showInput"
      v-bind="$attrs"
      allowClear
      :value="innerValueRef"
      @change="handleChange"
      :disabled="disabled"
    >
      <template #[item]="data" v-for="item in Object.keys($slots)">
        <slot :name="item" v-bind="data"></slot>
      </template>
    </InputPassword>
    <div :class="`${prefixCls}-bar`">
      <div :class="`${prefixCls}-bar--fill`" :data-score="getPasswordStrength"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import { PropType } from 'vue';

  import { defineComponent, computed, ref, watch, unref, watchEffect } from 'vue';

  import { Input } from 'ant-design-vue';

  import zxcvbn from 'zxcvbn';
  import { propTypes } from '/@/utils/propTypes';
  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    name: 'StrengthMeter',
    components: { InputPassword: Input.Password },
    props: {
      value: propTypes.string,

      userInputs: {
        type: Array as PropType<string[]>,
        default: () => [],
      },

      showInput: propTypes.bool.def(true),
      disabled: propTypes.bool,
    },
    emits: ['score-change', 'change'],
    setup(props, { emit }) {
      const innerValueRef = ref('');
      const { prefixCls } = useDesign('strength-meter');

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

      return {
        getPasswordStrength,
        handleChange,
        prefixCls,
        innerValueRef,
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-strength-meter';

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

      &--fill {
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
