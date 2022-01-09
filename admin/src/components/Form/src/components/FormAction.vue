<template>
  <a-col v-bind="actionColOpt" v-if="showActionButtonGroup">
    <div
      style="width: 100%"
      :style="{ textAlign: actionColOpt.style.textAlign }"
    >
      <FormItem>
        <slot name="resetBefore"></slot>
        <Button
          type="default"
          class="mr-2"
          v-bind="getResetBtnOptions"
          @click="resetAction"
          v-if="showResetButton"
        >
          {{ getResetBtnOptions.text }}
        </Button>
        <slot name="submitBefore"></slot>

        <Button
          type="primary"
          class="mr-2"
          v-bind="getSubmitBtnOptions"
          @click="submitAction"
          v-if="showSubmitButton"
        >
          {{ getSubmitBtnOptions.text }}
        </Button>

        <slot name="advanceBefore"></slot>
        <Button
          type="link"
          size="small"
          @click="toggleAdvanced"
          v-if="showAdvancedButton && !hideAdvanceBtn"
        >
          {{
            isAdvanced
              ? t('component.form.putAway')
              : t('component.form.unfold')
          }}
          <BasicArrow class="ml-1" :expand="!isAdvanced" up />
        </Button>
        <slot name="advanceAfter"></slot>
      </FormItem>
    </div>
  </a-col>
</template>
<script lang="ts">
import type { ColEx } from '../types/index'
//import type { ButtonProps } from 'ant-design-vue/es/button/buttonTypes';
import { defineComponent, computed, PropType } from 'vue'
import { Form, Col } from 'ant-design-vue'
import { Button, ButtonProps } from '@/components/Button'
import { BasicArrow } from '@/components/Basic'
import { useFormContext } from '../hooks/useFormContext'
import { useI18n } from '@admin/locale'

type ButtonOptions = Partial<ButtonProps> & { text: string }

export default defineComponent({
  name: 'BasicFormAction',
  components: {
    FormItem: Form.Item,
    Button,
    BasicArrow,
    [Col.name]: Col,
  },
  props: {
    showActionButtonGroup: { type: Boolean, default: true },
    showResetButton: { type: Boolean, default: true },
    showSubmitButton: { type: Boolean, default: true },
    showAdvancedButton: { type: Boolean, default: true },
    resetButtonOptions: {
      type: Object as PropType<ButtonOptions>,
      default: () => ({}),
    },
    submitButtonOptions: {
      type: Object as PropType<ButtonOptions>,
      default: () => ({}),
    },
    actionColOptions: {
      type: Object as PropType<Partial<ColEx>>,
      default: () => ({}),
    },
    actionSpan: { type: Number, default: 6 },
    isAdvanced: { type: Boolean },
    hideAdvanceBtn: { type: Boolean },
  },
  emits: ['toggle-advanced'],
  setup(props, { emit }) {
    const { t } = useI18n()

    const actionColOpt = computed(() => {
      const { showAdvancedButton, actionSpan: span, actionColOptions } = props
      const actionSpan = 24 - span
      const advancedSpanObj = showAdvancedButton
        ? { span: actionSpan < 6 ? 24 : actionSpan }
        : {}
      const actionColOpt: Partial<ColEx> = {
        style: { textAlign: 'right' },
        span: showAdvancedButton ? 6 : 4,
        ...advancedSpanObj,
        ...actionColOptions,
      }
      return actionColOpt
    })

    const getResetBtnOptions = computed((): ButtonOptions => {
      return Object.assign(
        {
          text: t('common.resetText'),
        },
        props.resetButtonOptions,
      )
    })

    const getSubmitBtnOptions = computed(() => {
      return Object.assign(
        {
          text: t('common.queryText'),
        },
        props.submitButtonOptions,
      )
    })

    function toggleAdvanced() {
      emit('toggle-advanced')
    }

    return {
      t,
      actionColOpt,
      getResetBtnOptions,
      getSubmitBtnOptions,
      toggleAdvanced,
      ...useFormContext(),
    }
  },
})
</script>
