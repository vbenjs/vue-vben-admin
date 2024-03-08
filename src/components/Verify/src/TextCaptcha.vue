<template>
  <Tooltip>
    <template #title>{{ t('component.verify.refresh') }}</template>
    <img :height="height" :src="imageSrc" @click="refresh" />
  </Tooltip>
</template>

<script setup lang="ts">
  import { Tooltip } from 'ant-design-vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { propTypes } from '@/utils/propTypes';
  import { computed, ref, unref } from 'vue';

  const props = defineProps({
    height: propTypes.string.def('px'),
    api: {
      type: Function as PropType<() => Promise<any>>,
      required: true,
    },
  });

  const emit = defineEmits(['after-refresh']);

  const { t } = useI18n();

  const captchaData = ref<Recordable>({});

  const imageSrc = computed(() => {
    return unref(captchaData).text?.image;
  });

  const refresh = async () => {
    captchaData.value = await props.api();
    emit('after-refresh', unref(captchaData));
  };
  refresh();

  const createValidateParameter = (data) => {
    const { key, type } = unref(captchaData);

    return {
      key,
      type,
      text: {
        code: data,
      },
    };
  };
  defineExpose({
    refresh,
    createValidateParameter,
  });
</script>

<style scoped lang="less"></style>
