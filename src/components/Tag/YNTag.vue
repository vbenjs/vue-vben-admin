<template>
  <Tag v-if="text === N" :color="falseColor">{{ falseLabel }}</Tag>
  <Tag v-if="text === Y" :color="trueColor ?? primaryColor">{{ trueLabel }}</Tag>
</template>
<script lang="ts" setup>
  import { Tag } from 'ant-design-vue';
  import { YN } from '@/enums/YN';
  import { computed } from 'vue';
  import setting from '@/settings/projectSetting';

  const props = defineProps({
    text: {
      type: String as PropType<YN | string>,
    },
    trueValue: {
      type: String,
    },
    falseValue: {
      type: String,
    },
    trueLabel: {
      type: String,
      default: '是',
    },
    falseLabel: {
      type: String,
      default: '否',
    },
    trueColor: {
      type: String,
    },
    falseColor: {
      type: String,
    },
  });
  const primaryColor = setting.themeColor;
  const Y = computed(() => {
    return props.trueValue || YN.Y;
  });

  const N = computed(() => {
    return props.falseValue || YN.N;
  });
</script>
