<template>
  <Select
    @dropdown-visible-change="handleFetch"
    v-bind="$attrs"
    @change="handleChange"
    :options="getOptions"
    v-model:value="state"
  >
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
    <template #suffixIcon v-if="loading">
      <LoadingOutlined spin />
    </template>
    <template #notFoundContent v-if="loading">
      <span>
        <LoadingOutlined spin class="mr-1" />
        {{ t('component.form.apiSelectNotFound') }}
      </span>
    </template>
  </Select>
</template>
<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  watchEffect,
  computed,
  unref,
  watch,
} from 'vue'
import { Select } from 'ant-design-vue'
import { isFunction, get, omit } from '@admin/utils'
import { useRuleFormItem } from '@/hooks/component/useFormItem'
import { LoadingOutlined } from '@ant-design/icons-vue'
import { useI18n } from '@admin/locale'
import { useAttrs } from '@admin/use'

type OptionsItem = { label: string; value: string; disabled?: boolean }

export default defineComponent({
  name: 'ApiSelect',
  components: {
    Select,
    LoadingOutlined,
  },
  inheritAttrs: false,
  props: {
    value: [Array, Object, String, Number],
    numberToString: { type: Boolean },
    api: {
      type: Function as PropType<(arg?: Recordable) => Promise<OptionsItem[]>>,
      default: null,
    },
    // api params
    params: {
      type: Object as PropType<Recordable>,
      default: () => ({}),
    },
    // support xxx.xxx.xx
    resultField: { type: String, default: '' },
    labelField: { type: String, default: 'label' },
    valueField: { type: String, default: 'value' },
    immediate: { type: Boolean, default: true },
    alwaysLoad: { type: Boolean, default: false },
  },
  emits: ['options-change', 'change'],
  setup(props, { emit }) {
    const options = ref<OptionsItem[]>([])
    const loading = ref(false)
    const isFirstLoad = ref(true)
    const emitData = ref<any[]>([])
    const attrs = useAttrs()
    const { t } = useI18n()

    // Embedded in the form, just use the hook binding to perform form verification
    const [state] = useRuleFormItem(props, 'value', 'change', emitData)

    const getOptions = computed(() => {
      const { labelField, valueField, numberToString } = props

      return unref(options).reduce((prev, next: Recordable) => {
        if (next) {
          const value = next[valueField]
          prev.push({
            ...omit(next, [labelField, valueField]),
            label: next[labelField],
            value: numberToString ? `${value}` : value,
          })
        }
        return prev
      }, [] as OptionsItem[])
    })

    watchEffect(() => {
      props.immediate && !props.alwaysLoad && fetch()
    })

    watch(
      () => props.params,
      () => {
        !unref(isFirstLoad) && fetch()
      },
      { deep: true },
    )

    async function fetch() {
      const api = props.api
      if (!api || !isFunction(api)) return
      options.value = []
      try {
        loading.value = true
        const res = await api(props.params)
        if (Array.isArray(res)) {
          options.value = res
          emitChange()
          return
        }
        if (props.resultField) {
          options.value = get(res, props.resultField) || []
        }
        emitChange()
      } catch (error) {
        console.warn(error)
      } finally {
        loading.value = false
      }
    }

    async function handleFetch(visible) {
      if (visible) {
        if (props.alwaysLoad) {
          await fetch()
        } else if (!props.immediate && unref(isFirstLoad)) {
          await fetch()
          isFirstLoad.value = false
        }
      }
    }

    function emitChange() {
      emit('options-change', unref(getOptions))
    }

    function handleChange(_, ...args) {
      emitData.value = args
    }

    return {
      state,
      attrs,
      getOptions,
      loading,
      t,
      handleFetch,
      handleChange,
    }
  },
})
</script>
